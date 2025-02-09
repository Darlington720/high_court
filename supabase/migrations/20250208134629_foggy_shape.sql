/*
  # Fix Test Users Setup
  
  This migration properly sets up test user accounts with appropriate roles and subscriptions.
  It handles existing users gracefully and ensures proper auth setup.
*/

-- Create test users with proper auth setup
DO $$ 
DECLARE
  v_admin_id UUID;
  v_gold_id UUID;
  v_silver_id UUID;
  v_bronze_id UUID;
  v_guest_id UUID;
BEGIN
  -- Get or create users from auth schema
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@test.com';
  SELECT id INTO v_gold_id FROM auth.users WHERE email = 'gold@test.com';
  SELECT id INTO v_silver_id FROM auth.users WHERE email = 'silver@test.com';
  SELECT id INTO v_bronze_id FROM auth.users WHERE email = 'bronze@test.com';
  SELECT id INTO v_guest_id FROM auth.users WHERE email = 'guest1@test.com';

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