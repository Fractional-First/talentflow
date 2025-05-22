
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
  },
  {
    title: "Settings",
    path: "/dashboard/branding", // Optionally, if you have a real settings page, update this path
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.path ||
                      (item.path === "/dashboard" && location.pathname === "/dashboard")
                    }
                  >
                    <a
                      href={item.path}
                      onClick={e => {
                        e.preventDefault();
                        navigate(item.path);
                      }}
                    >
                      <item.icon className="mr-2" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
