-- Fix security warning: Set search_path for generate_unique_profile_slug function
CREATE OR REPLACE FUNCTION public.generate_unique_profile_slug(
  p_user_id uuid,
  p_first_name text,
  p_last_name text
)
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
  -- Generate base slug from names
  IF p_first_name IS NOT NULL AND p_last_name IS NOT NULL THEN
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          trim(p_first_name) || '-' || trim(p_last_name),
          '[^a-zA-Z0-9\-]', '', 'g'
        ),
        '\-+', '-', 'g'
      )
    );
  ELSIF p_first_name IS NOT NULL THEN
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          trim(p_first_name),
          '[^a-zA-Z0-9\-]', '', 'g'
        ),
        '\-+', '-', 'g'
      )
    );
  ELSE
    -- Fallback to user ID prefix if no names available
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  -- Clean up slug (remove leading/trailing hyphens)
  base_slug := trim(base_slug, '-');
  
  -- Ensure minimum length
  IF length(base_slug) < 3 THEN
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  -- Check uniqueness and increment if needed
  final_slug := base_slug;
  
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.profiles 
      WHERE profile_slug = final_slug AND id != p_user_id
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