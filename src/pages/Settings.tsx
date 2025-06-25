
import React from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProfileInfoSection } from '@/components/settings/ProfileInfoSection'
import { PasswordSecuritySection } from '@/components/settings/PasswordSecuritySection'
import { NotificationPreferencesSection } from '@/components/settings/NotificationPreferencesSection'
import { AccountActionsSection } from '@/components/settings/AccountActionsSection'

export default function Settings() {
  return (
    <DashboardLayout sidebar={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and security settings</p>
          </div>

          <ProfileInfoSection />
          <PasswordSecuritySection />
          <NotificationPreferencesSection />
          <AccountActionsSection />
        </div>
      </div>
    </DashboardLayout>
  )
}
