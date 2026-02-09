

## Polish SharedStepCard: Wider Desktop Cards with Compact Step Labels

### Changes in `src/components/agreement/ContractualRoadmap.tsx`

### 1. Stretch Step 1 and Step 2 cards on desktop
- Remove `max-w-[320px]` from `SharedStepCard` and replace with `sm:max-w-none` so cards stretch to fill the available width on desktop
- Keep them constrained on mobile with `max-w-[320px]` only below `sm:`

### 2. Move step label badge next to the icon
Instead of the step label ("Step 1", "Step 2") sitting above the title text, move it inside/next to the icon circle area to keep things compact:
- On desktop (horizontal layout): render the step label badge to the left of or overlapping the icon, then title and subtitle to the right
- On mobile (stacked layout): step label sits just below the icon, above the title

Specifically, restructure the `SharedStepCard` inner layout so:
- The icon and step label are grouped together (icon on top, badge below on mobile; icon left, badge overlaid or beside icon on desktop)
- Title and subtitle remain to the right on desktop

### Technical Details

**SharedStepCard component updates (lines 29-54):**

- Change container: `max-w-[320px]` to `max-w-[320px] sm:max-w-none`
- Restructure the icon area to include the step label badge:
  - Wrap icon + badge in a `flex flex-col items-center shrink-0` container
  - Move the `stepLabel` span from the text area into this icon group
  - On desktop the badge sits directly under the icon; on mobile same
- The text area (`title` + `subtitle`) no longer contains the step label badge, keeping it cleaner and more compact

