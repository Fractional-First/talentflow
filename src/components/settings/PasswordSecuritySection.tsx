
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Lock } from 'lucide-react'

export function PasswordSecuritySection() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      })
      return
    }

    if (passwords.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      })

      if (error) throw error

      setPasswords({ newPassword: '', confirmPassword: '' })
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password.',
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
          <Lock className="h-5 w-5 text-primary" />
          Password & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="text-base font-medium">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="h-12 text-base mt-2"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-base font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="h-12 text-base mt-2"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <Button
          onClick={handleChangePassword}
          disabled={isLoading || !passwords.newPassword || !passwords.confirmPassword}
          className="w-full h-12 text-base font-medium"
        >
          {isLoading ? 'Updating...' : 'Change Password'}
        </Button>
      </CardContent>
    </Card>
  )
}
