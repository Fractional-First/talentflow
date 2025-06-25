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
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom"
import { User, Briefcase, Home, Settings, LogOut, Award } from "lucide-react"
import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile Snapshot",
    path: "/edit-profile",
    icon: User,
  },
  {
    title: "Professional Branding",
    path: "/dashboard/branding",
    icon: Award,
  },
  {
    title: "Job Preferences",
    path: "/work-preferences",
    icon: Briefcase,
  },
  {
    title: "Settings",
    path: "/dashboard/branding",
    icon: Settings,
  },
]

interface AppSidebarProps {
  isOnboarding?: boolean
}

export function AppSidebar({ isOnboarding = false }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isJobPreferences = item.path === "/work-preferences"
                const isDisabled =
                  isOnboarding &&
                  !isJobPreferences &&
                  item.path !== "/dashboard"
                const isHighlighted = isOnboarding && isJobPreferences

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === item.path ||
                        (item.path === "/dashboard" &&
                          location.pathname === "/dashboard")
                      }
                      className={cn(
                        isDisabled && "opacity-50 pointer-events-none",
                        isHighlighted &&
                          "bg-primary/10 border border-primary/20 shadow-sm"
                      )}
                    >
                      <a
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault()
                          if (!isDisabled) {
                            navigate(item.path)
                          }
                        }}
                      >
                        <item.icon
                          className={cn(
                            "mr-2",
                            isHighlighted && "text-primary"
                          )}
                        />
                        <span
                          className={cn(
                            isHighlighted && "text-primary font-medium"
                          )}
                        >
                          {item.title}
                          {isHighlighted && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                              Next
                            </span>
                          )}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={false}
                  className="text-red-500"
                  tooltip="Logout"
                >
                  <button onClick={signOut}>
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
  )
}
