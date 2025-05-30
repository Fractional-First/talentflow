
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard";
import { JobPreferencesCard } from "@/components/dashboard/JobPreferencesCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { JobPreferencesOnboarding } from "@/components/dashboard/JobPreferencesOnboarding";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";

// Dashboard main content with sidebar navigation
const Dashboard = () => {
  const [jobPreferencesComplete, setJobPreferencesComplete] = useState(false);

  useEffect(() => {
    // Check if job preferences have been completed
    const jobPrefsStatus = localStorage.getItem('jobPreferencesComplete');
    setJobPreferencesComplete(jobPrefsStatus === 'true');
  }, []);

  const handleJobPreferencesComplete = () => {
    localStorage.setItem('jobPreferencesComplete', 'true');
    setJobPreferencesComplete(true);
  };

  // Show onboarding flow if job preferences aren't complete
  if (!jobPreferencesComplete) {
    return (
      <SidebarProvider>
        <DashboardLayout sidebar>
          {/* Sidebar left */}
          <div className="hidden md:flex flex-col h-full min-h-screen border-r border-border/30 bg-background/90 shadow-md">
            <AppSidebar onboardingMode={true} />
          </div>
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Full-width banner */}
            <OnboardingBanner />
            
            {/* Two-column layout */}
            <div className="flex-1 flex gap-8 p-8 max-w-7xl mx-auto w-full">
              {/* Left column - Read-only profile summary */}
              <div className="w-1/3">
                <div className="opacity-75 pointer-events-none">
                  <ProfileSummaryCard readonly={true} />
                </div>
              </div>
              
              {/* Right column - Job preferences form */}
              <div className="w-2/3">
                <JobPreferencesOnboarding onComplete={handleJobPreferencesComplete} />
              </div>
            </div>
          </div>
        </DashboardLayout>
      </SidebarProvider>
    );
  }

  // Regular dashboard after job preferences are complete
  return (
    <SidebarProvider>
      <DashboardLayout sidebar>
        {/* Sidebar left */}
        <div className="hidden md:flex flex-col h-full min-h-screen border-r border-border/30 bg-background/90 shadow-md">
          <AppSidebar />
        </div>
        {/* Main right content */}
        <div className="flex-1 flex flex-col gap-8 p-8 max-w-5xl mx-auto">
          <div className="animate-pulse-soft rounded border-2 border-primary/30 shadow-lg">
            <ProfileSummaryCard />
          </div>
          <div className="animate-pulse-soft rounded border-2 border-secondary/30 shadow-lg">
            <JobPreferencesCard />
          </div>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  );
};

export default Dashboard;
