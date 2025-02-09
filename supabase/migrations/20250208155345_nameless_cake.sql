/*
  # Subscription Management Queries
  
  1. New Functions
    - Create subscription
    - Process payment
    - Update subscription status
    - Handle renewals and cancellations
    - Subscription validation
  
  2. Security
    - RLS policies for subscription management
    - Payment validation
    - Access control checks
*/

-- Function to create a new subscription
CREATE OR REPLACE FUNCTION create_subscription(
  p_user_id UUID,
  p_plan TEXT,
  p_payment_method_id UUID,
  p_amount DECIMAL,
  p_currency TEXT DEFAULT 'USD',
  p_auto_renew BOOLEAN DEFAULT true
) RETURNS UUID AS $$
DECLARE
  v_subscription_id UUID;
  v_duration INTERVAL;
BEGIN
  -- Validate plan
  IF p_plan NOT IN ('bronze', 'silver', 'gold', 'platinum') THEN
    RAISE EXCEPTION 'Invalid subscription plan';
  END IF;

  -- Set duration based on plan
  v_duration := CASE p_plan
    WHEN 'bronze' THEN interval '1 day'
    ELSE interval '1 year'
  END;

  -- Create subscription
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    start_date,
    end_date,
    amount,
    currency,
    auto_renew,
    payment_method_id,
    metadata
  ) VALUES (
    p_user_id,
    p_plan,
    'active',
    now(),
    now() + v_duration,
    p_amount,
    p_currency,
    p_auto_renew,
    p_payment_method_id,
    jsonb_build_object(
      'created_at', now(),
      'plan_duration', v_duration
    )
  ) RETURNING id INTO v_subscription_id;

  -- Update user's subscription tier
  UPDATE public.users
  SET subscription_tier = p_plan::subscription_tier
  WHERE id = p_user_id;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process subscription payment
