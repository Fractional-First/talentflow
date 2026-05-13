# CI proposals

Workflows that are ready to ship but waiting on a credential or governance step
before they can move into `.github/workflows/`.

## `supabase-db-push.yml`

Auto-applies Supabase migrations to project `dtyugokvlksnatftpucm` whenever a
commit landing on `main` touches `supabase/migrations/**`. Replaces the current
manual `npx supabase db push` step.

### To activate

1. **Add two repo secrets** (Settings → Secrets and variables → Actions):
   - `SUPABASE_ACCESS_TOKEN` — personal access token from
     <https://supabase.com/dashboard/account/tokens>. (Adam's existing token is
     already in `~/mini/brain/system/.env` under the same key.)
   - `SUPABASE_DB_PASSWORD` — production DB password for project
     `dtyugokvlksnatftpucm`.
2. **Move the file into place:**
   ```bash
   git mv docs/ci/supabase-db-push.yml .github/workflows/supabase-db-push.yml
   git commit -m "ci: enable supabase-db-push workflow"
   git push
   ```
3. **Smoke-test from GitHub:** Actions → "Supabase DB Push" → Run workflow →
   set `dry_run = true`. Expect a green run with `supabase migration list` +
   `supabase db push --dry-run` output and **no** writes.

### Why this lives here for now

The Paperclip CTO agent's GitHub PAT does not carry the `workflow` scope, so it
cannot push files into `.github/workflows/`. The `git mv` above takes one
command from a workflow-scoped session.
