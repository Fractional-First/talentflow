-- Add current_title column to linkedin_profiles
-- Note: This was subsequently dropped in the next migration

ALTER TABLE public.linkedin_profiles
ADD COLUMN IF NOT EXISTS current_title text;
