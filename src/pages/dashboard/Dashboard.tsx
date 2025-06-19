import { AppSidebar } from "@/components/AppSidebar"
import { JobPreferencesCard } from "@/components/dashboard/JobPreferencesCard"
import { JobPreferencesPlaceholder } from "@/components/dashboard/JobPreferencesPlaceholder"
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner"
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard"
import { DashboardLayout } from "@/components/DashboardLayout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { useProfileSnapshot } from "@/queries/useProfileSnapshot"
import { useProfileData } from "@/queries/useProfileData"

// Dashboard main content with sidebar navigation
const Dashboard = () => {
  const { onboardingStatus, isLoading } = useProfileSnapshot()
  const { data: profile, isLoading: profileLoading, error } = useProfileData()
  const isOnboarding = onboardingStatus === "PROFILE_CONFIRMED"


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (profileLoading) {
    return <div>Loading profile...</div>
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
            {/* {isOnboarding ? ( */}
              {/* // Onboarding layout - two columns */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left column - Read-only profile summary */}
                <div className="space-y-6">
                  <div>
                    <ProfileSummaryCard profile={profile} />
                  </div>
                </div>
                {/* Right column - Job preferences placeholder */}
                <div className="space-y-6">
                  <JobPreferencesPlaceholder />
                </div>
              </div>
            {/* // ) : (
            //   // Regular dashboard layout
            //   <div className="flex flex-col gap-8">
            //     <div className="animate-pulse-soft rounded border-2 border-primary/30 shadow-lg">
            //       <ProfileSummaryCard profile={profile} />
            //     </div>
            //     <div className="animate-pulse-soft rounded border-2 border-secondary/30 shadow-lg">
            //       <JobPreferencesCard />
            //     </div>
            //   </div>
            // )} */}
          </div>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  )
}

export default Dashboard
