-- Create trigger function to auto-generate profile_slug if not provided
CREATE OR REPLACE FUNCTION public.auto_generate_profile_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  generated_slug text;
BEGIN
  -- Only generate if profile_slug is NULL
  IF NEW.profile_slug IS NULL THEN
    generated_slug := public.generate_unique_profile_slug(
      NEW.id,
      NEW.first_name,
      NEW.last_name
    );
    NEW.profile_slug := generated_slug;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires BEFORE INSERT on profiles table
CREATE TRIGGER auto_generate_profile_slug_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_profile_slug();