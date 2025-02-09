/*
  # Verify Database Schema

  1. Verification
    - Check if all tables exist
    - Verify relationships
    - Add missing indexes
    - Fix any missing policies

  2. Security
    - Add missing RLS policies
    - Ensure proper access control
*/

-- Verify tables exist and create if missing
DO $$ 
BEGIN
  -- Verify users table
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'users'
  ) THEN
    RAISE NOTICE 'Creating users table';
    CREATE TABLE public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      role user_role DEFAULT 'guest'::user_role,
      subscription_tier subscription_tier,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;

  -- Verify payment_methods table
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'payment_methods'
  ) THEN
    RAISE NOTICE 'Creating payment_methods table';
    CREATE TABLE public.payment_methods (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('card', 'mobile_money', 'bank_transfer')),
      details JSONB NOT NULL,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;

  -- Verify payments table
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'payments'
  ) THEN
    RAISE NOTICE 'Creating payments table';
    CREATE TABLE public.payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      amount DECIMAL NOT NULL CHECK (amount >= 0),
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
      payment_method_id UUID REFERENCES public.payment_methods(id),
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;

  -- Verify subscriptions table
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'subscriptions'
  ) THEN
    RAISE NOTICE 'Creating subscriptions table';
    CREATE TABLE public.subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL CHECK (plan IN ('bronze', 'silver', 'gold', 'platinum')),
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended', 'expired')),
      start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
      end_date TIMESTAMPTZ NOT NULL,
      amount DECIMAL NOT NULL CHECK (amount >= 0),
      currency TEXT NOT NULL DEFAULT 'USD',
      auto_renew BOOLEAN DEFAULT true,
      payment_method_id UUID REFERENCES public.payment_methods(id),
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      CONSTRAINT valid_date_range CHECK (end_date > start_date)
    );
  END IF;
END $$;

-- Verify and create missing indexes
DO $$
BEGIN
  -- Subscriptions indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_user_id') THEN
    CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_plan') THEN
    CREATE INDEX idx_subscriptions_plan ON public.subscriptions(plan);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_status') THEN
    CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
  END IF;

  -- Payments indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
    CREATE INDEX idx_payments_user_id ON public.payments(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON public.payments(status);
  END IF;

  -- Payment methods indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_methods_user_id') THEN
    CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
  END IF;
END $$;

-- Verify and create missing RLS policies
DO $$
BEGIN
  -- Subscriptions policies
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscriptions"
      ON public.subscriptions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Admins can view all subscriptions'
  ) THEN
    CREATE POLICY "Admins can view all subscriptions"
      ON public.subscriptions
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;

  -- Payment methods policies
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'payment_methods' AND policyname = 'Users can view their own payment methods'
  ) THEN
    CREATE POLICY "Users can view their own payment methods"
      ON public.payment_methods
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Payments policies
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'Users can view their own payments'
  ) THEN
    CREATE POLICY "Users can view their own payments"
      ON public.payments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Enable RLS on all tables if not already enabled
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Insert test data for subscriptions if none exist
INSERT INTO public.subscriptions (
  user_id,
  plan,
  status,
  start_date,
  end_date,
  amount,
  currency
)
SELECT 
  u.id,
  CASE 
    WHEN u.subscription_tier = 'bronze' THEN 'bronze'
    WHEN u.subscription_tier = 'silver' THEN 'silver'
    WHEN u.subscription_tier = 'gold' THEN 'gold'
    WHEN u.subscription_tier = 'platinum' THEN 'platinum'
  END,
  'active',
  now(),
  now() + interval '1 year',
  CASE 
    WHEN u.subscription_tier = 'bronze' THEN 10
    WHEN u.subscription_tier = 'silver' THEN 1200
    WHEN u.subscription_tier = 'gold' THEN 5000
    WHEN u.subscription_tier = 'platinum' THEN 10000
  END,
  'USD'
FROM public.users u
WHERE u.subscription_tier IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 
    FROM public.subscriptions s 
    WHERE s.user_id = u.id
  );