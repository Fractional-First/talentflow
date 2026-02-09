

## Diagram Polish: Compact Steps, Title Fix, and Readable Text

### 1. Make SharedStepCard compact on desktop (icon to the left)

Change the `SharedStepCard` layout so on `sm:` and above, the icon sits to the left of the text in a horizontal row, rather than stacked vertically. On mobile it stays stacked.

- Add `sm:flex-row sm:text-left` to the card container
- Move the icon out of center and align it left on desktop
- Keep the step label badge, title, and subtitle grouped to the right of the icon

### 2. Reinstate original Path A title text

Change Path A title from `"Engaged via FF"` to `"Engaged via FF (Fractional/Interim)"` to restore the full descriptive label.

### 3. Increase grey description text size

All `text-[10px]` and `text-[9px]` instances for description/subtitle/bullet text are too small. Bump them up:

- Subtitles in SharedStepCard: `text-[10px]` to `text-xs` (12px)
- "Then one of two paths:" label: `text-[10px]` to `text-xs`
- Bullet points in PathCard: `text-[10px]` to `text-xs`
- Step subtitles: `text-[10px]` to `text-xs`
- Conversion flexibility subtitle: `text-[9px]` to `text-[11px]`
- Step labels remain small as badges (`text-[10px]`) since they are decorative

### Technical Details

All changes in `src/components/agreement/ContractualRoadmap.tsx`:

**SharedStepCard** -- change the outer div from vertical-only to responsive:
- Current: `flex flex-col justify-center text-center`
- New: `flex flex-col sm:flex-row sm:items-center sm:text-left justify-center text-center`
- Icon container: remove `mx-auto` on desktop, keep it on mobile
- Constrain max-width slightly wider to accommodate horizontal layout

**PathCard title** (line 145): `"Engaged via FF"` to `"Engaged via FF (Fractional/Interim)"`

**Font sizes** -- update across SharedStepCard, PathCard bullets, Step subtitle, and conversion connector text from `text-[10px]`/`text-[9px]` to `text-xs`/`text-[11px]`.

