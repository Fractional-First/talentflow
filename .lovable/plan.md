

## Restructure "How We Work" Diagram: Top-Down with Side-by-Side Paths

The diagram will be restructured from its current left-to-right layout to a **top-down flow** on both desktop and mobile. Path A and Path B will sit **side by side** so the "Conversion Flexibility" arrows between them make intuitive visual sense.

### New Layout (both desktop and mobile)

```text
+------------------------------------+
|        How We Work                 |
+------------------------------------+
|                                    |
|   [Step 1: Sign Master Agreement]  |
|              |                     |
|              v                     |
|   [Step 2: Match with Client]      |
|              |                     |
|              v                     |
|   "Then one of two paths:"        |
|              |                     |
|   +----------+----------+         |
|   |  Path A  | <------> |  Path B |
|   | Engaged  | Conversion| Direct |
|   | via FF   | Flexibility| Hire  |
|   |          |           |        |
|   | SOW ->   |           | Offer->|
|   | Start    |           | Start  |
|   | Work     |           | Work   |
|   |          |           |        |
|   | bullets  |           | bullets|
|   +----------+-----------+--------+
+------------------------------------+
```

### Changes in `src/components/agreement/ContractualRoadmap.tsx`

1. **Remove the separate desktop/mobile layouts** -- use a single unified top-down layout that works for both (the mobile layout is already close to what we want).

2. **Shared steps flow vertically** at the top, centered:
   - Step 1 card -> arrow down -> Step 2 card -> arrow down -> "Then one of two paths:"

3. **Path A and Path B side by side** in a two-column grid (`grid grid-cols-2 gap-3` on desktop, `grid grid-cols-1` on mobile as fallback).

4. **Conversion Flexibility connector** sits between the two path cards:
   - On desktop (side-by-side): rendered as a horizontal `ArrowLeftRight` label centered between the two columns
   - On mobile (stacked): remains as the current vertical connector between Path A and Path B

5. **PathSteps inside each path** always render vertically (top-down) since the cards are narrower now.

### Technical Details

- Replace the `!isMobile` and `isMobile` conditional blocks with a single layout
- Use `grid grid-cols-1 sm:grid-cols-2 gap-3` for the paths container
- The conversion flexibility label on desktop will be absolutely positioned or placed as a centered overlay between the two grid columns
- On mobile (`grid-cols-1`), the conversion flexibility connector sits as a row between Path A and Path B (same as current mobile behavior)
- `PathSteps` will always use vertical (`flex-col`) direction since the path cards are narrower in the side-by-side layout

