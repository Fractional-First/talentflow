
## Toggle "Accept Agreement" to "View Agreement" After Completion

Use `localStorage` to persist agreement completion status (consistent with the demo-phase pattern already used in the codebase), and update the NextStepsCard to reflect the completed state.

### Changes

**1. `src/pages/dashboard/Agreement.tsx`**
- After successful submission (inside `handleSubmit`, after `setIsSubmitted(true)`), save to localStorage: `localStorage.setItem("agreement_accepted", "true")`
- On mount, check localStorage -- if already accepted, immediately show the success state (`setIsSubmitted(true)`)

**2. `src/components/dashboard/NextStepsCard.tsx`**
- Read `localStorage.getItem("agreement_accepted")` to determine state
- When accepted:
  - Button text changes from "Accept Agreement" to "View Agreement"
  - Description updates to "You're engagement-ready. View your accepted agreement."
  - Remove the "New" badge
- Navigation still goes to `/dashboard/agreement` (where they see the success state)

**3. Fix existing build error in `src/components/ui/dialog.tsx`**
- The `DialogDescription` forwardRef is returning `void` instead of JSX. Restore the missing return statement to fix the TS error.

### Technical Details

```text
NextStepsCard
  |-- reads localStorage("agreement_accepted")
  |-- if "true": show "View Agreement" button + updated copy
  |-- else: show "Accept Agreement" button + "New" badge

Agreement page
  |-- on mount: check localStorage, if accepted -> show success view
  |-- on submit: set localStorage("agreement_accepted", "true")
```
