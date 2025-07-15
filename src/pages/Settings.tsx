
import React from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { ProfileInfoSection } from '@/components/settings/ProfileInfoSection'
import { PasswordSecuritySection } from '@/components/settings/PasswordSecuritySection'
import { AccountActionsSection } from '@/components/settings/AccountActionsSection'

export default function Settings() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account preferences and security settings</p>
            </div>
          </header>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-4 space-y-6">
              <ProfileInfoSection />
              <PasswordSecuritySection />
              <AccountActionsSection />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
