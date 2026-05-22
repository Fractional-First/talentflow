# Sync Supabase Types

Regenerate Supabase types from the database and sync across both repositories.

## Steps

1. **Generate types from Supabase** (talentflow has the migrations):

```bash
cd talentflow && npx supabase gen types typescript --project-id dtyugokvlksnatftpucm > src/integrations/supabase/types.ts
```

2. **Copy to public-profiles**:

```bash
cp talentflow/src/integrations/supabase/types.ts public-profiles/src/integrations/supabase/types.ts
```

3. **Verify both repos compile**:

```bash
cd talentflow && npm run build
cd public-profiles && npm run build
```

4. **Review the diff** before committing:

```bash
cd talentflow && git diff src/integrations/supabase/types.ts
cd public-profiles && git diff src/integrations/supabase/types.ts
```

## Important Notes

- talentflow is the source of truth (it contains the migrations)
- public-profiles may have additional vector functions - check if they're still needed
- If build fails, check for nullable field changes that affect existing code
- Always commit type changes separately from feature changes

## When to Run

- After creating a new migration
- After modifying RPC functions
- When you see type errors related to Supabase
- Before starting work on a feature that touches the database
