-- Drop current_title column from linkedin_profiles
-- Decided to keep title info in headline/raw_data instead

ALTER TABLE public.linkedin_profiles
DROP COLUMN IF EXISTS current_title;
