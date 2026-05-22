-- Resolve candidate names from auth.users metadata for LinkedIn OAuth signups
-- who have names only in raw_user_meta_data->>'name' (not in profiles.first_name/last_name)
CREATE OR REPLACE FUNCTION public.search_candidates_admin(
  search_query text DEFAULT NULL,
  status_filter text DEFAULT NULL,
  type_filter text DEFAULT NULL,
  has_agreement boolean DEFAULT NULL,
  open_for_work boolean DEFAULT NULL,
  page_number int DEFAULT 1,
  page_size int DEFAULT 25
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  offset_val int;
  total_count int;
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  offset_val := (page_number - 1) * page_size;

  SELECT COUNT(*) INTO total_count
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE
    (search_query IS NULL OR (
      COALESCE(NULLIF(p.first_name, ''), NULLIF(u.raw_user_meta_data->>'first_name', ''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>'name', ''), ' ', 1)) ILIKE '%' || search_query || '%' OR
      COALESCE(NULLIF(p.last_name, ''), NULLIF(u.raw_user_meta_data->>'last_name', ''), NULLIF(SUBSTRING(u.raw_user_meta_data->>'name' FROM POSITION(' ' IN COALESCE(u.raw_user_meta_data->>'name', '')) + 1), '')) ILIKE '%' || search_query || '%' OR
      p.email ILIKE '%' || search_query || '%' OR
      p.profile_data->>'role' ILIKE '%' || search_query || '%' OR
      p.profile_data->>'summary' ILIKE '%' || search_query || '%'
    ))
    AND (status_filter IS NULL OR p.onboarding_status::text = status_filter)
    AND (type_filter IS NULL OR p.profile_type::text = type_filter)
    AND (has_agreement IS NULL OR (
      CASE WHEN has_agreement THEN
        EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
      ELSE
        NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
      END
    ))
    AND (open_for_work IS NULL OR EXISTS (
      SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = search_candidates_admin.open_for_work
    ));

  SELECT json_build_object(
    'data', COALESCE(json_agg(row_to_json(t)), '[]'::json),
    'total', total_count,
    'page', page_number,
    'pageSize', page_size,
    'totalPages', CEIL(total_count::float / page_size)
  ) INTO result
  FROM (
    SELECT
      p.id,
      p.email,
      COALESCE(NULLIF(p.first_name, ''), NULLIF(u.raw_user_meta_data->>'first_name', ''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>'name', ''), ' ', 1)) as first_name,
      COALESCE(NULLIF(p.last_name, ''), NULLIF(u.raw_user_meta_data->>'last_name', ''), NULLIF(SUBSTRING(u.raw_user_meta_data->>'name' FROM POSITION(' ' IN COALESCE(u.raw_user_meta_data->>'name', '')) + 1), '')) as last_name,
      p.profile_type::text as profile_type,
      p.onboarding_status::text as onboarding_status,
      p.ispublished,
      p.linkedinurl,
      p.created_at,
      p.profile_data->>'role' as role,
      p.profile_data->>'location' as location,
      EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id) as has_agreement,
      (SELECT fp.open_for_work FROM fractional_preferences fp WHERE fp.user_id = p.id) as fractional_open,
      (SELECT ftp.open_for_work FROM full_time_preferences ftp WHERE ftp.user_id = p.id) as fulltime_open
    FROM profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE
      (search_query IS NULL OR (
        COALESCE(NULLIF(p.first_name, ''), NULLIF(u.raw_user_meta_data->>'first_name', ''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>'name', ''), ' ', 1)) ILIKE '%' || search_query || '%' OR
        COALESCE(NULLIF(p.last_name, ''), NULLIF(u.raw_user_meta_data->>'last_name', ''), NULLIF(SUBSTRING(u.raw_user_meta_data->>'name' FROM POSITION(' ' IN COALESCE(u.raw_user_meta_data->>'name', '')) + 1), '')) ILIKE '%' || search_query || '%' OR
        p.email ILIKE '%' || search_query || '%' OR
        p.profile_data->>'role' ILIKE '%' || search_query || '%' OR
        p.profile_data->>'summary' ILIKE '%' || search_query || '%'
      ))
      AND (status_filter IS NULL OR p.onboarding_status::text = status_filter)
      AND (type_filter IS NULL OR p.profile_type::text = type_filter)
      AND (has_agreement IS NULL OR (
        CASE WHEN has_agreement THEN
          EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
        ELSE
          NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
        END
      ))
      AND (open_for_work IS NULL OR EXISTS (
        SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = search_candidates_admin.open_for_work
      ))
    ORDER BY p.created_at DESC
    LIMIT page_size OFFSET offset_val
  ) t;

  RETURN result;
END;
$$;
