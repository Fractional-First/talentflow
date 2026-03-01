-- Add profile_slug column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_slug text;

-- Create unique index for profile_slug
CREATE UNIQUE INDEX profiles_profile_slug_unique ON public.profiles(profile_slug);

-- Function to generate unique profile slug
CREATE OR REPLACE FUNCTION public.generate_unique_profile_slug(
  p_user_id uuid,
  p_first_name text,
  p_last_name text
)
RETURNS text AS $$
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
$$ LANGUAGE plpgsql;

-- Update handle_new_user function to generate slug
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  generated_slug text;
BEGIN
  -- Generate unique slug
  generated_slug := public.generate_unique_profile_slug(
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );

  INSERT INTO public.profiles (id, email, first_name, last_name, onboarding_status, profile_slug)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    'SIGNED_UP',
    generated_slug
  );
  RETURN NEW;
END;
$$;

-- Function to backfill slugs for existing users
CREATE OR REPLACE FUNCTION public.backfill_profile_slugs()
RETURNS void AS $$
DECLARE
  profile_record RECORD;
  generated_slug text;
BEGIN
  FOR profile_record IN 
    SELECT id, first_name, last_name 
    FROM public.profiles 
    WHERE profile_slug IS NULL
  LOOP
    generated_slug := public.generate_unique_profile_slug(
      profile_record.id,
      profile_record.first_name,
      profile_record.last_name
    );
    
    UPDATE public.profiles 
    SET profile_slug = generated_slug 
    WHERE id = profile_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run backfill for existing users
SELECT public.backfill_profile_slugs();

-- Drop the backfill function (no longer needed)
DROP FUNCTION public.backfill_profile_slugs();

-- Make profile_slug NOT NULL after backfill
ALTER TABLE public.profiles 
ALTER COLUMN profile_slug SET NOT NULL;
