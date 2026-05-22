# Profile Data Change Checklist

Use this checklist when modifying ProfileData or related profile interfaces.

## Before Making Changes

Think hard about:
- Is this field needed in both repos?
- Does this require a database migration?
- Will existing profiles need backfilling?

## Files to Update

### 1. Database (if adding/modifying columns)

```bash
cd talentflow
npx supabase migration new add_[field_name]
# Edit the migration file in supabase/migrations/
```

### 2. Supabase Types

After migration, regenerate types:
```bash
cd talentflow && npx supabase gen types typescript --project-id dtyugokvlksnatftpucm > src/integrations/supabase/types.ts
```

### 3. ProfileData Interface (BOTH REPOS)

Update these files to match:
- `talentflow/src/types/profile.ts`
- `public-profiles/src/types/profile.ts`

### 4. RPC Functions (if field is returned by RPC)

Check these migrations for RPC definitions:
- `talentflow/supabase/migrations/*_public_profile*.sql`
- Functions: `get_public_profile`, `get_anon_profile`, `get_public_profile_by_id`

### 5. Components Using ProfileData

Search for usage:
```bash
cd talentflow && grep -r "ProfileData" src/
cd public-profiles && grep -r "ProfileData" src/
```

## RPC Functions Reference

| Function | Returns | Used By |
|----------|---------|---------|
| `get_public_profile(slug)` | `profile_data` | talentflow public profile view |
| `get_anon_profile(slug)` | `anon_profile_data` | public-profiles SSR |
| `get_public_profile_by_id(uuid)` | `profile_data` | Preview mode |

## Testing

1. Write test for the new field handling
2. Test that existing profiles still load (backward compatibility)
3. Test both repos render the field correctly

## Deployment Order

1. Database migration (Supabase dashboard)
2. Sync types (/sync-types)
3. Deploy public-profiles (read-only)
4. Deploy talentflow (can write new field)

## Backward Compatibility

If the field is required:
- Set a default value in migration
- Handle null/undefined in UI code
- Consider backfilling existing records
