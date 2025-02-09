/*
  # Fix Authentication Setup
  
  1. Creates test users with proper auth configuration
  2. Sets up user roles and subscription tiers
  3. Ensures email confirmation is disabled
  4. Adds unique constraint for user_id in subscriptions
*/

-- Add unique constraint to subscriptions table for user_id
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- Function to safely create or update a test user
CREATE OR REPLACE FUNCTION create_test_user(
  p_email TEXT,
  p_role user_role,
  p_tier subscription_tier
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) INTO v_exists;

  IF NOT v_exists THEN
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
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      p_email,
      crypt('Test123#', gen_salt('bf')),
      now(), -- Auto-confirm email
      jsonb_build_object(
        'provider', 'email',
        'role', p_role,
        'subscription_tier', p_tier
      ),
      now(),
      now(),
      encode(gen_random_bytes(32), 'hex'),
      encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO v_user_id;

    -- Create public user record
    INSERT INTO public.users (id, role, subscription_tier)
    VALUES (v_user_id, p_role, p_tier);

    -- Create subscription if user has a tier
    IF p_tier IS NOT NULL THEN
      INSERT INTO public.subscriptions (
        id,
        user_id,
        plan_id,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        metadata
      ) VALUES (
        gen_random_uuid(),
        v_user_id,
        p_tier::TEXT,
        'active',
        now(),
        CASE 
          WHEN p_tier = 'bronze' THEN now() + interval '1 day'
          ELSE now() + interval '1 year'
        END,
        false,
        jsonb_build_object(
          'amount', 
          CASE 
            WHEN p_tier = 'platinum' THEN 10000
            WHEN p_tier = 'gold' THEN 5000
            WHEN p_tier = 'silver' THEN 1200
            WHEN p_tier = 'bronze' THEN 10
          END
        )
      );
    END IF;
  END IF;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create test users
DO $$ 
BEGIN
  -- Create admin user
  PERFORM create_test_user('admin@test.com', 'admin', 'platinum');
  
  -- Create subscriber users
  PERFORM create_test_user('gold@test.com', 'subscriber', 'gold');
  PERFORM create_test_user('silver@test.com', 'subscriber', 'silver');
  PERFORM create_test_user('bronze@test.com', 'subscriber', 'bronze');
  
  -- Create guest user
  PERFORM create_test_user('guest1@test.com', 'guest', NULL);
END $$;

-- Clean up
DROP FUNCTION create_test_user;