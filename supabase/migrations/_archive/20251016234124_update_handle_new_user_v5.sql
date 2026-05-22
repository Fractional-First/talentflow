CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  generated_slug text;
  new_status public.onboarding_status;
  is_linkedin boolean;
  first_name_val text;
  last_name_val text;
  full_name text;
  space_pos integer;
BEGIN
  -- Determine if the provider is LinkedIn (covers both single provider and array of providers)
  is_linkedin := 
    (NEW.raw_app_meta_data ->> 'provider') = 'linkedin_oidc'
    OR ((NEW.raw_app_meta_data -> 'providers') @> '["linkedin_oidc"]'::jsonb);

  -- Decide initial onboarding status at creation time
  new_status := CASE
    WHEN NEW.email_confirmed_at IS NOT NULL OR is_linkedin THEN 'EMAIL_CONFIRMED'::public.onboarding_status
    ELSE 'SIGNED_UP'::public.onboarding_status
  END;

  -- Extract first_name and last_name
  first_name_val := NEW.raw_user_meta_data ->> 'first_name';
  last_name_val := NEW.raw_user_meta_data ->> 'last_name';

  -- If both are NULL, try to parse from 'name' field (common with LinkedIn OAuth)
  IF first_name_val IS NULL AND last_name_val IS NULL THEN
    full_name := trim(NEW.raw_user_meta_data ->> 'name');
    
    IF full_name IS NOT NULL AND full_name != '' THEN
      -- Find the first space to split first and last name
      space_pos := position(' ' in full_name);
      
      IF space_pos > 0 THEN
        -- Split on first space: "John Doe Smith" -> "John" + "Doe Smith"
        first_name_val := trim(substring(full_name from 1 for space_pos - 1));
        last_name_val := trim(substring(full_name from space_pos + 1));
      ELSE
        -- No space found, use entire name as first_name
        first_name_val := full_name;
        last_name_val := NULL;
      END IF;
    END IF;
  END IF;

  -- Generate unique slug using the extracted/parsed names
  generated_slug := public.generate_unique_profile_slug(
    NEW.id,
    first_name_val,
    last_name_val
  );

  -- Insert profile; if it already exists (due to a race), do not overwrite it
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, onboarding_status, profile_slug)
    VALUES (
      NEW.id,
      NEW.email,
      first_name_val,
      last_name_val,
      new_status,
      generated_slug
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Profile row already exists (possibly updated by the client); do not downgrade or overwrite.
      NULL;
  END;

  RETURN NEW;
END;
$function$;
