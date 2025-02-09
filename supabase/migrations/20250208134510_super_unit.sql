/*
  # Create Test Users Migration

  1. Purpose
    - Creates test user accounts with different roles and subscription tiers
    - Sets up proper auth and public user records
    - Ensures consistent test data for development

  2. Test Accounts
    - Admin: admin@test.com / Test123#
    - Gold: gold@test.com / Test123#
    - Silver: silver@test.com / Test123#
    - Bronze: bronze@test.com / Test123#
    - Guest: guest1@test.com / Test123#

  3. Security
    - Passwords are properly hashed
    - Email confirmation is pre-set
    - Proper role and tier assignments
*/

-- Function to safely create or update a test user
CREATE OR REPLACE FUNCTION safely_create_test_user(
  p_email TEXT,
  p_password TEXT,
  p_role TEXT
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) INTO v_exists;

  IF v_exists THEN
    -- Get existing user id
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email;

    -- Update existing user
    UPDATE auth.users SET
      encrypted_password = crypt(p_password, gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now(),
      raw_user_meta_data = jsonb_build_object('provider', 'email'),
      role = p_role
    WHERE id = v_user_id;
  ELSE
    -- Create new user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      p_role,
      p_email,
      crypt(p_password, gen_salt('bf')),
      now(),
      jsonb_build_object('provider', 'email'),
      now(),
      now(),
      encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO v_user_id;
  END IF;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create test users
DO $$ 
DECLARE
  v_admin_id UUID;
  v_gold_id UUID;
  v_silver_id UUID;
  v_bronze_id UUID;
  v_guest_id UUID;
BEGIN
  -- Create or update users
  v_admin_id := safely_create_test_user('admin@test.com', 'Test123#', 'authenticated');
  v_gold_id := safely_create_test_user('gold@test.com', 'Test123#', 'authenticated');
  v_silver_id := safely_create_test_user('silver@test.com', 'Test123#', 'authenticated');
  v_bronze_id := safely_create_test_user('bronze@test.com', 'Test123#', 'authenticated');
  v_guest_id := safely_create_test_user('guest1@test.com', 'Test123#', 'authenticated');

  -- Create or update public user records
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES 
    (v_admin_id, 'admin', 'platinum'),
    (v_gold_id, 'subscriber', 'gold'),
    (v_silver_id, 'subscriber', 'silver'),
    (v_bronze_id, 'subscriber', 'bronze'),
    (v_guest_id, 'guest', NULL)
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    subscription_tier = EXCLUDED.subscription_tier,
    updated_at = now();

  -- Create or update subscriptions for paid tiers
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    start_date,
    end_date,
    amount,
    currency,
    auto_renew
  ) VALUES 
    (v_admin_id, 'platinum', 'active', now(), now() + interval '1 year', 10000, 'USD', true),
    (v_gold_id, 'gold', 'active', now(), now() + interval '1 year', 5000, 'USD', true),
    (v_silver_id, 'silver', 'active', now(), now() + interval '1 year', 1200, 'USD', true),
    (v_bronze_id, 'bronze', 'active', now(), now() + interval '1 day', 10, 'USD', true)
  ON CONFLICT (user_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    end_date = EXCLUDED.end_date,
    amount = EXCLUDED.amount,
    updated_at = now();

END $$;

-- Clean up
DROP FUNCTION safely_create_test_user;