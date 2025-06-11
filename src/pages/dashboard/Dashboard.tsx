import { AppSidebar } from "@/components/AppSidebar"
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard"
import { JobPreferencesCard } from "@/components/dashboard/JobPreferencesCard"
import { DashboardLayout } from "@/components/DashboardLayout"
import { SidebarProvider } from "@/components/ui/sidebar"
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner"
import { JobPreferencesPlaceholder } from "@/components/dashboard/JobPreferencesPlaceholder"
import { useState, useEffect } from "react"
import { useProfileSnapshot } from "@/queries/useProfileSnapshot"
import { Spinner } from "@/components/ui/spinner"

// Dashboard main content with sidebar navigation
const Dashboard = () => {
  const { onboardingStatus, isLoading } = useProfileSnapshot()
  const isOnboarding = onboardingStatus === "PROFILE_CONFIRMED"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
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
          {isOnboarding && <OnboardingBanner />}
          <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {isOnboarding ? (
              // Onboarding layout - two columns
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left column - Read-only profile summary */}
                <div className="space-y-6">
                  <div className="opacity-75">
                    <ProfileSummaryCard readonly />
                  </div>
                </div>
                {/* Right column - Job preferences placeholder */}
                <div className="space-y-6">
                  <JobPreferencesPlaceholder />
                </div>
              </div>
            ) : (
              // Regular dashboard layout
              <div className="flex flex-col gap-8">
                <div className="animate-pulse-soft rounded border-2 border-primary/30 shadow-lg">
                  <ProfileSummaryCard />
                </div>
                <div className="animate-pulse-soft rounded border-2 border-secondary/30 shadow-lg">
                  <JobPreferencesCard />
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  )
}

export default Dashboard
