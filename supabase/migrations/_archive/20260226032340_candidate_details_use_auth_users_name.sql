CREATE OR REPLACE FUNCTION public.get_candidate_details(p_name TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_data) INTO v_result
  FROM (
    SELECT json_build_object(
      'name', COALESCE(
        NULLIF(u.raw_user_meta_data->>'name', ''),
        NULLIF(CONCAT_WS(' ', u.raw_user_meta_data->>'first_name', u.raw_user_meta_data->>'last_name'), ''),
        NULLIF(CONCAT_WS(' ', p.first_name, p.last_name), '')
      ),
      'email', COALESCE(p.email, u.email),
      'linkedin_url', p.linkedinurl,
      'profile_slug', p.profile_slug,
      'location', p.profile_data->>'location',
      'role', p.profile_data->>'role',
      'industries', p.profile_data->'industries',
      'focus_areas', p.profile_data->'focus_areas',
      'geographic_coverage', p.profile_data->'geographical_coverage',
      'fractional_preferences', (
        SELECT json_build_object(
          'open_for_work', fp.open_for_work,
          'min_hourly_rate', fp.min_hourly_rate,
          'max_hourly_rate', fp.max_hourly_rate,
          'min_daily_rate', fp.min_daily_rate,
          'max_daily_rate', fp.max_daily_rate,
          'min_hours_per_week', fp.min_hours_per_week,
          'max_hours_per_week', fp.max_hours_per_week,
          'remote_ok', fp.remote_ok,
          'start_date', fp.start_date
        )
        FROM fractional_preferences fp WHERE fp.user_id = p.id
      ),
      'full_time_preferences', (
        SELECT json_build_object(
          'open_for_work', ftp.open_for_work,
          'min_salary', ftp.min_salary,
          'max_salary', ftp.max_salary,
          'remote_ok', ftp.remote_ok,
          'start_date', ftp.start_date
        )
        FROM full_time_preferences ftp WHERE ftp.user_id = p.id
      ),
      'agreement', (
        SELECT json_build_object(
          'agreement_version', aa.agreement_version,
          'accepted_at', aa.accepted_at,
          'signature_name', aa.signature_name
        )
        FROM agreement_acceptances aa
        WHERE aa.profile_id = p.id
        ORDER BY aa.accepted_at DESC
        LIMIT 1
      )
    ) AS row_data
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE
      COALESCE(
        NULLIF(u.raw_user_meta_data->>'name', ''),
        CONCAT_WS(' ', u.raw_user_meta_data->>'first_name', u.raw_user_meta_data->>'last_name')
      ) ILIKE '%' || p_name || '%'
      OR p.email ILIKE '%' || p_name || '%'
      OR u.email ILIKE '%' || p_name || '%'
    LIMIT 10
  ) sub;

  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;
