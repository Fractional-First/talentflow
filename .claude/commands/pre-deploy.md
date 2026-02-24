# Pre-Deployment Checklist

Run this checklist before deploying any changes to production.

## Automated Checks

Run these commands and verify they pass:

```bash
# Build both repos
cd talentflow && npm run build
cd public-profiles && npm run build

# Lint both repos
cd talentflow && npm run lint
cd public-profiles && npm run lint

# Run tests
cd talentflow && npm run test:run
cd public-profiles && npm run test:run
```

## Manual Verification

### For talentflow changes:

- [ ] Test login flow (email/password)
- [ ] Test signup flow (if auth changes)
- [ ] Test protected route access with different user statuses
- [ ] Test profile editing saves correctly
- [ ] Test work preferences form

### For public-profiles changes:

- [ ] Test SSR with a real profile slug
- [ ] Check SEO meta tags render correctly
- [ ] Test sitemap generation: `/sitemap-profiles.xml`
- [ ] Verify mobile responsiveness

### For cross-repo changes:

- [ ] Supabase types are synced (run /sync-types)
- [ ] ProfileData interface matches in both repos
- [ ] Test the same profile loads in both apps

## Security Check

```bash
# Verify no secrets in staged changes
git diff --cached | grep -iE "(supabase|api_key|secret|password|token)" || echo "No secrets found"
```

## Deployment Order

1. **Database migrations** (if any) - apply via Supabase dashboard
2. **public-profiles** - deploy first (read-only, safer)
3. **talentflow** - deploy second (writes to database)

## Rollback Plan

If issues are found after deployment:

1. Revert the commit: `git revert HEAD`
2. Deploy the revert
3. Investigate in development environment

## Report

After running checks, summarize:
- Build status (pass/fail)
- Lint status (pass/fail)
- Test status (pass/fail with count)
- Any warnings or concerns
