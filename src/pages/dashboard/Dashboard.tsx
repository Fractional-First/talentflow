import { AppSidebar } from "@/components/AppSidebar"
import { JobPreferencesPlaceholder } from "@/components/dashboard/JobPreferencesPlaceholder"
import { NextStepsCard } from "@/components/dashboard/NextStepsCard"
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner"
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { useEditProfile } from "@/hooks/useEditProfile"
import { useProfileData } from "@/queries/useProfileData"
import { useWorkPreferences } from "@/queries/useWorkPreferences"
import { useGetUser } from "@/queries/auth/useGetUser"
import { toast } from "sonner"

// Dashboard main content with sidebar navigation
const Dashboard = () => {
  const {
    onboardingStatus,
    isLoading,
    profileSlug,
    isPublished,
    updatePublishStatus,
    isUpdatingPublishStatus,
  } = useEditProfile()
  const { data: profile, isLoading: profileLoading, error } = useProfileData()
  const { workPreferences, isLoading: workPrefsLoading } = useWorkPreferences()
  const isOnboarding = onboardingStatus === "PROFILE_CONFIRMED"
  const hasJobPreferences =
    workPreferences && Object.keys(workPreferences).length > 0

  const handleShareProfile = async () => {
    // Generate public profile URL using the profile slug
    const profileUrl = `${window.location.origin}/profile/${profileSlug}`

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success("Profile link copied!", {
        description: "Share it with your network to increase visibility.",
        duration: 3000,
        position: "top-left",
        style: {
          marginTop: "320px",
          marginLeft: "32px",
          maxWidth: "300px",
        },
      })
    } catch (error) {
      toast.error("Failed to copy link", {
        description: "Please copy the link manually.",
        duration: 3000,
        position: "top-left",
        style: {
          marginTop: "320px",
          marginLeft: "32px",
          maxWidth: "300px",
        },
      })
    }
  }

  const handlePublishProfile = async () => {
    await updatePublishStatus(true)
  }

  const publicProfileUrl = profileSlug
    ? `${window.location.origin}/profile/${profileSlug}`
    : ""

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
      <div className="min-h-screen flex w-full">
        <AppSidebar isOnboarding={isOnboarding} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900">
                Your Dashboard
              </h1>
            </div>
          </header>
          <div className="flex-1">
            {isOnboarding && <OnboardingBanner />}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
              {/* Show Next Steps card when onboarding is complete AND job preferences are submitted */}
              {!isOnboarding && hasJobPreferences && (
                <div className="mb-8">
                  <NextStepsCard
                    onShareProfile={handleShareProfile}
                    onPublishProfile={handlePublishProfile}
                    isPublished={isPublished}
                    isUpdatingPublishStatus={isUpdatingPublishStatus}
                    publicProfileUrl={publicProfileUrl}
                    firstName={profile?.name?.split(" ")[0]}
                  />
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left column - Read-only profile summary */}
                <div className="space-y-6">
                  <div>
                    <ProfileSummaryCard profile={profile} />
                  </div>
                </div>
                {/* Right column - Job preferences placeholder */}
                <div className="space-y-6">
                  <JobPreferencesPlaceholder isCompleted={!isOnboarding} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
