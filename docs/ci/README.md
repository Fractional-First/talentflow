# CI proposals

Workflows that are ready to ship but waiting on a credential or governance step
before they can move into `.github/workflows/`.

## `supabase-db-push.yml`

Auto-applies Supabase migrations to whichever project is pinned in
`supabase/config.toml` (`project_id`) whenever a commit landing on `main`
touches `supabase/migrations/**`. Replaces the current manual
`npx supabase db push` step. The workflow also exposes a manual
`workflow_dispatch` trigger with a `dry_run` flag for safe inspection.

Behaviour summary:

- **Triggered only when migrations change.** Push trigger uses
  `paths: supabase/migrations/**` so unrelated commits to `main` are no-ops.
- **No-op when nothing is pending.** `supabase db push --linked` itself
  reports "no migrations to apply" and exits 0.
- **Fails loudly on conflicts.** `supabase migration list --linked` and the
  preceding `--dry-run` print the diff; `supabase db push` exits non-zero on
  history mismatch and the job fails.
- **Single-project, single-env.** The project ref is read from
  `supabase/config.toml` at job time, so there is one source of truth.

### To activate

1. **Add two repo secrets** (Settings → Secrets and variables → Actions on
   `Fractional-First/talentflow`):
   - `SUPABASE_ACCESS_TOKEN` — Supabase personal access token from
     <https://supabase.com/dashboard/account/tokens>. Adam's existing token is
     already in `~/mini/brain/system/.env` under the same key.
   - `SUPABASE_DB_PASSWORD` — production DB password for the linked project
     (currently `dtyugokvlksnatftpucm`, per `supabase/config.toml`).
2. **Move the file into place** from a workflow-scoped local checkout (or
   create the file directly via the GitHub web editor on this branch):
   ```bash
   git mv docs/ci/supabase-db-push.yml .github/workflows/supabase-db-push.yml
   git rm docs/ci/README.md          # this file is no longer needed
   git commit -m "ci: enable supabase-db-push workflow"
   git push
   ```
3. **Smoke-test from GitHub:** Actions → "Supabase DB Push" → Run workflow →
   set `dry_run = true`. Expect a green run that prints `migration list` and
   `db push --dry-run` output and **no** writes.
4. **Optional belt-and-braces:** for the first real migration PR after
   activation, watch the workflow run on merge and confirm the new migration
   shows up in the Supabase dashboard.

### Why this lives here for now

The Paperclip CTO agent's GitHub PAT for `adam-frationalfirst` is
fine-grained and does not carry the "Workflows: write" permission, so it
cannot create or update files under `.github/workflows/` via either
`git push` or the contents API. The `git mv` above takes one command from a
workflow-scoped session, or one save from the GitHub web editor.
