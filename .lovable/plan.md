

## Preview Banner — Tone It Down

The current banner uses a bold `bg-gradient-to-r from-teal-600 to-teal-500` with white text, making it visually compete with the page content. Here are three options:

### Option A: Subtle info bar (recommended)
- Light gray background (`bg-muted`) with standard text color
- Small `Eye` icon inline with the message
- "Open Preview" as a text link or small outline button
- Single horizontal row, compact padding (`py-2 px-4`)

### Option B: Soft teal tint
- Very light teal background (`bg-teal-50 border border-teal-200`)
- Teal-colored text instead of white (`text-teal-700`)
- Keeps brand association but much less loud

### Option C: Inline callout card
- Use the existing `Alert` component with a default variant
- Icon + text + link, blends into the page like a tip rather than a banner

All three reduce visual weight while keeping the CTA accessible. I'd recommend **Option A** for the cleanest result — it feels informational rather than promotional.

### Technical change (Option A)
**`src/pages/EditProfile.tsx`** (~lines 84-105):
- Replace gradient background with `bg-muted border-b border-border`
- Change text to `text-foreground` with smaller font (`text-sm font-medium`)
- Add `Eye` icon from lucide-react before the text
- Change button to `variant="outline" size="sm"`
- Reduce padding to `py-2`

