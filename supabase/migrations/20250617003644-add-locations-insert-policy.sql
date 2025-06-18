-- Add RLS policy to allow authenticated users to insert new locations
CREATE POLICY "Authenticated users can insert locations" 
  ON public.locations 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Add RLS policy to allow authenticated users to update locations
CREATE POLICY "Authenticated users can update locations" 
  ON public.locations 
  FOR UPDATE 
  USING (auth.role() = 'authenticated'); 