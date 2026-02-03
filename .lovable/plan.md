

## Create Contractual Roadmap Component

### Overview

This plan adds a visual "Contractual Roadmap" flowchart to the Agreement page that helps candidates understand the legal relationship between themselves, Fractional First (FF), and Clients. The component will be responsive with a horizontal flow on desktop and vertical stepper on mobile.

---

### Visual Design

```text
DESKTOP LAYOUT (Horizontal Flow):

┌─────────────────────────────────────────────────────────────────────────────────┐
│  How Your Contractual Relationship Works                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                          ┌─ Path A (Blue) ──────────────────────────────────┐   │
│                          │  "Engaged via FF (Fractional/Interim)"           │   │
│    ┌────────────┐        │   ┌──────────┐    ┌──────────┐    ┌──────────┐   │   │
│    │    1. ℹ️    │ ──────→│   │  Match   │───→│ FF Issues│───→│  Start   │   │   │
│    │   Sign     │        │   │  with    │    │   SOW    │    │  Work    │   │   │
│    │   Master   │        │   │  Client  │    │          │    │          │   │   │
│    │ Agreement  │        └───┴──────────┴────┴──────────┴────┴──────────┴───┘   │
│    │  with FF   │                                                               │
│    │            │        ┌─ Path B (Green) ─────────────────────────────────┐   │
│    │  (Legal    │ ──────→│  "Direct-Hire"                                   │   │
│    │Foundation) │        │   ┌──────────┐    ┌──────────┐    ┌──────────┐   │   │
│    └────────────┘        │   │  Match   │───→│  Client  │───→│  Start   │   │   │
│                          │   │  with    │    │  Issues  │    │  Work    │   │   │
│                          │   │  Client  │    │  Offer   │    │          │   │   │
│                          └───┴──────────┴────┴──────────┴────┴──────────┴───┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

MOBILE LAYOUT (Vertical Stepper):

┌─────────────────────────┐
│ How Your Contractual    │
│ Relationship Works      │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │  1. Sign Master   │  │
│  │  Agreement with   │  │
│  │  FF (ℹ️ tooltip)  │  │
│  │                   │  │
│  │ The Legal         │  │
│  │ Foundation        │  │
│  └─────────┬─────────┘  │
│            │            │
│      ┌─────┴─────┐      │
│      ▼           ▼      │
│  ┌────────┐ ┌────────┐  │
│  │Path A  │ │Path B  │  │
│  │(Blue)  │ │(Green) │  │
│  │Engaged │ │Direct- │  │
│  │via FF  │ │Hire    │  │
│  └───┬────┘ └───┬────┘  │
│      │          │       │
│  (vertical steps continue)
└─────────────────────────┘
```

---

### Component Structure

**New File:** `src/components/agreement/ContractualRoadmap.tsx`

The component will contain:

1. **Header Section**
   - Title: "How Your Contractual Relationship Works"
   - Optional subtitle for context

2. **Primary Step Card**
   - Step 1: "Sign Master Agreement with FF"
   - Subtitle: "The Legal Foundation"
   - Info tooltip icon with text: "This is a one-time signature that covers all future engagements with Fractional First"

3. **Branching Paths Container**
   - Uses CSS Grid for desktop (2 columns) and Flexbox for mobile (stacked)

4. **Path A Card (Blue Theme)**
   - Header: "Engaged via FF (Fractional/Interim)"
   - Step indicators with icons and arrows
   - Steps: Match → SOW Issued → Start Work
   - Summary text: "No additional client paperwork needed"

5. **Path B Card (Green Theme)**
   - Header: "Direct-Hire"
   - Step indicators with icons and arrows
   - Steps: Match → Client Offer → Start Work
   - Summary text: "Directly hired via Client's own contract"

---

### Technical Implementation

**Icons Used (lucide-react):**
- `FileSignature` - Master Agreement step
- `Users` - Client Match step
- `FileText` - SOW/Offer step
- `Briefcase` - Start Work step
- `Info` - Tooltip trigger
- `ArrowRight` - Horizontal connectors (desktop)
- `ArrowDown` - Vertical connectors (mobile)
- `ChevronRight` - Path arrow indicators

**Color Scheme:**
- Primary step: Uses existing `bg-primary/10` and `text-primary` (Teal #449889)
- Path A (Blue): `bg-blue-50`, `border-blue-200`, `text-blue-700`
- Path B (Green): `bg-emerald-50`, `border-emerald-200`, `text-emerald-700`

**Responsive Breakpoints:**
- Mobile (< 768px): Vertical stepper layout
- Desktop (>= 768px): Horizontal flow with branching paths

**Tooltip Implementation:**
- Uses existing `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` from `@/components/ui/tooltip`

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/agreement/ContractualRoadmap.tsx` | Create - New roadmap component |
| `src/pages/dashboard/Agreement.tsx` | Modify - Add roadmap after header |

---

### Integration with Agreement Page

The roadmap will be placed between the header section and the Contracting Type Section, providing immediate context before users fill out the form.

```text
Agreement Page Structure:
1. Back button
2. Header ("Great — your profile is ready.")
3. NEW: ContractualRoadmap component    ← Insert here
4. ContractingTypeSection
5. TermsAcceptanceSection
6. Submit button
```

---

### Accessibility Considerations

- All icons have appropriate `aria-label` attributes
- Tooltip content is accessible via keyboard focus
- Color contrast meets WCAG AA standards
- Step numbers provide clear visual hierarchy
- Path labels clearly distinguish the two options

