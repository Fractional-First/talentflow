
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Briefcase, Home, Settings, LogOut, Award } from "lucide-react";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  onboardingMode?: boolean;
}

const menuItems = [
  {
    title: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile Snapshot",
    path: "/dashboard/profile-snapshot",
    icon: User,
  },
  {
    title: "Professional Branding",
    path: "/dashboard/branding",
    icon: Award,
  },
  {
    title: "Job Preferences",
    path: "/dashboard/job-matching",
    icon: Briefcase,
    highlight: true,
  },
  {
    title: "Settings",
    path: "/dashboard/branding",
    icon: Settings,
  },
];

export function AppSidebar({ onboardingMode = false }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {onboardingMode ? "Complete Setup" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isJobPreferences = item.path === "/dashboard/job-matching";
                const isDisabled = onboardingMode && !isJobPreferences;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!isDisabled}
                      isActive={
                        location.pathname === item.path ||
                        (item.path === "/dashboard" && location.pathname === "/dashboard")
                      }
                      className={`${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${
                        onboardingMode && isJobPreferences ? 'bg-primary/10 border border-primary/30' : ''
                      }`}
                    >
                      {isDisabled ? (
                        <div className="flex items-center">
                          <item.icon className="mr-2" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <a
                          href={item.path}
                          onClick={e => {
                            e.preventDefault();
                            navigate(item.path);
                          }}
                        >
                          <item.icon className="mr-2" />
                          <span>{item.title}</span>
                          {onboardingMode && isJobPreferences && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              Next
                            </Badge>
                          )}
                        </a>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={false}
                  className="text-red-500"
                  tooltip="Logout"
                >
                  <button
                    onClick={signOut}
                  >
                    <LogOut className="mr-2" />
                    Logout
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
