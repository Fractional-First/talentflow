

## Agreement Page Updates

### 1. Rename Diagram Title
**File:** `src/components/agreement/ContractualRoadmap.tsx`
- "How Your Contractual Relationship Works" → **"How We Work"**

### 2. Add Step 2: "Match with Client" as a Shared Step
Currently "Match with Client" is duplicated inside both Path A and Path B. It will be extracted into its own **Step 2** box between Step 1 and the path split, matching the visual style of Step 1.

- Remove "Match with Client" from both `pathASteps` and `pathBSteps`
- Add a new Step 2 card (same style as Step 1) labeled "Match with Client" with subtitle "We connect you with the right opportunity"
- Arrow flows: Step 1 → Step 2 → then splits into Path A / Path B
- On mobile: vertical stack with arrows down between steps

### 3. Add "Conversion Flexibility" Link Between Paths
A styled label/connector between Path A and Path B cards:
- A small badge or annotation between the two path cards reading **"Conversion Flexibility"** with subtitle "(upon mutual agreement)"
- Visually: a double-headed arrow or connecting element between the two paths
- Uses the existing `ArrowRight` or a `RefreshCw`/`ArrowLeftRight` icon for visual clarity

### 4. Add Clarifying Bullet Points to Each Path

**Path A -- Engaged via FF (Fractional/Interim):**
Replace the single checkmark line with:
- "Fractional First acts as your administrative partner."
- "We handle all contracting, invoicing, and cross-border payments so you can focus on leadership impact."

**Path B -- Direct-Hire:**
Replace the single checkmark line with:
- "Direct alignment between you and the client."
- "Full-time integration into the leadership team from Day 1."

### 5. Add Descriptors to Contracting Structure Options
**File:** `src/components/agreement/ContractingTypeSection.tsx`

**"As an individual" option:**
- Add a **(Preferred)** badge next to the label
- Add descriptor text below: *"This is the most streamlined path for rapid deployment and simplified tax compliance across our global hubs."*

**"Using an entity" option:**
- Add descriptor text below: *"Select this if you manage your professional engagements through an existing corporate structure or personal service company."*

---

### Technical Details

**ContractualRoadmap.tsx changes:**
- New flow structure: Step 1 → arrow → Step 2 → arrow → split into Path A / Path B
- Import `ArrowLeftRight` from lucide-react for the conversion flexibility connector
- Path steps arrays reduced to 2 items each (SOW/Offer → Start Work)
- Bullet points rendered as left-aligned `text-[10px]` list items within each path card
- Desktop: horizontal layout with Step 1 and Step 2 on the left, paths stacked on the right
- Mobile: vertical stack -- Step 1, arrow, Step 2, arrow, "Then one of two paths:", Path A, conversion connector, Path B

**ContractingTypeSection.tsx changes:**
- Add a `Badge` or styled span with "Preferred" next to the individual radio label
- Add `<p>` descriptor text below each radio option within the existing card containers
