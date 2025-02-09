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

-- Create test users in auth schema
DO $$ 
DECLARE
  v_admin_id UUID;
  v_gold_id UUID;
  v_silver_id UUID;
  v_bronze_id UUID;
  v_guest_id UUID;
  v_password_hash TEXT;
BEGIN
  -- Generate password hash once
  v_password_hash := crypt('Test123#', gen_salt('bf'));

  -- Admin user
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
    'authenticated',
    'admin@test.com',
    v_password_hash,
    now(),
    jsonb_build_object('provider', 'email'),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_admin_id;

  -- Gold user
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
    'authenticated',
    'gold@test.com',
    v_password_hash,
    now(),
    jsonb_build_object('provider', 'email'),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_gold_id;

  -- Silver user
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
    'authenticated',
    'silver@test.com',
    v_password_hash,
    now(),
    jsonb_build_object('provider', 'email'),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_silver_id;

  -- Bronze user
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
    'authenticated',
    'bronze@test.com',
    v_password_hash,
    now(),
    jsonb_build_object('provider', 'email'),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_bronze_id;

  -- Guest user
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
    'authenticated',
    'guest1@test.com',
    v_password_hash,
    now(),
    jsonb_build_object('provider', 'email'),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_guest_id;

  -- Create public user records
  INSERT INTO public.users (id, role, subscription_tier)
  VALUES 
    (v_admin_id, 'admin', 'platinum'),
    (v_gold_id, 'subscriber', 'gold'),
    (v_silver_id, 'subscriber', 'silver'),
    (v_bronze_id, 'subscriber', 'bronze'),
    (v_guest_id, 'guest', NULL);

  -- Create subscriptions for paid tiers
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
    (v_bronze_id, 'bronze', 'active', now(), now() + interval '1 day', 10, 'USD', true);

END $$;