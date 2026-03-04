

## Add Sidebar Navigation to Job Preferences Page

The WorkPreferences page currently uses `DashboardLayout` (which has a top header, not a sidebar). The Settings page already uses the sidebar pattern with `SidebarProvider`, `AppSidebar`, and `SidebarInset`. We'll follow the same pattern.

### Changes

**`src/pages/WorkPreferences.tsx`**
- Replace `DashboardLayout` wrapper with the `SidebarProvider` + `AppSidebar` + `SidebarInset` pattern (matching Settings page)
- Add a header with `SidebarTrigger`, page title "Job Preferences", and subtitle
- Move the existing page content into the `SidebarInset` main area
- Keep all existing logic (form state, steps, loading/error states) unchanged

