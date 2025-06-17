
-- Enable Row Level Security on the industries table
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to industries
CREATE POLICY "Industries are publicly readable" 
  ON public.industries 
  FOR SELECT 
  USING (true);
