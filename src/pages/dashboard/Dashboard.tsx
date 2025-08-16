

import { AppSidebar } from "@/components/AppSidebar"
import { JobPreferencesPlaceholder } from "@/components/dashboard/JobPreferencesPlaceholder"
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner"
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard"
import { DashboardLayout } from "@/components/DashboardLayout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { useEditProfile } from "@/queries/useEditProfile"
import { useProfileData } from "@/queries/useProfileData"

// Dashboard main content with sidebar navigation
const Dashboard = () => {
  const { onboardingStatus, isLoading } = useEditProfile()
  const { data: profile, isLoading: profileLoading, error } = useProfileData()
  const isOnboarding = onboardingStatus === "PROFILE_CONFIRMED"

  // For now, we'll assume job preferences are not completed
  // This could be enhanced with actual completion status from the backend
  const jobPreferencesCompleted = false

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading profile</div>
          <div className="text-sm text-gray-600">Error: {error.message}</div>
        </div>
      </div>
    )
  }

  // Fallback if no onboarding status is available
  if (!onboardingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No onboarding status available</div>
      </div>
    )
  }

  // Fallback if no profile data is available
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No profile data available</div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <DashboardLayout sidebar>
        {/* Sidebar left */}
        <div className="hidden md:flex flex-col h-full min-h-screen border-r border-border/30 bg-background/90 shadow-md">
          <AppSidebar isOnboarding={isOnboarding} />
        </div>
        {/* Main right content */}
        <div className="flex-1 flex flex-col">
          {onboardingStatus === "PROFILE_CONFIRMED" && <OnboardingBanner />}
          <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {/* Two columns with equal height cards */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left column - Read-only profile summary */}
              <div className="h-full">
                <ProfileSummaryCard profile={profile} className="h-full" />
              </div>
              {/* Right column - Job preferences placeholder */}
              <div className="h-full">
                <JobPreferencesPlaceholder isCompleted={jobPreferencesCompleted} />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  )
}

export default Dashboard

