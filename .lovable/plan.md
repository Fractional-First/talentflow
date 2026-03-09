

## Widen Agreement Page Layout + Fix Build Errors

### Problem
The content container is capped at `max-w-3xl` (48rem / 768px), leaving excessive white space on larger screens.

### Layout Fix
**`src/pages/dashboard/Agreement.tsx` (line 198)**
- Change `max-w-3xl` to `max-w-4xl` (896px) — better use of space while keeping form content readable and not overly wide for text-heavy legal sections.

### Build Error Fixes (pre-existing)

**`src/components/agreement/ContractingTypeSection.tsx`** — Make `addressLine2` optional in the `RegisteredAddress` type:
- Change `addressLine2: string` to `addressLine2?: string` (if that's where the type is defined)

**`src/queries/useAgreementAcceptance.ts` (line ~126)** — Cast the JSON fields from Supabase RPC response:
- Cast `row.residential_address as AcceptanceData['residentialAddress']`
- Cast `row.entity_address as AcceptanceData['entityAddress']`

These are three small, independent fixes.

