-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create profile_embeddings table
CREATE TABLE public.profile_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL UNIQUE,
  derived_text TEXT,
  text_hash TEXT,
  embedding_vector vector(1536),
  last_embedded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add ivfflat index for vector similarity search
CREATE INDEX ON public.profile_embeddings
USING ivfflat (embedding_vector vector_cosine_ops)
WITH (lists = 100);
