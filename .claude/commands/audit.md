# Security and Code Quality Audit

Run this audit periodically or before major releases.

## 1. Dependency Vulnerabilities

```bash
# Check both repos
cd talentflow && npm audit
cd public-profiles && npm audit

# Fix automatically where possible
npm audit fix
```

## 2. Secret Scanning

Check for accidentally committed secrets:

```bash
# Search for common secret patterns
grep -rn "sk_live\|sk_test\|api_key\|apikey\|secret\|password" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" .

# Check .env files are gitignored
cat talentflow/.gitignore | grep -E "^\.env"
cat public-profiles/.gitignore | grep -E "^\.env"

# Verify .env not tracked
cd talentflow && git ls-files .env 2>/dev/null && echo "WARNING: .env is tracked!" || echo ".env not tracked (good)"
cd public-profiles && git ls-files .env.local 2>/dev/null && echo "WARNING: .env.local is tracked!" || echo ".env.local not tracked (good)"
```

## 3. Hardcoded Credentials Check

Known hardcoded values (by design - anon keys are public):
- `talentflow/src/integrations/supabase/client.ts` - Supabase anon key
- `public-profiles/src/integrations/supabase/client.ts` - Supabase anon key

Check for new hardcoded values:
```bash
grep -rn "eyJ" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".test."
```

## 4. TypeScript Strictness

**talentflow** has lenient TypeScript. Check for risky patterns:

```bash
cd talentflow
# Find implicit any usage
grep -rn ": any" --include="*.ts" --include="*.tsx" src/ | head -20

# Find non-null assertions
grep -rn "!" --include="*.ts" --include="*.tsx" src/ | grep -v "!=\|!=" | head -20
```

## 5. RLS Policy Review

Verify Row Level Security is properly configured:

```bash
cd talentflow
# List RLS-related migrations
ls -la supabase/migrations/ | grep -i rls
```

Check policies in Supabase dashboard:
- profiles table should have SELECT restricted to owner or published profiles
- preferences tables should be restricted to owner

## 6. N8N Webhook Security

Verify webhook endpoints:
```bash
grep -rn "webhook-processor-production" talentflow/src/
```

Check that webhooks:
- Don't expose sensitive user data in URLs
- Have error handling for failures
- Don't block user flow if webhook fails

## 7. Build Output Review

Check for source maps in production:
```bash
cd talentflow && npm run build && ls -la dist/*.map 2>/dev/null && echo "WARNING: Source maps in production" || echo "No source maps (good)"
```

## 8. Outdated Dependencies

```bash
cd talentflow && npm outdated
cd public-profiles && npm outdated
```

Focus on:
- Security-related packages (supabase-js, next)
- Major version updates that may have breaking changes

## Summary Report Template

```
## Audit Report - [Date]

### Dependency Vulnerabilities
- talentflow: X critical, X high, X moderate
- public-profiles: X critical, X high, X moderate

### Secrets
- [ ] No new secrets found in code
- [ ] .env files properly gitignored

### TypeScript
- [ ] No new `any` types in critical paths
- [ ] Type drift between repos: [status]

### RLS Policies
- [ ] Verified in Supabase dashboard

### Action Items
1. [List any issues found]
```
