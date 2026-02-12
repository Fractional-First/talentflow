

## Split Registered Address into Individual Fields

Replace the single "Registered address" textarea with structured address fields for better data quality.

### New Fields

1. **Address Line 1** -- Street address (required)
2. **Address Line 2** -- Suite, unit, floor (optional)
3. **City** -- City/town (required)
4. **State / Province** -- State or region (optional)
5. **Postal Code** -- ZIP/postal code (required)
6. **Country** -- Country name (required)

### Technical Changes

**`src/components/agreement/ContractingTypeSection.tsx`**
- Replace the single `registeredAddress` string prop with an object type: `{ addressLine1, addressLine2, city, stateProvince, postalCode, country }`
- Replace the `Textarea` with 6 `Input` fields, laid out with City/State side-by-side and Postal Code/Country side-by-side on larger screens
- Update the props interface accordingly (`onRegisteredAddressChange` will pass the full object)

**`src/pages/dashboard/Agreement.tsx`**
- Replace the `registeredAddress` string state with an object state containing all 6 fields
- Update validation in `isContractingValid()` to check that required fields (addressLine1, city, postalCode, country) are filled
- Pass the new object and setter to `ContractingTypeSection`

