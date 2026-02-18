# Job Descriptions Table — Tasks

> **PRD:** [PRD.md](./PRD.md)
> **Status:** 2/6 tasks complete (1.1 + 2.1 applied via fractional-command session 2026-02-18)
> **Migrations:** Write SQL to local migration file first, then apply via Supabase MCP `apply_migration`.
> **Production:** Applies directly to production Supabase (`dtyugokvlksnatftpucm`). Additive change only (new table). Be careful.

---

## 1. Database Schema

- [x] **1.1 Create job_descriptions table with RLS and trigger**
  Write migration file to `supabase/migrations/<timestamp>_create_job_descriptions_table.sql` with the SQL below, then apply via Supabase MCP `apply_migration` (project `dtyugokvlksnatftpucm`, name `create_job_descriptions_table`).
  ```sql
  -- Create table
  CREATE TABLE public.job_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    jd_data JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  -- Indexes
  CREATE INDEX idx_job_descriptions_status ON public.job_descriptions(status);
  CREATE INDEX idx_job_descriptions_created_at ON public.job_descriptions(created_at DESC);

  -- RLS
  ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Anyone can read published JDs"
    ON public.job_descriptions
    FOR SELECT
    TO public
    USING (status = 'published');

  -- Updated_at trigger (reuses existing function)
  CREATE TRIGGER job_descriptions_updated_at
    BEFORE UPDATE ON public.job_descriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

  -- Comment
  COMMENT ON TABLE public.job_descriptions IS 'Structured job descriptions for executive search engagements';
  ```
  After applying, verify with `execute_sql`: `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'job_descriptions' ORDER BY ordinal_position;`

## 2. RPC Functions

- [x] **2.1 Create slug generation and create/update RPC functions**
  Write migration file to `supabase/migrations/<timestamp>_create_job_description_rpcs.sql` with the SQL below, then apply via Supabase MCP `apply_migration` (project `dtyugokvlksnatftpucm`, name `create_job_description_rpcs`).
  ```sql
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
    p_status TEXT DEFAULT 'published'
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
  ```
  After applying, verify with `execute_sql`: `SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%job_description%';`

## 3. Verification

- [x] **3.1 Test create_job_description RPC**
  Use Supabase MCP `execute_sql` to call the create RPC with sample CFO India JD data:
  ```sql
  SELECT public.create_job_description(
    '{
      "role_title": "Financial Custodian / CFO Player-Coach",
      "location": "India",
      "format": "Fractional (approx. 2 days/month)",
      "date": "January 20, 2026",
      "key_parameters": {
        "sector": "Infrastructure, EPC, construction-led services",
        "revenue": "INR 350 Cr (Scaling to INR 1,000 Cr)",
        "team": "~90 FTEs (Finance team of 7-8)",
        "role_type": "Oversight, Validation, and Mentorship"
      },
      "about_client": "Test client description.",
      "opportunity": "Test opportunity description for the CFO role.",
      "accountability_scope": [
        {"title": "Validation", "description": "Monthly review and sign-off of financials"}
      ],
      "ideal_profile": {
        "hard_skills": [{"title": "15+ years in senior finance", "description": "CFO level"}],
        "soft_skills": [{"title": "Grounded & Low-Ego", "description": "Comfortable in advisory role"}]
      },
      "jd_version": "1.0"
    }'::jsonb,
    'published'
  );
  ```
  Assert: Response contains `success: true`, a valid UUID `id`, slug `financial-custodian-cfo-player-coach-india`, and url.

- [ ] **3.2 Test RLS, update RPC, and edge cases**
  Run these verification queries via Supabase MCP `execute_sql`:
  ```sql
  -- 1. Verify published JD is readable
  SELECT slug, status FROM public.job_descriptions WHERE status = 'published';

  -- 2. Create a draft JD
  SELECT public.create_job_description('{"role_title": "Draft Test", "location": "Singapore"}'::jsonb, 'draft');

  -- 3. Test update RPC
  SELECT public.update_job_description(
    'financial-custodian-cfo-player-coach-india',
    '{"role_title": "Updated CFO", "location": "India", "jd_version": "1.0"}'::jsonb
  );

  -- 4. Test update nonexistent slug — assert success = false
  SELECT public.update_job_description('nonexistent-slug', '{}'::jsonb);

  -- 5. Test slug collision — assert slug ends with '-2'
  SELECT public.create_job_description('{"role_title": "Updated CFO", "location": "India"}'::jsonb, 'draft');

  -- 6. Verify updated_at trigger fired
  SELECT updated_at > created_at FROM public.job_descriptions WHERE slug = 'financial-custodian-cfo-player-coach-india';
  ```

## 4. Type Regeneration

- [ ] **4.1 Regenerate Supabase TypeScript types**
  Use Supabase MCP `generate_typescript_types` for project `dtyugokvlksnatftpucm`.
  Write the output to `src/integrations/supabase/types.ts`.
  Verify the file contains `job_descriptions` in the Tables section with correct Row/Insert/Update types.

## 5. Cleanup & Commit

- [ ] **5.1 Remove test data and commit**
  Clean up test JDs created during verification:
  ```sql
  DELETE FROM public.job_descriptions WHERE slug IN ('financial-custodian-cfo-player-coach-india', 'draft-test-singapore', 'updated-cfo-india', 'updated-cfo-india-2');
  ```
  Run final check: `SELECT count(*) FROM public.job_descriptions;` — assert 0 rows.
  Commit all local changes (migration files + updated types) with message: `feat: add job_descriptions table with RLS and RPC functions`.
