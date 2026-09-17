-- ff-workspace#11 / ff-workspace#12 — the candidates table reads the candidate's OWN agreement.
--
-- Two changes, both keyed off the agreement_kind discriminator added in 20260914000000:
--
-- 1. `has_agreement` and `agreement_date` were resolved with `aa.profile_id = p.id` and no filter
--    on which agreement it was. Since profile_id equals user_id on every production row, a client
--    MSA signed by someone who also has a candidate profile matched too — the same wrong-agreement
--    defect as ff-workspace#11, on the candidates side. Both now read the candidate's own
--    (talent) acceptance only.
--
-- 2. The candidate's signed legal details — full legal name, contracting type, entity name — are
--    returned so ff-admin can show them on the table without opening the record (ff-workspace#12).
--    They come from the same single talent acceptance, so the three values are always read from
--    one agreement rather than assembled from several.
--
-- Measured on production: 7 profiles move from "has agreement" to "no agreement" (they only ever
-- signed the CLIENT MSA — they have not signed the candidate agreement, so the honest rendering
-- is the neutral empty state), and 3 profiles stop showing a client agreement's date/details in
-- the candidate columns.
--
-- Signature and return type (json) are unchanged; the returned row objects gain three keys.
-- Consumer: ff-admin components/candidates-table.tsx.

CREATE OR REPLACE FUNCTION public.search_candidates_admin(
  search_query text DEFAULT NULL,
  status_filter text[] DEFAULT NULL,
  type_filter text[] DEFAULT NULL,
  location_filter text[] DEFAULT NULL,
  role_filter text[] DEFAULT NULL,
  has_agreement boolean DEFAULT NULL,
  open_for_work boolean DEFAULT NULL,
  connected_to text DEFAULT NULL,
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
    WHEN 'full_legal_name' THEN
      order_clause := 'full_legal_name ' || sort_dir || ' NULLS LAST';
    WHEN 'contracting_type' THEN
      order_clause := 'contracting_type ' || sort_dir || ' NULLS LAST';
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
        EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id AND aa.agreement_kind = 'talent')
      ELSE
        NOT EXISTS (SELECT 1 FROM agreement_acceptances aa WHERE aa.profile_id = p.id AND aa.agreement_kind = 'talent')
      END
    ))
    AND (open_for_work IS NULL OR EXISTS (
      SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = search_candidates_admin.open_for_work
    ))
    AND (connected_to IS NULL OR EXISTS (
      SELECT 1 FROM public.linkedin_connections lc
      WHERE lc.owner = connected_to
      AND lc.linkedin_username = public.linkedin_username_from_url(p.linkedinurl)
    ));

  -- Fetch page with dynamic ORDER BY.
  -- Positional params: $1=total_count, $2=page_number, $3=page_size,
  -- $4=search_query, $5=status_filter, $6=type_filter, $7=location_filter,
  -- $8=role_filter, $9=has_agreement, $10=open_for_work, $11=offset_val, $12=connected_to
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
        (ta.id IS NOT NULL) AS has_agreement,
        ta.accepted_at AS agreement_date,
        ta.full_legal_name AS full_legal_name,
        ta.contracting_type AS contracting_type,
        ta.entity_name AS entity_name,
        (SELECT fp.open_for_work FROM fractional_preferences fp WHERE fp.user_id = p.id) AS fractional_open,
        (SELECT ftp.open_for_work FROM full_time_preferences ftp WHERE ftp.user_id = p.id) AS fulltime_open,
        p.profile_slug,
        p.anon_slug,
        EXISTS (SELECT 1 FROM public.linkedin_connections lc WHERE lc.owner = ''reza'' AND lc.linkedin_username = public.linkedin_username_from_url(p.linkedinurl)) AS reza_connected
      FROM profiles p
      LEFT JOIN auth.users u ON u.id = p.id
      LEFT JOIN LATERAL (
        SELECT aa_t.id, aa_t.accepted_at, aa_t.full_legal_name, aa_t.contracting_type, aa_t.entity_name
        FROM agreement_acceptances aa_t
        WHERE aa_t.profile_id = p.id
          AND aa_t.agreement_kind = ''talent''
        ORDER BY aa_t.accepted_at DESC, aa_t.created_at DESC
        LIMIT 1
      ) ta ON TRUE
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
            ta.id IS NOT NULL
          ELSE
            ta.id IS NULL
          END
        ))
        AND ($10 IS NULL OR EXISTS (
          SELECT 1 FROM fractional_preferences fp WHERE fp.user_id = p.id AND fp.open_for_work = $10
        ))
        AND ($12 IS NULL OR EXISTS (
          SELECT 1 FROM public.linkedin_connections lc WHERE lc.owner = $12 AND lc.linkedin_username = public.linkedin_username_from_url(p.linkedinurl)
        ))
      ORDER BY %s
      LIMIT $3 OFFSET $11
    ) t',
    order_clause
  )
  INTO result
  USING total_count, page_number, page_size, search_query, status_filter, type_filter, location_filter, role_filter, has_agreement, open_for_work, offset_val, connected_to;

  RETURN result;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_candidates_admin(text, text[], text[], text[], text[], boolean, boolean, text, integer, integer, text, text) TO authenticated;
