CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  generated_slug text;
  new_status public.onboarding_status;
BEGIN
  -- Decide initial onboarding status at creation time
  new_status := CASE
    WHEN NEW.email_confirmed_at IS NOT NULL THEN 'EMAIL_CONFIRMED'::public.onboarding_status
    ELSE 'SIGNED_UP'::public.onboarding_status
  END;

  -- Generate unique slug
  generated_slug := public.generate_unique_profile_slug(
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );

  -- Insert profile; if it already exists (due to a race), do not overwrite it
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, onboarding_status, profile_slug)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name',
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
