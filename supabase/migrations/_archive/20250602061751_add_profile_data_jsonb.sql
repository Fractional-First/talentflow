-- Remove unnecessary fields and add new JSONB structure
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name;

-- Add the new profile_data JSONB field to store rich profile information
-- Using NOT NULL since these will always be populated by the LLM endpoint
ALTER TABLE public.profiles 
ADD COLUMN profile_data JSONB NOT NULL DEFAULT '{}',
ADD COLUMN profile_version TEXT NOT NULL DEFAULT '0.1';

-- Add an index on profile_data for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_profile_data ON public.profiles USING GIN (profile_data);

-- Add an index on profile_version for filtering by version
CREATE INDEX IF NOT EXISTS idx_profiles_profile_version ON public.profiles (profile_version);
