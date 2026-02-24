# TalentFlow Knowledge

Accumulated patterns, decisions, and gotchas for the TalentFlow app.

## Patterns

### Profile Data Flow
- Profile generation goes through N8N webhooks, not direct Supabase
- Guest profiles use `generate-profile-guest`, authenticated use `generate-profile-linkedin`
- Anonymous profiles are generated via `generate-anon-profile` webhook

### RPC Functions
- `get_anon_profile` - Returns anonymized profile by slug
- `get_public_profile` - Returns full profile by slug
- `get_public_profile_by_id` - Returns profile by UUID

### State Machine
User statuses in order:
1. `SET_PASSWORD` → `/change-password`
2. `EMAIL_CONFIRMED` → `/create-profile`
3. `PROFILE_GENERATED` → `/edit-profile`
4. `PROFILE_CONFIRMED` → `/dashboard`
5. `PREFERENCES_SET` → `/dashboard`

## Decisions

### 2025-01: TypeScript Lenient Mode
- **Context**: Rapid development phase, many legacy patterns
- **Decision**: Keep `strictNullChecks: false` for now
- **Consequences**: Must be careful with null handling, especially in shared code with public-profiles

## Gotchas

### RPC Return Type Differences
- **Problem**: `get_anon_profile` returns `anon_profile_data`, `get_public_profile` returns `profile_data`
- **Solution**: Always check which RPC you're calling and destructure accordingly
- **Example**: `src/queries/usePublicProfile.ts`

### Type Drift with public-profiles
- **Problem**: Supabase types can diverge between repos
- **Solution**: Run `/sync-types` after any schema change
- **Example**: `profiles.email` nullability differs

### N8N Webhook Timeout
- **Problem**: Large document uploads can timeout
- **Solution**: Railway has 30s timeout, large files may fail
- **Workaround**: Consider chunking or async processing

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions, auth state machine |
| `src/integrations/supabase/types.ts` | Database types (source of truth) |
| `src/types/profile.ts` | ProfileData interface |
| `src/components/create-profile/types.ts` | N8N webhook URLs |

## External Dependencies

| Service | Purpose | Dashboard |
|---------|---------|-----------|
| Supabase | Database + Auth | https://supabase.com/dashboard/project/dtyugokvlksnatftpucm |
| Railway | N8N Webhooks | Railway dashboard |
| Vercel | Hosting | Vercel dashboard |

## Common Tasks

### Regenerate Supabase Types
```bash
npx supabase gen types typescript \
  --project-id dtyugokvlksnatftpucm \
  > src/integrations/supabase/types.ts
```

### Test Specific Component
```bash
npm run test -- --grep "ComponentName"
```
