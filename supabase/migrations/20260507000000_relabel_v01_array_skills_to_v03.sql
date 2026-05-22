-- Relabel mislabelled v0.1 profiles to v0.3.
--
-- Background:
--   138 rows hold profile_version='0.1' but already store the v0.3-shape
--   functional_skills (array of {name, value: [{title, description}, ...]}).
--   The talentflow + public-profiles renderer gated shape detection on
--   profileVersion >= "0.2", so these rows rendered with category headers
--   "0", "1", "2" and empty skill lists.
--
--   The renderer has been updated to detect shape from the data itself, but
--   the labels are still wrong and other code paths may branch on the
--   profile_version string. This migration brings the labels in line with
--   the actual data shape (v0.1 and v0.3 have identical top-level keys, so
--   "0.3" is the correct label for these rows).
--
-- Affected: 138 rows (35 authenticated 2025-07-21..2025-08-31, 103 guest
-- 2026-03-02..2026-03-03). All have functional_skills in array shape.

UPDATE public.profiles
SET
  profile_version = '0.3',
  anon_profile_data = CASE
    WHEN anon_profile_data ? 'profile_version'
      THEN jsonb_set(anon_profile_data, '{profile_version}', '"0.3"')
    ELSE anon_profile_data
  END,
  profile_data = CASE
    WHEN profile_data IS NOT NULL AND profile_data ? 'profile_version'
      THEN jsonb_set(profile_data, '{profile_version}', '"0.3"')
    ELSE profile_data
  END
WHERE profile_version = '0.1'
  AND jsonb_typeof(anon_profile_data->'functional_skills') = 'array';
