

## Move "Open Preview" Next to "Back to Dashboard" in Header

Remove the preview banner entirely from `EditProfile.tsx` and move the "Open Preview" button into the `DashboardLayout.tsx` header, beside the existing "Back to Dashboard" button.

### Changes

**`src/components/DashboardLayout.tsx`**
- Add optional `headerActions` prop (`ReactNode`) to the component interface
- Render `headerActions` inside the right-side `div` (alongside "Back to Dashboard")

**`src/pages/EditProfile.tsx`**
- Remove the entire preview banner block (lines 82–110)
- Pass an "Open Preview" button as `headerActions` prop to `DashboardLayout`, using the same `Eye` icon + outline small button style
- The button links to `/profile/preview/${user.id}` in a new tab

This keeps the header clean with both navigation actions grouped together.

