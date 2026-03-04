

## Separate "Save Draft" and "Go to Dashboard" Buttons

Currently, the StickyActionBar has a single combined button labeled "Save Draft & Go to Dashboard" that calls `handleContinue` (which saves and navigates to dashboard). We need to split this into two distinct buttons.

### Changes Required

**1. `src/components/edit-profile/StickyActionBar.tsx`**
- Add a new `onSaveDraft` prop to the interface
- Replace the single "Save Draft & Go to Dashboard" button with two buttons:
  - **"Save Draft"** (outline variant) — calls `onSaveDraft`, saves profile without navigating
  - **"Go to Dashboard"** (primary variant, with ArrowRight icon) — calls `onSaveAndContinue`, saves and navigates
- Mobile layout: show both buttons in the row (adjust flex sizing)
- Desktop layout: show both buttons side by side in the right group

**2. `src/hooks/useEditProfile.ts`**
- Add a new `handleSaveDraft` function that triggers the auto-save/manual save without navigating to dashboard (just saves current form state and shows a success toast)
- Export `handleSaveDraft` alongside `handleContinue`

**3. `src/pages/EditProfile.tsx`**
- Pass the new `onSaveDraft={handleSaveDraft}` prop to `StickyActionBar`

