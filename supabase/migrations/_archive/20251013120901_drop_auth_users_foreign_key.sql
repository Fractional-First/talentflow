-- Drop the foreign key constraint that requires profiles.id to exist in auth.users
-- This is necessary to support guest profiles which don't have associated auth records
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add a comment explaining the dual use of the id column
COMMENT ON COLUMN public.profiles.id IS 
  'Primary key. For authenticated users, this matches auth.users.id. For guest profiles (profile_type=guest), this is a standalone UUID.';
