

## Add Preferred Contact Email and Mobile Number Fields

### Overview
Add a new "Contact Details" section to the Agreement page where users provide their preferred contact email and mobile number (with country code selection). This section will sit between the Contracting Structure and the Terms Acceptance sections.

### New Component: `ContactDetailsSection`

Create `src/components/agreement/ContactDetailsSection.tsx` with:

- **Preferred Contact Email**: A text input pre-filled with the user's auth email (editable if they prefer a different contact address)
- **Mobile Number with Country Code**: Two fields side by side:
  - A country code selector (using the existing `countries` table which has `alpha2_code` and `country_code` columns) displayed as a searchable select dropdown showing the flag/code (e.g., "+1", "+44", "+65")
  - A phone number text input

The section will be styled consistently with the existing `ContractingTypeSection` -- same `bg-muted/50 border border-border rounded-xl p-5 sm:p-6` wrapper, same label and input styling.

### Database Change

Add two new columns to the `profiles` table:
- `preferred_contact_email` (text, nullable)
- `mobile_country_code` (text, nullable) -- stores the dial code e.g. "+65"
- `mobile_number` (text, nullable) -- stores the number without country code

No new RLS policies needed since the existing `profiles` ALL policy already covers user read/write on their own row.

### Changes to `Agreement.tsx`

- Add state for `contactEmail`, `mobileCountryCode`, and `mobileNumber`
- Pre-fill `contactEmail` from the user's auth email via `useGetUser`
- Add `ContactDetailsSection` between `ContractingTypeSection` and `TermsAcceptanceSection`
- Add validation: both email and mobile number are required; email must be valid format
- Include contact details in the submit payload

### Country Code Selector

The selector will query the `countries` table (already has `country_code` and `alpha2_code`) and display options like:
- "US +1"
- "GB +44"
- "SG +65"

It will use the existing `useCountries` hook from `src/queries/useCountries.ts` and render via a searchable Select/Combobox component.

### Technical Details

| File | Change |
|------|--------|
| **Migration SQL** | Add `preferred_contact_email`, `mobile_country_code`, `mobile_number` columns to `profiles` |
| **`src/components/agreement/ContactDetailsSection.tsx`** | New component with email input, country code select, and phone input |
| **`src/pages/dashboard/Agreement.tsx`** | Add state, validation, and render the new section |

### Validation Rules
- Email: required, valid email format
- Country code: required (must select one)
- Mobile number: required, digits only, 6-15 characters

