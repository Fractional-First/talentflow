-- Admin Search: accept text[] arrays for status, type, location, and role filters.
-- This enables multi-select faceted filtering in the admin dashboard.

-- Must drop old signature first: changing param types (text → text[]) creates
-- a new overload rather than replacing. Two functions with the same name causes
-- PostgREST ambiguity errors.
DROP FUNCTION IF EXISTS public.search_candidates_admin(
  text, text, text, boolean, boolean, integer, integer, text, text
);

CREATE OR REPLACE FUNCTION public.search_candidates_admin(
  search_query text DEFAULT NULL,
  status_filter text[] DEFAULT NULL,
  type_filter text[] DEFAULT NULL,
  location_filter text[] DEFAULT NULL,
  role_filter text[] DEFAULT NULL,
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

  -- Validate sort_dir to prevent injection
  IF sort_dir NOT IN ('asc', 'desc') THEN
    sort_dir := 'desc';
  END IF;

  -- Validate sort_by via whitelist and build ORDER BY expression.
  CASE sort_by
    WHEN 'name' THEN
      order_clause := 'name_computed ' || sort_dir || ' NULLS LAST';
    WHEN 'email' THEN
      order_clause := 'email ' || sort_dir;
    WHEN 'role' THEN
      order_clause := 'role ' || sort_dir || ' NULLS LAST';
    WHEN 'location' THEN
      order_clause := 'location ' || sort_dir || ' NULLS LAST';
    WHEN 'onboarding_status' THEN
      order_clause := 'CASE onboarding_status
        WHEN ''SET_PASSWORD'' THEN 1
        WHEN ''SIGNED_UP'' THEN 2
        WHEN ''EMAIL_CONFIRMED'' THEN 3
        WHEN ''PROFILE_GENERATED'' THEN 4
        WHEN ''PROFILE_CONFIRMED'' THEN 5
        WHEN ''PREFERENCES_SET'' THEN 6
        ELSE 99
      END ' || sort_dir;
    WHEN 'profile_type' THEN
      order_clause := 'profile_type ' || sort_dir;
    WHEN 'has_agreement' THEN
      order_clause := 'has_agreement ' || sort_dir;
    WHEN 'agreement_date' THEN
      order_clause := 'agreement_date ' || sort_dir || ' NULLS LAST';
    WHEN 'updated_at' THEN
      order_clause := 'updated_at ' || sort_dir || ' NULLS LAST';
    ELSE -- 'created_at' and any unrecognized value
      order_clause := 'created_at ' || sort_dir;
  END CASE;

  -- Count matching rows
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
    AND (status_filter IS NULL OR p.onboarding_status::text = ANY(status_filter))
    AND (type_filter IS NULL OR p.profile_type::text = ANY(type_filter))
    AND (location_filter IS NULL OR p.profile_data->>'location' = ANY(location_filter))
    AND (role_filter IS NULL OR p.profile_data->>'role' = ANY(role_filter))
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

  -- Fetch page with dynamic ORDER BY.
  -- Positional params: $1=total_count, $2=page_number, $3=page_size,
  -- $4=search_query, $5=status_filter, $6=type_filter, $7=location_filter,
  -- $8=role_filter, $9=has_agreement, $10=open_for_work, $11=offset_val
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
        COALESCE(NULLIF(p.first_name, ''''), NULLIF(u.raw_user_meta_data->>''first_name'', ''''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>''name'', ''''), '' '', 1)) AS first_name,
        COALESCE(NULLIF(p.last_name, ''''), NULLIF(u.raw_user_meta_data->>''last_name'', ''''), NULLIF(SUBSTRING(u.raw_user_meta_data->>''name'' FROM POSITION('' '' IN COALESCE(u.raw_user_meta_data->>''name'', '''')) + 1), '''')) AS last_name,
        (
          COALESCE(NULLIF(p.first_name, ''''), NULLIF(u.raw_user_meta_data->>''first_name'', ''''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>''name'', ''''), '' '', 1)) || '' '' ||
          COALESCE(NULLIF(p.last_name, ''''), NULLIF(u.raw_user_meta_data->>''last_name'', ''''), NULLIF(SUBSTRING(u.raw_user_meta_data->>''name'' FROM POSITION('' '' IN COALESCE(u.raw_user_meta_data->>''name'', '''')) + 1), ''''))
        ) AS name_computed,
        p.profile_type::text AS profile_type,
        p.onboarding_status::text AS onboarding_status,
        p.ispublished,
        p.linkedinurl,
        p.created_at,
        p.updated_at,
        p.profile_data->>''role'' AS role,
        p.profile_data->>''location'' AS location,
        EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id) AS has_agreement,
        (SELECT aa.accepted_at FROM agreement_acceptances aa WHERE aa.profile_id = p.id ORDER BY aa.created_at DESC LIMIT 1) AS agreement_date,
        (SELECT fp.open_for_work FROM fractional_preferences fp WHERE fp.user_id = p.id) AS fractional_open,
        (SELECT ftp.open_for_work FROM full_time_preferences ftp WHERE ftp.user_id = p.id) AS fulltime_open,
        p.profile_slug,
        p.anon_slug
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
        AND ($5 IS NULL OR p.onboarding_status::text = ANY($5))
        AND ($6 IS NULL OR p.profile_type::text = ANY($6))
        AND ($7 IS NULL OR p.profile_data->>''location'' = ANY($7))
        AND ($8 IS NULL OR p.profile_data->>''role'' = ANY($8))
        AND ($9 IS NULL OR (
          CASE WHEN $9 THEN
            EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
          ELSE
            NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id)
          END
        ))
        AND ($10 IS NULL OR EXISTS (
          SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = $10
        ))
      ORDER BY %s
      LIMIT $3 OFFSET $11
    ) t',
    order_clause
  )
  INTO result
  USING total_count, page_number, page_size, search_query, status_filter, type_filter, location_filter, role_filter, has_agreement, open_for_work, offset_val;

  RETURN result;
END;
$function$;

-- Lightweight RPC to return distinct location and role values for faceted filter options.
-- Cached client-side (5 min staleTime) so this runs rarely.
CREATE OR REPLACE FUNCTION public.get_candidate_facets()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'locations', (
      SELECT COALESCE(json_agg(loc ORDER BY loc), '[]'::json)
      FROM (SELECT DISTINCT profile_data->>'location' AS loc FROM profiles WHERE profile_data->>'location' IS NOT NULL AND profile_data->>'location' != '') sub
    ),
    'roles', (
      SELECT COALESCE(json_agg(r ORDER BY r), '[]'::json)
      FROM (SELECT DISTINCT profile_data->>'role' AS r FROM profiles WHERE profile_data->>'role' IS NOT NULL AND profile_data->>'role' != '') sub
    )
  );
$$;
