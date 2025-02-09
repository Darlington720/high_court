/*
  # Update categories structure

  1. Changes
    - Update existing categories with new subcategories
    - Add new categories for Acts of Parliament and Statutory Instruments
    - Add new categories for Open Access Resources and Blog
    - Add new category for About Educite
    - Add new category for Our Partners

  2. Security
    - Maintains existing RLS policies
*/

-- Update Hansards subcategories
UPDATE public.categories 
SET subcategories = ARRAY[
  'Hansards 2025-2004',
  'Hansards 2003',
  'Hansards 2002',
  'Hansards 2001',
  'Hansards 2000',
  'Hansards 1999',
  'Hansards 1998'
]
WHERE name = 'Hansards';

-- Update Courts of Record subcategories
UPDATE public.categories 
SET subcategories = ARRAY[
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
]
WHERE name = 'Courts of Record';

-- Update State Tribunals subcategories
UPDATE public.categories 
SET subcategories = ARRAY[
  'Center for Arbitration and Dispute Resolution of Uganda',
  'Equal Opportunities Commission',
  'Insurance Appeals Tribunal (Uganda)',
  'Leadership Code Tribunal of Uganda',
  'Public Procurement and Disposal of Public Assets Appeals Tribunal',
  'Tax Appeals Tribunal (Uganda)'
]
WHERE name = 'State Tribunals';

-- Insert new categories
INSERT INTO public.categories (name, subcategories)
VALUES
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
ON CONFLICT (name) 
DO UPDATE SET subcategories = EXCLUDED.subcategories;