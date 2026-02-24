-- Fix search_path on linkedin_profiles trigger function
-- This was applied separately from the table creation

CREATE OR REPLACE FUNCTION public.update_linkedin_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
