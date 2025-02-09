/*
  # Fix Authentication Setup
  
  This migration safely sets up user roles and subscriptions for existing auth users.
  It assumes the users have already been created through the Supabase Auth UI/API.
*/

-- Create or update user roles and subscriptions
DO $$ 
DECLARE
  v_admin_id UUID;
  v_gold_id UUID;
  v_silver_id UUID;
  v_bronze_id UUID;
  v_guest_id UUID;
BEGIN
  -- Get existing user IDs from auth schema
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@test.com';
  SELECT id INTO v_gold_id FROM auth.users WHERE email = 'gold@test.com';
  SELECT id INTO v_silver_id FROM auth.users WHERE email = 'silver@test.com';
  SELECT id INTO v_bronze_id FROM auth.users WHERE email = 'bronze@test.com';
  SELECT id INTO v_guest_id FROM auth.users WHERE email = 'guest1@test.com';

  -- Create or update public user records with proper roles
  INSERT INTO public.users (id, role, subscription_tier, metadata)
  VALUES 
    (v_admin_id, 'admin', 'platinum', jsonb_build_object('is_test_account', true)),
    (v_gold_id, 'subscriber', 'gold', jsonb_build_object('is_test_account', true)),
    (v_silver_id, 'subscriber', 'silver', jsonb_build_object('is_test_account', true)),
    (v_bronze_id, 'subscriber', 'bronze', jsonb_build_object('is_test_account', true)),
    (v_guest_id, 'guest', NULL, jsonb_build_object('is_test_account', true))
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    subscription_tier = EXCLUDED.subscription_tier,
    metadata = EXCLUDED.metadata,
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
    auto_renew,
    metadata
  ) VALUES 
    (v_admin_id, 'platinum', 'active', now(), now() + interval '1 year', 10000, 'USD', true, '{"is_test": true}'::jsonb),
    (v_gold_id, 'gold', 'active', now(), now() + interval '1 year', 5000, 'USD', true, '{"is_test": true}'::jsonb),
    (v_silver_id, 'silver', 'active', now(), now() + interval '1 year', 1200, 'USD', true, '{"is_test": true}'::jsonb),
    (v_bronze_id, 'bronze', 'active', now(), now() + interval '1 day', 10, 'USD', true, '{"is_test": true}'::jsonb)
  ON CONFLICT (user_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    end_date = EXCLUDED.end_date,
    amount = EXCLUDED.amount,
    metadata = EXCLUDED.metadata,
    updated_at = now();

END $$;