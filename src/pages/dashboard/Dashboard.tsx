
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileSummaryCard } from "@/components/dashboard/ProfileSummaryCard";
import { JobPreferencesCard } from "@/components/dashboard/JobPreferencesCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

// Dashboard main content with sidebar navigation
const Dashboard = () => {
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
