-- Create an enum for the onboarding status
CREATE TYPE public.onboarding_status AS ENUM (
  'SIGNED_UP',
  'EMAIL_CONFIRMED', 
  'PROFILE_GENERATED',
  'PROFILE_CONFIRMED'
);

-- Remove the profile_created column and add the onboarding_status column
ALTER TABLE public.profiles 
DROP COLUMN profile_created,
ADD COLUMN onboarding_status public.onboarding_status NOT NULL DEFAULT 'SIGNED_UP';

-- Update the handle_new_user function to set the initial onboarding status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, onboarding_status)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    'SIGNED_UP'
  );
  RETURN NEW;
END;
$function$;
