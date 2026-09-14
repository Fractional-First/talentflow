-- ff-workspace#11 — the remaining candidate-side readers of agreement_acceptances.
--
-- 20260914000100 filtered the candidates TABLE to the candidate's own (talent) agreement. These
-- two read the same data for the same person and carried the same "latest acceptance of any
-- kind" defect, so without them the admin surfaces would contradict each other: for the 7
-- production profiles whose only acceptance is the CLIENT MSA the table would say "no agreement"
-- while the drawer printed the client MSA's date as their candidate agreement.
--
--   get_candidate_admin   -> ff-admin candidate drawer / candidate detail ('agreements' array)
--   get_candidate_details -> fractional-command's candidate lookup ('agreement' object)
--
-- Both keep their signature, return type and every key; the bodies are otherwise copied verbatim
-- from the definitions they replace. `get_candidate_admin`'s agreements array also gains an
-- explicit ORDER BY: it had none, so for the 3 users holding both kinds the first element was
-- whatever the planner happened to return.

CREATE OR REPLACE FUNCTION public.get_candidate_admin(candidate_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result json;
BEGIN
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: not an admin user';
  END IF;

  SELECT json_build_object(
    'profile', json_build_object(
      'id', p.id,
      'email', p.email,
      'first_name', COALESCE(NULLIF(p.first_name, ''), NULLIF(u.raw_user_meta_data->>'first_name', ''), SPLIT_PART(NULLIF(u.raw_user_meta_data->>'name', ''), ' ', 1)),
      'last_name', COALESCE(NULLIF(p.last_name, ''), NULLIF(u.raw_user_meta_data->>'last_name', ''), NULLIF(SUBSTRING(u.raw_user_meta_data->>'name' FROM POSITION(' ' IN COALESCE(u.raw_user_meta_data->>'name', '')) + 1), '')),
      'profile_type', p.profile_type::text,
      'onboarding_status', p.onboarding_status::text,
      'ispublished', p.ispublished,
      'linkedinurl', p.linkedinurl,
      'profile_slug', p.profile_slug,
      'anon_slug', p.anon_slug,
      'created_at', p.created_at,
      'profile_data', p.profile_data
    ),
    'fractional_preferences', (SELECT row_to_json(fp) FROM fractional_preferences fp WHERE fp.user_id = p.id),
    'full_time_preferences', (SELECT row_to_json(ftp) FROM full_time_preferences ftp WHERE ftp.user_id = p.id),
    'work_preferences', (SELECT row_to_json(wp) FROM work_preferences wp WHERE wp.user_id = p.id),
    'agreements', (
      SELECT COALESCE(json_agg(row_to_json(aa) ORDER BY aa.accepted_at DESC), '[]'::json)
      FROM agreement_acceptances aa
      WHERE aa.profile_id = p.id
        AND aa.agreement_kind = 'talent'
    ),
    'work_eligibility', (SELECT COALESCE(json_agg(row_to_json(we)), '[]'::json) FROM user_work_eligibility we WHERE we.user_id = p.id),
    'location', (SELECT row_to_json(l) FROM locations l JOIN work_preferences wp ON wp.current_location_id = l.id WHERE wp.user_id = p.id),
    'fractional_locations', (
      SELECT COALESCE(json_agg(json_build_object('city', l.city, 'country_code', l.country_code, 'formatted_address', l.formatted_address)), '[]'::json)
      FROM fractional_location_preferences flp
      JOIN locations l ON l.id = flp.location_id
      WHERE flp.user_id = p.id
    ),
    'full_time_locations', (
      SELECT COALESCE(json_agg(json_build_object('city', l.city, 'country_code', l.country_code, 'formatted_address', l.formatted_address)), '[]'::json)
      FROM full_time_location_preferences ftlp
      JOIN locations l ON l.id = ftlp.location_id
      WHERE ftlp.user_id = p.id
    )
  ) INTO result
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE p.id = candidate_id;

  RETURN result;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_candidate_admin(uuid) TO authenticated;

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
          AND aa.agreement_kind = 'talent'
        ORDER BY aa.accepted_at DESC
        LIMIT 1
      )
    ) AS row_data
    FROM profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE
      CONCAT_WS(' ', p.first_name, p.last_name) ILIKE '%' || p_name || '%'
      OR COALESCE(
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

GRANT EXECUTE ON FUNCTION public.get_candidate_details(text) TO authenticated;
