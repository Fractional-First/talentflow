-- Make email nullable to support guest profiles
ALTER TABLE public.profiles 
ALTER COLUMN email DROP NOT NULL;

-- Add profile_type enum
CREATE TYPE public.profile_type AS ENUM ('authenticated', 'guest');

-- Add profile_type column with default value
ALTER TABLE public.profiles 
ADD COLUMN profile_type profile_type NOT NULL DEFAULT 'authenticated';

-- Add check constraint: authenticated profiles must have email
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_authenticated_email_check 
CHECK (
  (profile_type = 'guest') OR 
  (profile_type = 'authenticated' AND email IS NOT NULL)
);