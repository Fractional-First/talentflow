
# Sticky Bottom Action Bar for Edit Profile

## Overview
Transform the "Regenerate Profile", "Publish", and "Save & Go to Dashboard" buttons into a sticky navbar that stays fixed at the bottom of the viewport. This will ensure users always have access to these key actions while editing their profile.

## Current State
- Action buttons are positioned at the bottom of the scrollable content inside the main content area
- Users must scroll to the bottom of the page to access these actions
- The Publish button has a tooltip explaining what it does, but the explanation is hidden

## Changes to Implement

### 1. Create a New Sticky Action Bar Component
**File:** `src/components/edit-profile/StickyActionBar.tsx`

A new component that will:
- Be fixed to the bottom of the viewport (`fixed bottom-0 left-0 right-0`)
- Have a white/light background with subtle top border and shadow for visual separation
- Include the publish explanation text prominently displayed near the Publish button
- Contain all three action buttons: Regenerate Profile, Publish, Save & Go to Dashboard
- Be responsive for mobile and desktop views

### 2. Update EditProfile.tsx
**File:** `src/pages/EditProfile.tsx`

Changes:
- Remove the current inline action buttons section (lines 504-535)
- Add the new `StickyActionBar` component outside the scrollable content area
- Add bottom padding to the main content area to prevent content from being hidden behind the sticky bar

### 3. Update DashboardLayout.tsx
**File:** `src/components/DashboardLayout.tsx`

Changes:
- Add bottom padding to account for the sticky action bar when on the edit-profile page
- Ensure the footer doesn't overlap with the sticky bar

## Design Details

### Sticky Bar Layout
```
┌────────────────────────────────────────────────────────────────────┐
│  [← Regenerate Profile]      [Publish Info] [Publish] [Save →]    │
└────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────────────────┐
│  Publishing makes your profile   │
│  visible for networking...       │
├──────────────────────────────────┤
│  [← Regenerate]                  │
│  [Publish]  [Save & Go →]        │
└──────────────────────────────────┘
```

### Publish Explanation Text
The text "Publishing makes your profile visible for networking. This does not change your status to 'looking for work' or opt you into active placement services." will be displayed as a small info text near the Publish button.

## Technical Details

### StickyActionBar Component Props
- `isPublished: boolean` - Current publish status
- `isUpdatingPublishStatus: boolean` - Loading state for publish action
- `isSubmitting: boolean` - Loading state for save action
- `onRegenerateProfile: () => void` - Navigate to create-profile
- `onPublishToggle: () => void` - Toggle publish status
- `onSaveAndContinue: () => void` - Save and navigate to dashboard

### Styling
- Background: `bg-white/95 backdrop-blur-sm` for subtle transparency
- Border: `border-t border-gray-200`
- Shadow: `shadow-lg` for elevation
- Z-index: `z-50` to stay above all content
- Padding: `py-4 px-4 sm:px-6`

### Accessibility
- Proper ARIA labels for all buttons
- Keyboard navigation support
- Focus states for interactive elements

