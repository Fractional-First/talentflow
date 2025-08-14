-- Create a secure public_profiles view with only safe columns
CREATE VIEW public.public_profiles AS 
SELECT profile_slug, profile_data, first_name, last_name 
FROM public.profiles;

-- Remove the dangerous public policy from profiles table
DROP POLICY "Allow public read access to profiles" ON public.profiles;

-- Enable RLS on the new view
ALTER VIEW public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Add secure policy to the view
CREATE POLICY "Allow public read access to public profiles" 
ON public.public_profiles FOR SELECT 
TO public 
USING (true);