-- Migration: fix_function_search_paths
-- Purpose: Set explicit search_path on functions to prevent schema injection attacks
-- Addresses Supabase security linter warning: "Function has a role mutable search_path"

-- Fix generate_unique_profile_slug
CREATE OR REPLACE FUNCTION public.generate_unique_profile_slug(
  p_user_id uuid,
  p_first_name text,
  p_last_name text
)
RETURNS text
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
  slug_exists boolean;
BEGIN
  IF p_first_name IS NOT NULL AND p_last_name IS NOT NULL THEN
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          trim(p_first_name) || '-' || trim(p_last_name),
          '[^a-zA-Z0-9\-]', '', 'g'
        ),
        '\-+', '-', 'g'
      )
    );
  ELSIF p_first_name IS NOT NULL THEN
    base_slug := lower(
      regexp_replace(
        regexp_replace(
          trim(p_first_name),
          '[^a-zA-Z0-9\-]', '', 'g'
        ),
        '\-+', '-', 'g'
      )
    );
  ELSE
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  base_slug := trim(base_slug, '-');

  IF length(base_slug) < 3 THEN
    base_slug := 'user-' || substring(p_user_id::text from 1 for 8);
  END IF;

  final_slug := base_slug;

  LOOP
    -- Only check authenticated profiles for uniqueness
    SELECT EXISTS(
      SELECT 1 FROM public.profiles
      WHERE profile_slug = final_slug
        AND id != p_user_id
        AND profile_type = 'authenticated'
    ) INTO slug_exists;

    IF NOT slug_exists THEN
      EXIT;
    END IF;

    counter := counter + 1;
    final_slug := base_slug || '-' || counter::text;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- Fix match_documents (vector search function)
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding vector,
  match_count integer DEFAULT NULL,
  filter jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(id uuid, content text, metadata jsonb, similarity double precision)
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    e.profile_id AS id,
    e.content,
    e.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM profile_embeddings e
  WHERE e.metadata @> filter
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
