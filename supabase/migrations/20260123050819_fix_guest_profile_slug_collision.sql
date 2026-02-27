-- Migration: fix_guest_profile_slug_collision
-- Purpose: Guest profiles should NOT have profile_slug (they only use anon_slug)
-- This prevents slug collision when a real user signs up with the same name as a guest profile

-- 1. Allow NULL for profile_slug
ALTER TABLE public.profiles
ALTER COLUMN profile_slug DROP NOT NULL;

-- 2. Drop existing unique index (applies to ALL profiles)
DROP INDEX IF EXISTS profiles_profile_slug_unique;

-- 3. Create partial unique index (authenticated profiles only)
CREATE UNIQUE INDEX profiles_profile_slug_unique_authenticated
ON public.profiles(profile_slug)
WHERE profile_type = 'authenticated' AND profile_slug IS NOT NULL;

-- 4. Add constraint: authenticated profiles MUST have profile_slug
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_authenticated_slug_check
CHECK (
  profile_type = 'guest' OR
  (profile_type = 'authenticated' AND profile_slug IS NOT NULL)
);

-- 5. Update trigger to skip guest profiles
CREATE OR REPLACE FUNCTION public.auto_generate_profile_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  generated_slug text;
BEGIN
  -- Only generate for authenticated profiles with no slug
  IF NEW.profile_slug IS NULL AND NEW.profile_type = 'authenticated' THEN
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

-- 6. Update slug function to only check authenticated profiles
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
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  base_slug := trim(base_slug, '-');

  IF length(base_slug) < 3 THEN
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  final_slug := base_slug;

  LOOP
    -- Only check authenticated profiles for uniqueness
    SELECT EXISTS(
      SELECT 1 FROM public.profiles
      WHERE profile_slug = final_slug
        AND id != p_user_id
        AND profile_type = 'authenticated'
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

-- 7. Clear profile_slug for existing guest profiles
UPDATE public.profiles
SET profile_slug = NULL
WHERE profile_type = 'guest';
