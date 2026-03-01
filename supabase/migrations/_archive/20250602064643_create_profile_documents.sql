-- Create enum for document types
CREATE TYPE public.document_type AS ENUM ('resume', 'linkedin', 'other');

-- Create a reusable function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the profile_documents table
CREATE TABLE public.profile_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type public.document_type NOT NULL,
    title TEXT,
    original_filename TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger to auto-update the updated_at column
CREATE TRIGGER update_profile_documents_updated_at
    BEFORE UPDATE ON public.profile_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.profile_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own documents" 
    ON public.profile_documents 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" 
    ON public.profile_documents 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
    ON public.profile_documents 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
    ON public.profile_documents 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_profile_documents_user_id ON public.profile_documents(user_id);
CREATE INDEX idx_profile_documents_type ON public.profile_documents(type);
CREATE INDEX idx_profile_documents_created_at ON public.profile_documents(created_at);
