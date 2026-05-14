# Branch Protection And Release Guardrails

This file documents the GitHub settings that must exist outside the repo for the CI/CD model to be safe.

## Required branch protection for `main`

- Require a pull request before merging
- Require at least 1 human approval
- Dismiss stale approvals when new commits are pushed
- Require approval of the most recent reviewable push
- Require conversation resolution before merging
- Require status checks to pass before merging
  - `CI / validate`
  - `Migration Check / validate-migrations` when migrations change
- Block force pushes
- Block branch deletion
- Do not give bots or app accounts bypass permission

## Production environment

- Create a GitHub environment named `production`
- Store only production migration secrets there:
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_DB_PASSWORD`
  - `SUPABASE_PROJECT_REF`
- Require a human reviewer before the environment releases secrets

## Repository secrets

Used by workflows that run on every PR (not just merges to `main`):

- `VITE_SUPABASE_URL` — public Supabase project URL, required by the Vite build step in `ci.yml`
- `VITE_SUPABASE_ANON_KEY` — public anon key, required by the Vite build step in `ci.yml`
- `OPENROUTER_API_KEY` — OpenRouter API key, used by `claude-review.yml` to call Claude on every PR

## Data-loss posture

- `supabase db push` is not automatically destructive, but it will execute merged migration SQL exactly as written
- Additive migrations are preferred
- Destructive operations such as `DROP TABLE`, `DROP COLUMN`, and `TRUNCATE` should be blocked from the automated path
- Data-rewriting operations such as `UPDATE`, `DELETE`, and `ALTER TYPE` require explicit human review and a rollback/backfill plan in the PR

## Deploy ordering

The repo serializes production migrations via GitHub Actions. That removes local-machine dependency, but it does **not** by itself guarantee "migration before frontend deploy" while frontend hosting auto-deploys are still active.

To fully enforce ordering, choose one of these external follow-ups:

1. Disable host-side auto-deploy to production and trigger production deploy from GitHub after the migration job succeeds.
2. Keep previews automatic, but route production promotion through a GitHub-controlled deploy hook after migration.
