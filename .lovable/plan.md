

# Highlight Incomplete Sections When "Accept All" Button is Clicked

## Problem
When the "Accept All & Get Engagement-Ready" button is disabled and clicked (or when submitting with incomplete data), there's no visual indication of which sections need attention. Users are left guessing what's missing.

## Solution
When the user clicks the submit button and validation fails, scroll to and highlight the first incomplete section with a red border and inline error message. Each section card will get a visual error state showing what's missing.

## Changes

### 1. `src/pages/dashboard/Agreement.tsx`
- Add a `submitted` (or `attemptedSubmit`) state that flips to `true` when the button is clicked regardless of validity
- Compute per-section validity: `isPersonalDetailsValid`, `isContractingValid`, `isTermsValid`
- Pass `showErrors` prop (based on `attemptedSubmit`) to each section component
- On failed submit, scroll to the first invalid section using refs
- Change the button to always be clickable (remove `disabled` when not submitting) so users can trigger validation feedback

### 2. `src/components/agreement/ContactDetailsSection.tsx`
- Accept a `showErrors` prop
- When `showErrors` is true and required fields are empty, add a red border to the section card (`border-destructive`) and show a small error message like "Please complete all required fields"

### 3. `src/components/agreement/ContractingTypeSection.tsx`
- Accept a `showErrors` prop
- When `showErrors` is true and no contracting type is selected (or entity fields are incomplete), add red border and error message

### 4. `src/components/agreement/TermsAcceptanceSection.tsx`
- Accept a `showErrors` prop
- When `showErrors` is true and the checkbox is unchecked, add red border and error message like "Please accept the Candidate Agreement to continue"

## Technical Details

- A new `attemptedSubmit` boolean state in `Agreement.tsx` controls error display
- Each section wrapper `div` conditionally applies `border-destructive` class when invalid and `attemptedSubmit` is true
- A small red text message appears below each section header when invalid
- `useRef` on each section enables `scrollIntoView({ behavior: 'smooth' })` to the first failing section
- The submit button remains enabled (only disabled during actual submission) so clicks always trigger validation feedback
- Existing per-field errors (email, phone) continue to work alongside section-level highlighting

