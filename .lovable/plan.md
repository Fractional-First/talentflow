

## Publish Confirmation Modal

### Overview
When a user clicks "Publish" (from either the StickyActionBar or the Dashboard NextStepsCard), a confirmation modal will appear explaining what publishing means, with two options: **Confirm Publish** or **Cancel**. After confirming, the modal transitions to a "Your profile is now live!" success state with the shareable profile link.

### What the user will see

**Step 1 - Confirmation modal** (on clicking Publish):
- Title: "Publish Your Profile"
- Three bullet points:
  - A clean, shareable link for peer-to-peer introductions.
  - Searchable only within our vetted internal network.
  - No public "looking for work" signals.
- Two buttons: "Cancel" (outline) and "Confirm Publish" (primary teal)

**Step 2 - Success state** (after confirming):
- Checkmark icon with "Your profile is now live!" heading
- The public profile link displayed with a copy button
- A "Done" button to close the modal

### Technical Details

**New file: `src/components/edit-profile/PublishConfirmationModal.tsx`**
- A Dialog component using the existing Radix UI dialog primitive
- Two internal states: `confirming` and `success`
- Props: `open`, `onOpenChange`, `onConfirm` (async), `isUpdating`, `publicProfileUrl`
- On confirm, calls the publish mutation; on success, transitions to the "live" view
- Uses existing brand colors (#449889) and design system components

**Modified file: `src/components/edit-profile/StickyActionBar.tsx`**
- Import and render `PublishConfirmationModal`
- Add local `showPublishModal` state
- When "Publish" is clicked (and profile is not yet published), open the modal instead of calling `onPublishToggle` directly
- When profile is already published (Unpublish), keep the current direct behavior
- Pass `publicProfileUrl` as a new prop

**Modified file: `src/pages/EditProfile.tsx`**
- Pass `publicProfileUrl` to `StickyActionBar`

**Modified file: `src/components/dashboard/NextStepsCard.tsx`**
- Same pattern: open the modal when clicking "Publish Profile"
- Add local state and render `PublishConfirmationModal`
- Requires `publicProfileUrl` as a new prop

**Modified file: `src/pages/dashboard/Dashboard.tsx`**
- Pass `publicProfileUrl` (constructed from `profileSlug`) to `NextStepsCard`

**Modified file: `src/hooks/useEditProfile.ts`**
- `handlePublishToggle` will be split: unpublish stays as-is; publish logic will be reusable via `updatePublishStatus(true)` called from the modal's confirm handler

