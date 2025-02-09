/*
  # Initial Schema Setup

  1. Tables
    - users
      - Extended from auth.users
      - Stores user role and subscription information
    - documents
      - Stores document metadata and references
    - categories
      - Stores document categories and subcategories
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'subscriber', 'guest');
CREATE TYPE subscription_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Create users table extending auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'guest'::user_role,
  subscription_tier subscription_tier,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
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
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subcategories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

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

-- Insert initial categories
INSERT INTO public.categories (name, subcategories) VALUES
  ('Hansards', ARRAY['Federal', 'State']),
  ('Gazettes', ARRAY['Federal', 'State']),
  ('Courts of Record', ARRAY['Supreme Court', 'High Court', 'Appeal Court']),
  ('State Tribunals', ARRAY['Election', 'Land', 'Tax'])
ON CONFLICT (name) DO NOTHING;