
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { Bell } from 'lucide-react'
import { useGetUser } from '@/queries/auth/useGetUser'
import { supabase } from '@/integrations/supabase/client'

interface NotificationPreferences {
  email_notifications: boolean
}

export function NotificationPreferencesSection() {
  const { data: user } = useGetUser()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load current notification preferences
    const loadPreferences = async () => {
      if (!user?.id) return
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_preferences')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error loading notification preferences:', error)
          return
        }

        if (data?.notification_preferences) {
          const prefs = data.notification_preferences as NotificationPreferences
          setEmailNotifications(prefs.email_notifications ?? true)
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error)
      }
    }

    loadPreferences()
  }, [user?.id])

  const handleToggleEmailNotifications = async (checked: boolean) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: {
            email_notifications: checked,
          },
        })
        .eq('id', user.id)

      if (error) throw error

      setEmailNotifications(checked)
      toast({
        title: 'Preferences updated',
        description: `Email notifications ${checked ? 'enabled' : 'disabled'}.`,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
              Email Notifications
            </Label>
            <p className="text-sm text-gray-600">
              Receive updates and alerts via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={handleToggleEmailNotifications}
            disabled={isLoading}
            className="ml-4"
          />
        </div>
      </CardContent>
    </Card>
  )
}
