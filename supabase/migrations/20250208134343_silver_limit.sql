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

-- Create test users and their corresponding public records
DO $$ 
DECLARE
  v_admin_id UUID;
  v_gold_id UUID;
  v_silver_id UUID;
  v_bronze_id UUID;
  v_guest_id UUID;
BEGIN
  -- Admin user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    'admin@test.com',
    crypt('Test123#', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email')
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    encrypted_password = crypt('Test123#', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
  RETURNING id INTO v_admin_id;

  -- Gold user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    'gold@test.com',
    crypt('Test123#', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email')
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    encrypted_password = crypt('Test123#', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
  RETURNING id INTO v_gold_id;

  -- Silver user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    'silver@test.com',
    crypt('Test123#', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email')
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    encrypted_password = crypt('Test123#', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
  RETURNING id INTO v_silver_id;

  -- Bronze user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    'bronze@test.com',
    crypt('Test123#', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email')
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    encrypted_password = crypt('Test123#', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
  RETURNING id INTO v_bronze_id;

  -- Guest user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    'guest1@test.com',
    crypt('Test123#', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email')
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    encrypted_password = crypt('Test123#', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
  RETURNING id INTO v_guest_id;

  -- Create or update public user records
  -- Admin
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES (v_admin_id, 'admin', 'platinum')
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      subscription_tier = 'platinum',
      updated_at = now();

  -- Gold
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES (v_gold_id, 'subscriber', 'gold')
  ON CONFLICT (id) DO UPDATE
  SET role = 'subscriber',
      subscription_tier = 'gold',
      updated_at = now();

  -- Silver
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES (v_silver_id, 'subscriber', 'silver')
  ON CONFLICT (id) DO UPDATE
  SET role = 'subscriber',
      subscription_tier = 'silver',
      updated_at = now();

  -- Bronze
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES (v_bronze_id, 'subscriber', 'bronze')
  ON CONFLICT (id) DO UPDATE
  SET role = 'subscriber',
      subscription_tier = 'bronze',
      updated_at = now();

  -- Guest
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES (v_guest_id, 'guest', NULL)
  ON CONFLICT (id) DO UPDATE
  SET role = 'guest',
      subscription_tier = NULL,
      updated_at = now();

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
  ) VALUES 
  (v_admin_id, 'platinum', 'active', now(), now() + interval '1 year', 10000, 'USD', true),
  (v_gold_id, 'gold', 'active', now(), now() + interval '1 year', 5000, 'USD', true),
  (v_silver_id, 'silver', 'active', now(), now() + interval '1 year', 1200, 'USD', true),
  (v_bronze_id, 'bronze', 'active', now(), now() + interval '1 day', 10, 'USD', true)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    status = 'active',
    end_date = now() + interval '1 year',
    updated_at = now();

END $$;