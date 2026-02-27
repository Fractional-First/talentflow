-- Slug generation helper
CREATE OR REPLACE FUNCTION public.generate_unique_jd_slug(
  p_role_title TEXT,
  p_location TEXT
) RETURNS TEXT
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(trim(COALESCE(p_role_title, '') || ' ' || COALESCE(p_location, '')));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(BOTH '-' FROM base_slug);

  IF length(base_slug) < 3 THEN
    base_slug := 'jd-' || left(gen_random_uuid()::text, 8);
  END IF;

  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.job_descriptions WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- Create RPC
CREATE OR REPLACE FUNCTION public.create_job_description(
  p_jd_data JSONB,
  p_status TEXT DEFAULT 'draft'
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

  INSERT INTO public.job_descriptions (slug, jd_data, status)
  VALUES (v_slug, p_jd_data, p_status)
  RETURNING id INTO v_id;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'slug', v_slug,
    'url', 'https://jobs.fractionalfirst.com/' || v_slug
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Update RPC
CREATE OR REPLACE FUNCTION public.update_job_description(
  p_slug TEXT,
  p_jd_data JSONB,
  p_status TEXT DEFAULT NULL
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
    status = COALESCE(p_status, status)
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

-- Grant access to both RPCs
GRANT EXECUTE ON FUNCTION public.create_job_description TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_job_description TO anon, authenticated;
