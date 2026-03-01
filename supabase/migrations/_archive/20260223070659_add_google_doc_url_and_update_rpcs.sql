-- Migration: add google_doc_url to job_descriptions
ALTER TABLE public.job_descriptions
  ADD COLUMN IF NOT EXISTS google_doc_url TEXT;

-- Update create_job_description to accept google_doc_url
DROP FUNCTION IF EXISTS public.create_job_description(jsonb, text, text);

CREATE OR REPLACE FUNCTION public.create_job_description(
  p_jd_data JSONB,
  p_status TEXT DEFAULT 'draft',
  p_client_name TEXT DEFAULT NULL,
  p_google_doc_url TEXT DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_slug TEXT;
  v_id UUID;
  v_role_title TEXT;
  v_location TEXT;
BEGIN
  v_role_title := p_jd_data->>'role_title';
  v_location := p_jd_data->>'location';
  v_slug := generate_unique_jd_slug(v_role_title, v_location);

  INSERT INTO public.job_descriptions (slug, jd_data, status, client_name, google_doc_url)
  VALUES (v_slug, p_jd_data, p_status, p_client_name, p_google_doc_url)
  RETURNING id INTO v_id;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'slug', v_slug,
    'url', 'https://roles.fractionalfirst.com/' || v_slug
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_job_description TO anon, authenticated;

-- Update update_job_description to accept google_doc_url
DROP FUNCTION IF EXISTS public.update_job_description(text, jsonb, text, text);

CREATE OR REPLACE FUNCTION public.update_job_description(
  p_slug TEXT,
  p_jd_data JSONB,
  p_status TEXT DEFAULT NULL,
  p_client_name TEXT DEFAULT NULL,
  p_google_doc_url TEXT DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_id UUID;
BEGIN
  UPDATE public.job_descriptions
  SET
    jd_data = p_jd_data,
    status = COALESCE(p_status, status),
    client_name = COALESCE(p_client_name, client_name),
    google_doc_url = COALESCE(p_google_doc_url, google_doc_url)
  WHERE slug = p_slug
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Job description not found: ' || p_slug
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'slug', p_slug
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_job_description TO anon, authenticated;

-- Update list_job_descriptions to include google_doc_url
DROP FUNCTION IF EXISTS public.list_job_descriptions(text, int);

CREATE OR REPLACE FUNCTION public.list_job_descriptions(
  p_status TEXT DEFAULT NULL,
  p_limit INT DEFAULT 20
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_data)
  INTO v_result
  FROM (
    SELECT
      id,
      slug,
      client_name,
      status,
      google_doc_url,
      jd_data->>'role_title' AS role_title,
      jd_data->>'location' AS location,
      created_at
    FROM public.job_descriptions
    WHERE (p_status IS NULL OR status = p_status)
    ORDER BY created_at DESC
    LIMIT p_limit
  ) row_data;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_job_descriptions TO anon, authenticated;

-- Update get_job_description to include google_doc_url
DROP FUNCTION IF EXISTS public.get_job_description(text);

CREATE OR REPLACE FUNCTION public.get_job_description(
  p_slug TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT row_to_json(jd)
  INTO v_result
  FROM (
    SELECT id, slug, client_name, google_doc_url, jd_data, status, created_at, updated_at
    FROM public.job_descriptions
    WHERE slug = p_slug
  ) jd;

  IF v_result IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Job description not found: ' || p_slug
    );
  END IF;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_job_description TO anon, authenticated;
