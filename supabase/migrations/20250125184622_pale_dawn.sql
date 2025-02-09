/*
  # Create Test Accounts

  1. Changes
    - Create 6 test accounts with different roles and subscription tiers
    - Set up appropriate permissions for each account

  2. Security
    - Maintain existing RLS policies
    - Each account has appropriate role and subscription tier
*/

DO $$ 
BEGIN 
  -- Test Account 1: Admin with Platinum subscription
  INSERT INTO public.users (id, role, subscription_tier)
  SELECT id, 'admin'::user_role, 'platinum'::subscription_tier
  FROM auth.users
  WHERE email = 'admin@test.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'admin'::user_role,
      subscription_tier = 'platinum'::subscription_tier;

  -- Test Account 2: Subscriber with Gold subscription
  INSERT INTO public.users (id, role, subscription_tier)
  SELECT id, 'subscriber'::user_role, 'gold'::subscription_tier
  FROM auth.users
  WHERE email = 'gold@test.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'subscriber'::user_role,
      subscription_tier = 'gold'::subscription_tier;

  -- Test Account 3: Subscriber with Silver subscription
  INSERT INTO public.users (id, role, subscription_tier)
  SELECT id, 'subscriber'::user_role, 'silver'::subscription_tier
  FROM auth.users
  WHERE email = 'silver@test.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'subscriber'::user_role,
      subscription_tier = 'silver'::subscription_tier;

  -- Test Account 4: Subscriber with Bronze subscription
  INSERT INTO public.users (id, role, subscription_tier)
  SELECT id, 'subscriber'::user_role, 'bronze'::subscription_tier
  FROM auth.users
  WHERE email = 'bronze@test.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'subscriber'::user_role,
      subscription_tier = 'bronze'::subscription_tier;

  -- Test Account 5: Guest with no subscription
  INSERT INTO public.users (id, role, subscription_tier)
  SELECT id, 'guest'::user_role, NULL
  FROM auth.users
  WHERE email = 'guest1@test.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'guest'::user_role,
      subscription_tier = NULL;

  -- Test Account 6: Guest with no subscription
  INSERT INTO public.users (id, role, subscription_tier)
  SELECT id, 'guest'::user_role, NULL
  FROM auth.users
  WHERE email = 'guest2@test.com'
  ON CONFLICT (id) DO UPDATE 
  SET role = 'guest'::user_role,
      subscription_tier = NULL;
END $$;