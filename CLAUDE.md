# Fractional First - Claude Code Development Guide

> **PRODUCTION SYSTEM**: ~300 active users. All changes require verification before deployment.
>
> **Thinking modes**: Use "think" for simple tasks, "think hard" for multi-file changes, "think harder" for architecture decisions, "ultrathink" for production-critical or cross-repo changes.

---

## Quick Reference

### Bash Commands

```bash
# talentflow (React/Vite) - localhost:5173
cd talentflow && npm run dev        # Start dev server
cd talentflow && npm run build      # Production build
cd talentflow && npm run lint       # ESLint
cd talentflow && npm run test       # Run tests

# public-profiles (Next.js 15) - localhost:3000
cd public-profiles && npm run dev   # Start dev server (Turbopack)
cd public-profiles && npm run build # Production build
cd public-profiles && npm run lint  # ESLint
cd public-profiles && npm run test  # Run tests

# Supabase
cd talentflow && npx supabase start                    # Start local Supabase
cd talentflow && npx supabase db reset                 # Reset local DB with migrations
cd talentflow && npx supabase gen types typescript \
  --project-id dtyugokvlksnatftpucm \
  > src/integrations/supabase/types.ts                 # Regenerate types
```

### Core Files

**talentflow/**
| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions, auth state machine |
| `src/integrations/supabase/client.ts` | Supabase client (hardcoded keys) |
| `src/integrations/supabase/types.ts` | Database types (source of truth) |
| `src/types/profile.ts` | ProfileData interface |
| `src/components/create-profile/types.ts` | N8N webhook URLs |
| `src/queries/usePublicProfile.ts` | Profile fetching (uses get_anon_profile) |
| `supabase/migrations/` | 43+ SQL migrations |

**public-profiles/**
| File | Purpose |
|------|---------|
| `src/app/profile/[slug]/page.tsx` | Profile SSR entry point |
| `src/lib/supabase-server.ts` | Server-side Supabase calls |
| `src/lib/usePublicProfile.ts` | Client-side profile fetching |
| `src/integrations/supabase/types.ts` | Database types (sync with talentflow) |
| `src/types/profile.ts` | ProfileData interface (must match talentflow) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Fractional First                              │
├──────────────────────────────┬──────────────────────────────────────┤
│  talentflow/                 │  public-profiles/                     │
│  React 18 + Vite + Router    │  Next.js 15 + App Router              │
│  ───────────────────────     │  ────────────────────────             │
│  • User auth & onboarding    │  • SEO-optimized profiles             │
│  • Profile creation/editing  │  • SSR with structured data           │
│  • Dashboard & settings      │  • Sitemap generation                 │
│  • Work preferences          │  • Anonymous profile viewing          │
│  • TypeScript: LENIENT       │  • TypeScript: STRICT                 │
├──────────────────────────────┴──────────────────────────────────────┤
│                    Shared Backend (Supabase)                         │
│  URL: https://api.fractionalfirst.com                                │
│  Project ID: dtyugokvlksnatftpucm                                    │
│  ────────────────────────────────────────────────────────────────    │
│  Tables: profiles, fractional_preferences, full_time_preferences,    │
│          countries, industries, timezones, locations                 │
│  RPC: get_public_profile, get_anon_profile, get_public_profile_by_id │
│  Edge Functions: google-places, google-place-details                 │
├─────────────────────────────────────────────────────────────────────┤
│                    N8N Webhooks (Railway)                            │
│  Host: webhook-processor-production-1757.up.railway.app              │
│  ────────────────────────────────────────────────────────────────    │
│  /webhook/generate-profile           (documents upload)              │
│  /webhook/generate-profile-linkedin  (LinkedIn URL)                  │
│  /webhook/submit-profile             (post-signup submission)        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Critical Risk Zones

### 1. RPC Function Inconsistency (HIGH RISK)

**The Problem**: Both repos fetch profiles differently.

| Repo | File | RPC Called | Returns |
|------|------|-----------|---------|
| talentflow | `src/queries/usePublicProfile.ts:28` | `get_anon_profile` | `anon_profile_data` |
| public-profiles | `src/lib/supabase-server.ts:13` | `get_anon_profile` | `anon_profile_data` |
| public-profiles | `src/lib/usePublicProfile.ts:28` | `get_public_profile` | `profile_data` |

**Before modifying profile fetching**: Verify which RPC is correct for your use case. Check the migration files in `talentflow/supabase/migrations/` for function definitions.

### 2. Type Drift Between Repos (MEDIUM RISK)

**The Problem**: Supabase types diverge over time.

- talentflow types: `src/integrations/supabase/types.ts` (892 lines)
- public-profiles types: `src/integrations/supabase/types.ts` (968 lines)

**Known differences**:
- `profiles.email`: talentflow allows null, public-profiles requires string
- `profiles.anon_profile_data`: exists in talentflow, missing in public-profiles
- public-profiles has extra vector functions (halfvec_*, binary_quantize)

**After any schema change**: Run `/sync-types` to regenerate and sync both repos.

### 3. Hardcoded Credentials (SECURITY)

**The Problem**: Supabase anon key is hardcoded in source files.

| File | Line |
|------|------|
| `talentflow/src/integrations/supabase/client.ts` | 6-7 |
| `public-profiles/src/integrations/supabase/client.ts` | 6-7 |

**Note**: The anon key is designed to be public (used client-side), but avoid further exposure. The `.env` file should be in `.gitignore`.

### 4. N8N Single Point of Failure (MEDIUM RISK)

**The Problem**: All profile generation flows through one Railway instance.

```
webhook-processor-production-1757.up.railway.app
├── /webhook/generate-profile          (documents)
├── /webhook/generate-profile-linkedin (LinkedIn)
└── /webhook/submit-profile            (post-signup)
```

**Webhook URLs defined in**: `talentflow/src/components/create-profile/types.ts:46-49`

**If Railway is down**: All new profile creation fails. No fallback exists.

### 5. TypeScript Strictness Mismatch (MEDIUM RISK)

| Repo | Config | Key Settings |
|------|--------|-------------|
| talentflow | `tsconfig.json` | `noImplicitAny: false`, `strictNullChecks: false` |
| public-profiles | `tsconfig.json` | `strict: true` |

**Risk**: Code that compiles in talentflow may fail in public-profiles.

**When sharing code**: Test compilation in BOTH repos before committing.

---

## TDD Workflow

When implementing features, follow this test-driven approach:

### 1. Write Failing Tests First

```bash
# Create test file in appropriate directory
# talentflow: src/__tests__/queries/myFeature.test.ts
# public-profiles: src/__tests__/lib/myFeature.test.ts

# Run in watch mode
cd talentflow && npm run test -- --watch src/__tests__/queries/myFeature.test.ts
```

### 2. Verify Tests Fail Correctly

Tests should fail because the feature doesn't exist, NOT because of:
- Syntax errors
- Import issues
- Mock configuration problems

### 3. Implement Minimum Code

Write only enough code to make tests pass. Don't over-engineer.

### 4. Verify Tests Pass

```bash
npm run test -- src/__tests__/queries/myFeature.test.ts
```

### 5. Refactor (Optional)

Clean up code while keeping tests green.

### Example Test Pattern (Supabase RPC)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePublicProfile } from '@/queries/usePublicProfile'

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn()
  }
}))

describe('usePublicProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches profile by slug', async () => {
    const mockProfile = { anon_slug: 'test-slug', anon_profile_data: { name: 'Test' } }
    supabase.rpc.mockResolvedValueOnce({ data: mockProfile, error: null })

    const { result } = renderHook(() => usePublicProfile({ slug: 'test-slug' }))

    await waitFor(() => expect(result.current.data).toEqual(mockProfile))
    expect(supabase.rpc).toHaveBeenCalledWith('get_anon_profile', { anon_slug_param: 'test-slug' })
  })

  it('handles permission errors gracefully', async () => {
    supabase.rpc.mockResolvedValueOnce({ data: null, error: { code: '42501' } })

    const { result } = renderHook(() => usePublicProfile({ slug: 'unpublished' }))

    await waitFor(() => expect(result.current.error?.code).toBe('42501'))
  })
})
```

---

## Safety Checklist

### Before Making Changes

```
□ Which repo(s) does this change affect?
□ Does this touch Supabase types? → Run /sync-types after
□ Does this modify RPC calls? → Verify function exists in migrations
□ Does this change ProfileData? → Update BOTH src/types/profile.ts files
□ Does this touch authentication? → Test full login/signup flow
□ Does this modify N8N webhooks? → Coordinate with webhook code
```

### Before Deploying

```
□ npm run build succeeds in affected repo(s)
□ npm run lint passes
□ npm run test passes
□ Manual test in dev environment
□ For talentflow: Test protected routes with different user statuses
□ For public-profiles: Test SSR with real profile slug
□ Cross-repo changes: Deploy public-profiles FIRST (read-only, safer)
```

---

## Cross-Repo Coordination

### Adding a New Field to ProfileData

1. **Database first** (think harder about schema):
   ```bash
   cd talentflow
   npx supabase migration new add_field_name
   # Edit migration file, apply via Supabase dashboard
   ```

2. **Regenerate types**:
   ```bash
   cd talentflow && npx supabase gen types typescript \
     --project-id dtyugokvlksnatftpucm \
     > src/integrations/supabase/types.ts
   ```

3. **Update ProfileData in BOTH repos**:
   - `talentflow/src/types/profile.ts`
   - `public-profiles/src/types/profile.ts`

4. **Update RPC if needed** (check migrations for function definitions)

5. **Deploy order**:
   1. Database migration (already done)
   2. public-profiles (read-only, safe first)
   3. talentflow (writes new data)

### Syncing Supabase Types

Run the `/sync-types` slash command, or manually:

```bash
# Generate from talentflow (has migrations)
cd talentflow
npx supabase gen types typescript \
  --project-id dtyugokvlksnatftpucm \
  > src/integrations/supabase/types.ts

# Copy to public-profiles
cp src/integrations/supabase/types.ts \
   ../public-profiles/src/integrations/supabase/types.ts

# Verify both compile
cd ../public-profiles && npm run build
cd ../talentflow && npm run build
```

---

## Local Supabase Testing

### Starting Local Supabase

```bash
cd talentflow
npx supabase start
# Note the API URL and anon key from output
```

### Running Migrations Locally

```bash
npx supabase db reset  # Drops and recreates with all migrations
```

### When to Use Real vs Mock Supabase

| Scenario | Use |
|----------|-----|
| Unit tests for hooks/components | Mock Supabase client |
| Testing RPC function logic | Local Supabase |
| Testing RLS policies | Local Supabase |
| CI/CD pipeline | Mock Supabase client |
| Manual smoke testing | Local or production Supabase |

---

## Conventions & Patterns

### File Naming

- React components: PascalCase (`ProfileCard.tsx`)
- Hooks: camelCase with `use` prefix (`usePublicProfile.ts`)
- Queries: camelCase with `use` prefix (`useGetUser.ts`)
- Utils: camelCase (`profileStorage.ts`)
- Types: camelCase (`profile.ts`)
- Tests: `*.test.ts` or `*.test.tsx`

### Import Alias

Both repos: `@/*` → `./src/*`

### State Management

- Server state: TanStack Query (React Query)
- Client state: React useState/useContext
- No Redux or Zustand

### Authentication Flow (talentflow)

User statuses in order:
1. `SET_PASSWORD` → `/change-password`
2. `EMAIL_CONFIRMED` → `/create-profile`
3. `PROFILE_GENERATED` → `/edit-profile`
4. `PROFILE_CONFIRMED` → `/dashboard`
5. `PREFERENCES_SET` → `/dashboard`

### Error Handling

- Supabase errors: Check `error.code === "42501"` (permission denied)
- N8N errors: Catch fetch failures, show user-friendly message
- Profile not found: Return `null`, let UI handle

---

## Debugging Tips

### Profile Not Loading

1. Check browser console for Supabase errors
2. Verify profile `ispublished` status in database
3. Check which RPC is being called (network tab)
4. Verify slug/UUID format matches expected pattern

### N8N Webhook Failures

1. Check Railway dashboard for logs
2. Verify webhook URL hasn't changed
3. Check request payload format in network tab
4. Look for rate limiting headers

### Type Errors After Migration

1. Regenerate types: `npx supabase gen types typescript ...`
2. Restart TypeScript server in IDE (Cmd+Shift+P → "Restart TS Server")
3. Check for nullable field changes in migration
4. Compare types.ts files between repos

### Build Failures

```bash
# Check TypeScript errors
npm run build 2>&1 | head -50

# Check for import issues
npm run lint
```

---

## Emergency Contacts

- **Supabase Dashboard**: https://supabase.com/dashboard/project/dtyugokvlksnatftpucm
- **Railway Dashboard**: Check for N8N webhook status
- **GitHub Org**: https://github.com/Fractional-First

---

## Automated Verification (Hooks)

This project uses Claude Code hooks to automatically verify work quality and prompt for commits. Hooks run automatically - no manual intervention needed.

### Workflow

1. **After each Edit/Write**: ESLint runs on changed file (fast feedback)
2. **When Claude stops**: Full test suite + lint runs in both repos
3. **If tests pass**: Claude asks if you want to commit changes
4. **You review and approve**: Claude creates descriptive commits

### Hook Configuration

Hooks are defined in `talentflow/.claude/settings.local.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "...post-edit-lint.sh" }]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "...verify-work.sh" },
          { "type": "prompt", "prompt": "Ask user if they want to commit..." }
        ]
      }
    ]
  }
}
```

### What the Hooks Check

**Post-Edit Lint** (`.claude/hooks/post-edit-lint.sh`):
- Runs ESLint on the edited file
- Non-blocking (shows warnings but doesn't stop Claude)
- Skips non-JS/TS files

**Verify Work** (`.claude/hooks/verify-work.sh`):
- Runs `npm run test:run` in both repos
- Runs `npm run lint` in both repos
- Reports uncommitted changes
- **Blocking**: If tests fail, Claude cannot stop until they're fixed

**Commit Prompt** (prompt-based hook):
- After tests pass, asks if you want to commit
- Shows summary of changes
- Human approval required before committing

### Exit Codes

- `0` = Success, continue
- `2` = Blocking error, Claude must fix before proceeding

### Disabling Hooks Temporarily

If hooks are causing issues, you can disable them by renaming the settings file:

```bash
mv talentflow/.claude/settings.local.json talentflow/.claude/settings.local.json.bak
```

---

## Slash Commands

Use these custom commands for common workflows:

| Command | Purpose |
|---------|---------|
| `/sync-types` | Regenerate and sync Supabase types across repos |
| `/pre-deploy` | Run full pre-deployment checklist |
| `/profile-change` | Checklist for ProfileData modifications |
| `/test` | TDD workflow helper |
| `/audit` | Security and code quality audit |

---

*Last updated: January 2025*
*Maintained by: Fractional CTO + Claude Code*
