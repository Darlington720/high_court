/*
  # Create Test Users

  1. Test Accounts
    - Admin: admin@test.com / Test123#
    - Gold: gold@test.com / Test123#
    - Silver: silver@test.com / Test123#
    - Bronze: bronze@test.com / Test123#
    - Guest: guest1@test.com / Test123#

  2. User Roles and Tiers
    - Admin: admin role with platinum tier
    - Gold: subscriber role with gold tier
    - Silver: subscriber role with silver tier
    - Bronze: subscriber role with bronze tier
    - Guest: guest role with no tier
*/

-- Function to create test users
CREATE OR REPLACE FUNCTION create_test_user(
  p_email TEXT,
  p_password TEXT,
  p_role user_role,
  p_tier subscription_tier
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Create auth user if not exists
  INSERT INTO auth.users (
    email,
    raw_user_meta_data,
    created_at,
    updated_at,
    email_confirmed_at
  )
  VALUES (
    p_email,
    jsonb_build_object('provider', 'email'),
    now(),
    now(),
    now()
  )
  ON CONFLICT (email) DO UPDATE
  SET updated_at = now()
  RETURNING id INTO v_user_id;

  -- Set user password
  UPDATE auth.users
  SET encrypted_password = crypt(p_password, gen_salt('bf'))
  WHERE id = v_user_id;

  -- Create or update public user
  INSERT INTO public.users (
    id,
    role,
    subscription_tier,
    metadata
  )
  VALUES (
    v_user_id,
    p_role,
    p_tier,
    jsonb_build_object(
      'created_by', 'system',
      'is_test_account', true
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = p_role,
    subscription_tier = p_tier,
    updated_at = now();

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create test users
DO $$ 
DECLARE
  admin_id UUID;
  gold_id UUID;
  silver_id UUID;
  bronze_id UUID;
  guest_id UUID;
BEGIN
  -- Create admin user
  admin_id := create_test_user(
    'admin@test.com',
    'Test123#',
    'admin'::user_role,
    'platinum'::subscription_tier
  );

  -- Create gold user
  gold_id := create_test_user(
    'gold@test.com',
    'Test123#',
    'subscriber'::user_role,
    'gold'::subscription_tier
  );

  -- Create silver user
  silver_id := create_test_user(
    'silver@test.com',
    'Test123#',
    'subscriber'::user_role,
    'silver'::subscription_tier
  );

  -- Create bronze user
  bronze_id := create_test_user(
    'bronze@test.com',
    'Test123#',
    'subscriber'::user_role,
    'bronze'::subscription_tier
  );

  -- Create guest user
  guest_id := create_test_user(
    'guest1@test.com',
    'Test123#',
    'guest'::user_role,
    NULL
  );

  -- Create subscriptions for users with tiers
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    start_date,
    end_date,
    amount,
    currency,
    auto_renew
  )
  SELECT 
    id,
    subscription_tier::TEXT,
    'active',
    now(),
    now() + interval '1 year',
    CASE 
      WHEN subscription_tier = 'platinum' THEN 10000
      WHEN subscription_tier = 'gold' THEN 5000
      WHEN subscription_tier = 'silver' THEN 1200
      WHEN subscription_tier = 'bronze' THEN 10
    END,
    'USD',
    true
  FROM public.users
  WHERE subscription_tier IS NOT NULL
  ON CONFLICT DO NOTHING;

END $$;

-- Drop the temporary function
DROP FUNCTION create_test_user;