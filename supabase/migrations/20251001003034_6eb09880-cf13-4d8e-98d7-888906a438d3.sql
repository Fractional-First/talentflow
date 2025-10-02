-- Add anon_profile_data and anon_slug columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN anon_profile_data jsonb,
ADD COLUMN anon_slug text;

-- Create index on anon_slug for performance
CREATE INDEX idx_profiles_anon_slug ON public.profiles(anon_slug);

-- Add unique constraint on anon_slug to prevent duplicates
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_anon_slug_key UNIQUE (anon_slug);