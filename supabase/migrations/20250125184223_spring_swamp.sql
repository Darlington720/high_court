/*
  # Database Rebuild

  1. Changes
    - Drop existing tables and types
    - Recreate all tables with proper structure
    - Set up RLS policies
    - Add initial data

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Ensure proper access control
*/

-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.payments;
DROP TABLE IF EXISTS public.payment_methods;
DROP TABLE IF EXISTS public.documents;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.users;
DROP TYPE IF EXISTS subscription_tier;
DROP TYPE IF EXISTS user_role;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'subscriber', 'guest');
CREATE TYPE subscription_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Create users table extending auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'guest'::user_role,
  subscription_tier subscription_tier,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subcategories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  details JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method_id UUID REFERENCES payment_methods(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method_id UUID REFERENCES payment_methods(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Documents are viewable by subscribers and admins"
  ON public.documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'subscriber')
    )
  );

CREATE POLICY "Categories are viewable by all authenticated users"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial categories
INSERT INTO public.categories (name, subcategories) VALUES
  ('Hansards', ARRAY[
    'Hansards 2025-2004',
    'Hansards 2003',
    'Hansards 2002',
    'Hansards 2001',
    'Hansards 2000',
    'Hansards 1999',
    'Hansards 1998'
  ]),
  ('Courts of Record', ARRAY[
    'Supreme Court of Uganda',
    'Court of Appeal of Uganda',
    'Constitutional Court of Uganda',
    'High Court of Uganda',
    'Commercial Court Division',
    'Anti-Corruption Division',
    'Civil Division',
    'Criminal Division',
    'Family Division',
    'International Crimes Division',
    'Land Division',
    'Industrial Court Division',
    'Election Petitions'
  ]),
  ('State Tribunals', ARRAY[
    'Center for Arbitration and Dispute Resolution of Uganda',
    'Equal Opportunities Commission',
    'Insurance Appeals Tribunal (Uganda)',
    'Leadership Code Tribunal of Uganda',
    'Public Procurement and Disposal of Public Assets Appeals Tribunal',
    'Tax Appeals Tribunal (Uganda)'
  ]),
  ('Acts of Parliament', ARRAY['Acts of Parliament']),
  ('Statutory Instruments', ARRAY[
    'Statutory Instruments 2003',
    'Statutory Instruments 2002',
    'Statutory Instruments 2001'
  ]),
  ('7th Revised Edition', ARRAY['7th Revised Edition of the Principal Laws of Uganda']),
  ('Open Access Resources', ARRAY['All Categories']),
  ('Blog', ARRAY['All Posts']),
  ('About Educite', ARRAY['About Us', 'Contact Us']),
  ('Our Partners', ARRAY['Partner List'])
ON CONFLICT (name) DO NOTHING;