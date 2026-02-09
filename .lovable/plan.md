

## Make Step 1 and Step 2 More Compact on Desktop

### Changes

**Replace the icon circle with the step label** on desktop so the round badge doubles as the icon area, keeping things compact and fitting everything on one line.

**Stretch the boxes** by removing `max-w-[320px]` on desktop so they can expand to fit the full sentence on a single line.

### Details (in `src/components/agreement/ContractualRoadmap.tsx`)

**SharedStepCard component updates:**

1. **Remove `max-w-[320px]`** -- replace with `max-w-[320px] sm:max-w-none` so the card stretches on desktop.

2. **Replace the icon with the step label on desktop** -- Instead of showing the icon in a circle and the step label as a separate badge, combine them: on desktop, the round circle shows "Step 1" / "Step 2" text instead of the icon. On mobile, keep the icon with the label below it.
   - The circle will contain `stepLabel` text (`text-[10px] font-bold`) on `sm:` and the icon on mobile.
   - Hide the separate step label badge on desktop (`sm:hidden`).

3. **Single-line title + subtitle on desktop** -- change the text container to `sm:flex-row sm:items-center sm:gap-2` so the bold title and grey subtitle sit on the same line.

Result: each shared step becomes a single compact horizontal row on desktop -- a small "Step 1" circle on the left, then "Sign Master Agreement with FF -- One-time signature for all future engagements" all on one line.

