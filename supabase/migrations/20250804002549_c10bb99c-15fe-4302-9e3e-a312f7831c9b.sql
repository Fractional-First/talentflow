-- Add policy to allow public read access to profiles for public profile viewing
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles 
FOR SELECT 
USING (true);