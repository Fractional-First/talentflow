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
import { useSignOut } from "@/queries/auth/useSignOut"

const menuItems = [
  {
    title: "Your Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "My Profile",
    path: "/edit-profile",
    icon: User,
  },
  {
    title: "Professional Coaching",
    path: "/dashboard/branding",
    icon: Award,
    isNew: true,
  },
  {
    title: "Job Preferences",
    path: "/work-preferences",
    icon: Briefcase,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useSignOut()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === item.path ||
                        (item.path === "/dashboard" &&
                          location.pathname === "/dashboard")
                      }
                    >
                      <a
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(item.path)
                        }}
                      >
                        <item.icon className="mr-2" />
                        <span>
                          {item.title}
                          {item.isNew && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                              NEW
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
