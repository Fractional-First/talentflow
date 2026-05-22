-- Create the search function for LangChain
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    e.profile_id AS id,       -- your profile_id will serve as the doc id
    e.content,                -- renamed column from derived_text
    e.metadata,               -- JSON with slug, name, etc.
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM profile_embeddings e
  WHERE e.metadata @> filter
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
