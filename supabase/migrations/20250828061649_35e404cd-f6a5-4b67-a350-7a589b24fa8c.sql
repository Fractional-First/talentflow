-- Enable RLS on profile_embeddings table
ALTER TABLE public.profile_embeddings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profile_embeddings
CREATE POLICY "Users can view their own profile embeddings" 
ON public.profile_embeddings 
FOR SELECT 
USING (profile_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Service role can manage all profile embeddings" 
ON public.profile_embeddings 
FOR ALL 
USING (auth.role() = 'service_role');