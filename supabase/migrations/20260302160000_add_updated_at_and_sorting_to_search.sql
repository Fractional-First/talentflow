-- Add updated_at to search results and support sorting
CREATE OR REPLACE FUNCTION public.search_candidates_admin(
  search_query text DEFAULT NULL,
  status_filter text DEFAULT NULL,
  type_filter text DEFAULT NULL,
  has_agreement boolean DEFAULT NULL,
  open_for_work boolean DEFAULT NULL,
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 25,
  sort_by text DEFAULT 'created_at',
  sort_dir text DEFAULT 'desc'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  result json;
  offset_val int;
  total_count int;
  order_clause text;
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  offset_val := (page_number - 1) * page_size;

  -- Validate sort params to prevent injection
  IF sort_by NOT IN ('created_at', 'updated_at') THEN
    sort_by := 'created_at';
  END IF;
  IF sort_dir NOT IN ('asc', 'desc') THEN
    sort_dir := 'desc';
  END IF;

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

  -- Use EXECUTE for dynamic ORDER BY
  EXECUTE format(
    'SELECT json_build_object(
      ''data'', COALESCE(json_agg(row_to_json(t)), ''[]''::json),
      ''total'', $1,
      ''page'', $2,
      ''pageSize'', $3,
      ''totalPages'', CEIL($1::float / $3)
    )
    FROM (
      SELECT
        p.id,
        p.email,
        COALESCE(NULLIF(p.first_name, ''''), NULLIF(u.raw_user_meta_data->>''first_name'', ''''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>''name'', ''''), '' '', 1)) as first_name,
        COALESCE(NULLIF(p.last_name, ''''), NULLIF(u.raw_user_meta_data->>''last_name'', ''''), NULLIF(SUBSTRING(u.raw_user_meta_data->>''name'' FROM POSITION('' '' IN COALESCE(u.raw_user_meta_data->>''name'', '''')) + 1), '''')) as last_name,
        p.profile_type::text as profile_type,
        p.onboarding_status::text as onboarding_status,
        p.ispublished,
        p.linkedinurl,
        p.created_at,
        p.updated_at,
        p.profile_data->>''role'' as role,
        p.profile_data->>''location'' as location,
        EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id) as has_agreement,
        (SELECT fp.open_for_work FROM fractional_preferences fp WHERE fp.user_id = p.id) as fractional_open,
        (SELECT ftp.open_for_work FROM full_time_preferences ftp WHERE ftp.user_id = p.id) as fulltime_open
      FROM profiles p
      LEFT JOIN auth.users u ON u.id = p.id
      WHERE
        ($4 IS NULL OR (
          COALESCE(NULLIF(p.first_name, ''''), NULLIF(u.raw_user_meta_data->>''first_name'', ''''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>''name'', ''''), '' '', 1)) ILIKE ''%%'' || $4 || ''%%'' OR
          COALESCE(NULLIF(p.last_name, ''''), NULLIF(u.raw_user_meta_data->>''last_name'', ''''), NULLIF(SUBSTRING(u.raw_user_meta_data->>''name'' FROM POSITION('' '' IN COALESCE(u.raw_user_meta_data->>''name'', '''')) + 1), '''')) ILIKE ''%%'' || $4 || ''%%'' OR
          p.email ILIKE ''%%'' || $4 || ''%%'' OR
          p.profile_data->>''role'' ILIKE ''%%'' || $4 || ''%%'' OR
          p.profile_data->>''summary'' ILIKE ''%%'' || $4 || ''%%''
        ))
        AND ($5 IS NULL OR p.onboarding_status::text = $5)
        AND ($6 IS NULL OR p.profile_type::text = $6)
        AND ($7 IS NULL OR (
          CASE WHEN $7 THEN
            EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
          ELSE
            NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
          END
        ))
        AND ($8 IS NULL OR EXISTS (
          SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = $8
        ))
      ORDER BY p.%I %s
      LIMIT $3 OFFSET $9
    ) t',
    sort_by, sort_dir
  )
  INTO result
  USING total_count, page_number, page_size, search_query, status_filter, type_filter, has_agreement, open_for_work, offset_val;

  RETURN result;
END;
$function$;