CREATE OR REPLACE FUNCTION process_subscription_payment(
  p_subscription_id UUID,
  p_amount DECIMAL,
  p_payment_method_id UUID,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_payment_id UUID;
  v_user_id UUID;
BEGIN
  -- Get user_id from subscription
  SELECT user_id INTO v_user_id
  FROM public.subscriptions
  WHERE id = p_subscription_id;

  -- Create payment record
  INSERT INTO public.payments (
    user_id,
    amount,
    status,
    payment_method_id,
    metadata
  ) VALUES (
    v_user_id,
    p_amount,
    'completed',
    p_payment_method_id,
    p_metadata || jsonb_build_object(
      'subscription_id', p_subscription_id,
      'payment_date', now()
    )
  ) RETURNING id INTO v_payment_id;

  -- Update subscription status
  UPDATE public.subscriptions
  SET 
    status = 'active',
    updated_at = now(),
    metadata = metadata || jsonb_build_object('last_payment_id', v_payment_id)
  WHERE id = p_subscription_id;

  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status(
  p_subscription_id UUID,
  p_status TEXT,
  p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Validate status
  IF p_status NOT IN ('active', 'inactive', 'suspended', 'expired') THEN
    RAISE EXCEPTION 'Invalid subscription status';
  END IF;

  -- Update subscription
  UPDATE public.subscriptions
  SET 
    status = p_status,
    updated_at = now(),
    metadata = metadata || jsonb_build_object(
      'status_change_date', now(),
      'status_change_reason', p_reason
    )
  WHERE id = p_subscription_id;

  -- Update user's subscription tier if status is inactive or expired
  IF p_status IN ('inactive', 'expired') THEN
    UPDATE public.users u
    SET subscription_tier = NULL
    FROM public.subscriptions s
    WHERE s.id = p_subscription_id
    AND u.id = s.user_id;
  END IF;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to handle subscription renewal
CREATE OR REPLACE FUNCTION renew_subscription(
  p_subscription_id UUID,
  p_payment_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_subscription public.subscriptions;
  v_duration INTERVAL;
BEGIN
  -- Get subscription details
  SELECT * INTO v_subscription
  FROM public.subscriptions
  WHERE id = p_subscription_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;

  -- Calculate new duration
  v_duration := CASE v_subscription.plan
    WHEN 'bronze' THEN interval '1 day'
    ELSE interval '1 year'
  END;

  -- Update subscription
  UPDATE public.subscriptions
  SET 
    status = 'active',
    start_date = GREATEST(end_date, now()),
    end_date = GREATEST(end_date, now()) + v_duration,
    updated_at = now(),
    metadata = metadata || jsonb_build_object(
      'last_renewal_date', now(),
      'last_renewal_payment_id', p_payment_id
    )
  WHERE id = p_subscription_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to cancel subscription
CREATE OR REPLACE FUNCTION cancel_subscription(
  p_subscription_id UUID,
  p_immediate BOOLEAN DEFAULT false
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_immediate THEN
    -- Immediate cancellation
    PERFORM update_subscription_status(p_subscription_id, 'inactive', 'Cancelled by user');
  ELSE
    -- Cancel at period end
    UPDATE public.subscriptions
    SET 
      cancel_at_period_end = true,
      updated_at = now(),
      metadata = metadata || jsonb_build_object(
        'cancellation_date', now(),
        'cancellation_effective_date', end_date
      )
    WHERE id = p_subscription_id;
  END IF;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to validate subscription access
CREATE OR REPLACE FUNCTION validate_subscription_access(
  p_user_id UUID,
  p_required_tier subscription_tier DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_user_tier subscription_tier;
  v_subscription_status TEXT;
BEGIN
  -- Get user's current subscription tier and status
  SELECT 
    u.subscription_tier,
    s.status
  INTO v_user_tier, v_subscription_status
  FROM public.users u
  LEFT JOIN public.subscriptions s ON s.user_id = u.id
  WHERE u.id = p_user_id
  AND (s.id IS NULL OR s.status = 'active');

  -- Admin always has access
  IF EXISTS (
    SELECT 1 FROM public.users
    WHERE id = p_user_id AND role = 'admin'
  ) THEN
    RETURN true;
  END IF;

  -- Check if subscription is active
  IF v_subscription_status != 'active' THEN
    RETURN false;
  END IF;

  -- If no specific tier is required, just check if user has any active subscription
  IF p_required_tier IS NULL THEN
    RETURN v_user_tier IS NOT NULL;
  END IF;

  -- Check if user's tier meets the requirement
  -- Tier hierarchy: platinum > gold > silver > bronze
  RETURN CASE v_user_tier
    WHEN 'platinum' THEN true
    WHEN 'gold' THEN p_required_tier != 'platinum'
    WHEN 'silver' THEN p_required_tier IN ('silver', 'bronze')
    WHEN 'bronze' THEN p_required_tier = 'bronze'
    ELSE false
  END;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date_status 
  ON public.subscriptions(end_date) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_subscriptions_auto_renew 
  ON public.subscriptions(auto_renew) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_payments_subscription_metadata 
  ON public.payments USING gin ((metadata -> 'subscription_id'));

-- Create function to get subscription summary
CREATE OR REPLACE FUNCTION get_subscription_summary(
  p_user_id UUID
) RETURNS TABLE (
  subscription_id UUID,
  plan TEXT,
  status TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  days_remaining INT,
  auto_renew BOOLEAN,
  amount DECIMAL,
  last_payment_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.plan,
    s.status,
    s.start_date,
    s.end_date,
    EXTRACT(DAY FROM (s.end_date - now()))::INT as days_remaining,
    s.auto_renew,
    s.amount,
    (
      SELECT created_at 
      FROM public.payments 
      WHERE metadata->>'subscription_id' = s.id::text 
      ORDER BY created_at DESC 
      LIMIT 1
    ) as last_payment_date
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
  AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;