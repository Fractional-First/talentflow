-- Create a policy to allow authenticated users to insert new locations
CREATE POLICY "Allow authenticated insert" ON public.locations
FOR INSERT
TO authenticated
WITH CHECK (true);
