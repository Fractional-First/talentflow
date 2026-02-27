-- Rename embedding_vector column to embedding for LangChain compatibility
ALTER TABLE profile_embeddings
  RENAME COLUMN embedding_vector TO embedding;

-- Rename derived_text column to content for LangChain compatibility
ALTER TABLE profile_embeddings
  RENAME COLUMN derived_text TO content;

-- Add metadata JSONB column for LangChain compatibility
ALTER TABLE profile_embeddings
  ADD COLUMN metadata jsonb;
