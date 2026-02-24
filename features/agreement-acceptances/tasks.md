# Agreement Acceptances — Tasks

> **PRD:** [PRD.md](./PRD.md)
> **Status:** 5/8 tasks complete

## Test User for UI Verification

Use this pre-created test account to sign in and verify UI changes:

| Field | Value |
|-------|-------|
| **Email** | `test@fractionalfirst.com` |
| **Password** | `TestUser123!` |

Sign in at `http://localhost:5173/login` using email/password (not LinkedIn). This user has `PROFILE_CONFIRMED` status and can access all dashboard routes including `/dashboard/agreement`.

---

## 1. Database & Schema

- [x] **1.1 Create agreement_acceptances table and RPC functions**
  `supabase/migrations/YYYYMMDDHHMMSS_create_agreement_acceptances.sql`
  Apply migration via Supabase MCP (`apply_migration`) that creates:
  - `agreement_acceptances` table with all columns from PRD Section 5
  - Indexes on `profile_id` and `agreement_version`
  - RLS policies: SELECT and INSERT for own records only (no UPDATE/DELETE)
  - `record_agreement_acceptance()` RPC (SECURITY DEFINER) — inserts a row using `auth.uid()`
  - `get_current_agreement_status()` RPC (SECURITY DEFINER) — returns latest acceptance + version match check
  - `updated_at` trigger using existing `update_updated_at_column()` function
  After applying, run `generate_typescript_types` to update `types.ts`.

## 2. Query Layer

- [x] **2.1 Create useAgreementAcceptance query hook**
  `src/queries/useAgreementAcceptance.ts` — new file
  Export `CURRENT_AGREEMENT_VERSION` constant (`"2026-01-30-mca-v1"`).
  Export `useAgreementStatus()` — calls `get_current_agreement_status` RPC, returns `{ isAccepted, isCurrentVersion, acceptedAt, agreementVersion, isLoading }`. Query key: `["agreement-status", user?.id]`, enabled when user is logged in.
  Export `useRecordAcceptance()` — mutation calling `record_agreement_acceptance` RPC. On success: invalidate `["agreement-status"]` queries. Passes `navigator.userAgent` as `p_user_agent`.
  Follow existing patterns from `src/queries/` (see `useProfileData.ts`, `useFractionalPreferences.ts`).

## 3. Frontend Integration

- [x] **3.1 Wire Agreement.tsx to database**
  `src/pages/dashboard/Agreement.tsx`
  Replace the localStorage reads (lines 19-22) with `useAgreementStatus()` hook. Use `isAccepted` and `isCurrentVersion` from the hook instead of `localStorage.getItem("agreement_accepted")`.
  Replace the localStorage writes in `handleSubmit` (lines 149-156) with `recordAcceptance.mutate({...})`. Remove all `localStorage.setItem` calls. Remove the `savedData` variable and its usage for pre-filling form state (form should start blank for new acceptances; if re-consenting, don't pre-fill old data — they need to re-enter).
  Keep `isSubmitting` state tied to mutation's `isPending`. Show toast on error.
  VERIFY: Navigate to `http://localhost:5173/dashboard/agreement`. Fill in all required fields (name, address, email, phone, contracting type, accept checkbox). Click submit. Verify no localStorage keys are set. Verify the acceptance shows in the database via `execute_sql SELECT * FROM agreement_acceptances`.

- [x] **3.2 Wire NextStepsCard.tsx to database**
  `src/components/dashboard/NextStepsCard.tsx`
  Replace `localStorage.getItem("agreement_accepted")` (line 35) with `useAgreementStatus()` hook. Use `isAccepted` to control the "New" badge visibility.
  VERIFY: Navigate to `http://localhost:5173/dashboard`. Check that the agreement card shows "New" badge when no acceptance exists in the database.

- [x] **3.3 Add re-consent banner**
  `src/pages/dashboard/Agreement.tsx`
  When `isAccepted && !isCurrentVersion` (from `useAgreementStatus()`), show the form in editable mode (not read-only) with an info banner at the top: "Our agreement has been updated since you last accepted. Please review and re-accept to remain engagement-ready." Use the existing blue info banner style (similar to the read-only banner but with different copy). Remove the `pointer-events-none opacity-80` wrapper when re-consent is needed.
  VERIFY: Manually insert a row in `agreement_acceptances` with an old version string (e.g., `"2025-01-01-old"`). Navigate to `http://localhost:5173/dashboard/agreement`. Verify the re-consent banner appears and the form is editable.

## 4. Cleanup

- [ ] **4.1 Remove all localStorage agreement references**
  `src/pages/dashboard/Agreement.tsx`, `src/components/dashboard/NextStepsCard.tsx`
  Search the entire codebase for `agreement_accepted` and `agreement_data` localStorage keys. Remove any remaining reads/writes. This should already be done by tasks 3.1 and 3.2, but do a final sweep to catch anything missed (e.g., other components, utils).
  Run `npm run build` to verify no TypeScript errors.

## 5. Merge & Resolve Conflicts

- [ ] **5.1 Merge main into feature branch and resolve conflicts**
  Run `git fetch origin && git merge origin/main`. The known conflict is in `src/pages/CreateProfile.tsx` — Daniel's branch adds `uploadConfirmed` state while main adds `hasResume`/`canSubmit` logic. Combine both: keep the `canSubmit` logic from main AND the `uploadConfirmed` gate from Daniel. Run `npm run build` to verify clean compilation after merge. Commit the merge.

## 6. Integration & E2E Verification

- [ ] **6.1 Full flow verification**
  VERIFY:
  1. Fresh user (no acceptance): Dashboard shows "New" badge on agreement card. Agreement page shows editable form.
  2. Submit agreement: Fill all fields, submit. Success state shown. Navigate back to dashboard — "New" badge is gone.
  3. Reload page: Acceptance persists (not localStorage — open incognito, log in, verify still accepted).
  4. Re-consent: Update `CURRENT_AGREEMENT_VERSION` to a new value. Reload agreement page — re-consent banner appears, form is editable. Re-submit. New row created in database, old row preserved.
  5. Audit: Query `SELECT * FROM agreement_acceptances ORDER BY created_at` — verify both rows exist with correct versions.
