

## Add "New" Tag to Get Engagement-Ready Card

A small visual addition to highlight the "Get Engagement-Ready" action as a new feature on the dashboard's NextStepsCard.

### What Changes

In `src/components/dashboard/NextStepsCard.tsx`, add a "New" badge next to the "Get Engagement-Ready" heading. The project already has a `Badge` component (`src/components/ui/badge.tsx`) that will be reused.

### Technical Details

1. **File: `src/components/dashboard/NextStepsCard.tsx`**
   - Import the `Badge` component from `@/components/ui/badge`
   - Next to the `<h3>` text "Get Engagement-Ready", add a `<Badge>` with text "New" using a fitting variant (e.g., `default` for the teal primary color, matching the Fractional First brand)
   - The badge will sit inline with the heading text using a flex layout

