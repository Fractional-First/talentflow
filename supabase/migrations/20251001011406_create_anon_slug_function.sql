-- Create function to generate unique anonymous slug
CREATE OR REPLACE FUNCTION public.generate_unique_anon_slug(p_user_id uuid, p_anon_data jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
  slug_exists boolean;
BEGIN
  -- Extract the anon-profile-slug from the JSON data
  base_slug := p_anon_data ->> 'anon-profile-slug';
  
  -- If no slug in the data, return NULL
  IF base_slug IS NULL OR base_slug = '' THEN
    RETURN NULL;
  END IF;

  -- Clean up slug (lowercase, sanitize)
  base_slug := lower(
    regexp_replace(
      regexp_replace(
        trim(base_slug),
        '[^a-zA-Z0-9\-]', '', 'g'
      ),
      '\-+', '-', 'g'
    )
  );
  
  -- Clean up slug (remove leading/trailing hyphens)
  base_slug := trim(base_slug, '-');
  
  -- Ensure minimum length
  IF length(base_slug) < 3 THEN
    base_slug := 'anon-' || substring(p_user_id::text from 1 for 8);
  END IF;

  -- Check uniqueness and increment if needed
  final_slug := base_slug;
  
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE anon_slug = final_slug AND id != p_user_id
    ) INTO slug_exists;
    
    IF NOT slug_exists THEN
      EXIT;
    END IF;
    
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::text;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- Create trigger function to auto-generate anon_slug
CREATE OR REPLACE FUNCTION public.update_anon_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only update if anon_profile_data has changed and is not null
  IF NEW.anon_profile_data IS NOT NULL AND 
     (OLD.anon_profile_data IS NULL OR NEW.anon_profile_data != OLD.anon_profile_data) THEN
    NEW.anon_slug := public.generate_unique_anon_slug(NEW.id, NEW.anon_profile_data);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
CREATE TRIGGER trigger_update_anon_slug
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_anon_slug();
