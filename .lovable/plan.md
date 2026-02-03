

## Update Agreement Page with New Text and MSA Viewer

### Overview

This plan updates the Agreement page (`/dashboard/agreement`) with the latest text structure and adds functionality to view the Master Candidate Agreement. I'll present two options for displaying the MSA document.

---

### MSA Display Options

**Option A: Modal with Embedded PDF (Recommended)**
- Uses the existing Dialog component to open a large modal
- Embeds a PDF viewer using an iframe or native browser PDF rendering
- User stays on the same page and can easily close to continue
- Excellent mobile experience with full-screen modal
- Requires hosting the PDF file in `public/` folder

**Option B: External PDF Link (Current approach)**
- Opens PDF in a new browser tab
- Simplest implementation
- User leaves the current context temporarily
- Works well if the PDF is hosted externally (e.g., company website, Google Drive)

I recommend **Option A (Modal)** for a smoother user experience that keeps users engaged in the onboarding flow.

---

### Changes Summary

#### 1. Update Page Header
**File:** `src/pages/dashboard/Agreement.tsx`

- Change title: "Great — your profile is ready."
- Update subtitle: "To receive client names, client details, specific roles, and potential matches, please confirm how you will contract with us."

#### 2. Restructure ContractingTypeSection
**File:** `src/components/agreement/ContractingTypeSection.tsx`

- Rename section header: "Contracting Structure (required)"
- Change "As an individual" (keep as-is)
- Change "As personnel of an entity" to "Using an entity"
- Add new fields when entity is selected:
  - Entity name (existing)
  - Registration number / UEN (new field)
  - Registered address (new field)
- Consolidate the two separate checkboxes into a single confirmation with bullet points:
  - "I am duly authorised by the entity..."
  - "I will personally perform all services..."
  - Single checkbox: "I confirm and agree to the above."
- Add "View Master Candidate Agreement" link within this section

#### 3. Simplify TermsAcceptanceSection
**File:** `src/components/agreement/TermsAcceptanceSection.tsx`

- Change header: "Final Step — Acceptance of Terms"
- Change subtitle: "As a final step, please review and accept the full Master Candidate Agreement."
- Replace three separate checkboxes with a single checkbox:
  - "I have read and accept the Master Candidate Agreement (December 2025), including the confidentiality and 24-month non-circumvention obligations."
- Add "View Master Candidate Agreement" link

#### 4. Create MSA Modal Component (Option A)
**File:** `src/components/agreement/MSAModal.tsx` (new)

- Create a reusable modal component for viewing the MSA PDF
- Uses Dialog component with larger max-width (`max-w-4xl`)
- Contains an iframe to render the PDF
- Includes header with title and close button
- ScrollArea for content if PDF embedding isn't available

#### 5. Update Agreement Page State
**File:** `src/pages/dashboard/Agreement.tsx`

- Simplify state management:
  - Remove separate `agreeConfidentiality`, `agreeNonCircumvention`, `agreeFullAgreement`
  - Add single `acceptFullAgreement` boolean
  - Add `entityConfirmed` boolean for the entity confirmation checkbox
  - Add `registrationNumber` and `registeredAddress` strings for new entity fields
- Add modal open state for MSA viewer
- Update validation logic

---

### Technical Details

#### New Entity Fields Schema
```text
entityName: string
registrationNumber: string (UEN, CIN, or local company registration)
registeredAddress: string
entityConfirmed: boolean (single checkbox for both confirmations)
```

#### State Structure Changes
```text
Current:
- agreeConfidentiality, agreeNonCircumvention, agreeFullAgreement (3 booleans)
- isAuthorized, isDesignatedPerson (2 booleans for entity)

New:
- acceptFullAgreement (1 boolean for final acceptance)
- entityConfirmed (1 boolean for entity authorization)
```

#### MSA Modal Implementation
```text
Dialog
  DialogContent (max-w-4xl, h-[80vh])
    DialogHeader
      DialogTitle: "Master Candidate Agreement"
      DialogDescription: "December 2025"
    ScrollArea or iframe
      PDF content
    DialogFooter
      Close button
```

#### PDF Hosting
- PDF file should be placed in `public/documents/master-candidate-agreement.pdf`
- Alternative: Use an external URL if the PDF is hosted elsewhere
- For iframe embedding: `<iframe src="/documents/master-candidate-agreement.pdf" />`

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/dashboard/Agreement.tsx` | Modify - Update header, state, add modal |
| `src/components/agreement/ContractingTypeSection.tsx` | Modify - Add new fields, restructure |
| `src/components/agreement/TermsAcceptanceSection.tsx` | Modify - Simplify to single checkbox |
| `src/components/agreement/MSAModal.tsx` | Create - New modal component |

---

### Visual Preview

**Contracting Structure section:**
```text
Contracting Structure (required)

○ As an individual

○ Using an entity
    Entity name: [________________]
    Registration number / UEN: [________________]
    Registered address: [________________]
    
    If contracting through an entity
    I agree and warrant that:
    • I am duly authorised by the entity...
    • I will personally perform all services...
    
    ☐ I confirm and agree to the above.
    
    [View Master Candidate Agreement →]
```

**Final Step section:**
```text
Final Step — Acceptance of Terms

As a final step, please review and accept the full 
Master Candidate Agreement.

☐ I have read and accept the Master Candidate Agreement 
   (December 2025), including the confidentiality and 
   24-month non-circumvention obligations.

[View Master Candidate Agreement →]
```

