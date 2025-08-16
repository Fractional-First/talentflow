
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
          <header className="flex h-auto min-h-16 shrink-0 items-start gap-2 border-b px-3 sm:px-4 py-3 sm:py-4">
            <SidebarTrigger className="-ml-1 mt-1 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Settings</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                Manage your account preferences and security settings
              </p>
            </div>
          </header>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-3 sm:p-4 space-y-6">
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
