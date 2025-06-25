
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useGetUser } from '@/queries/auth/useGetUser'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { User } from 'lucide-react'

export function ProfileInfoSection() {
  const { data: user } = useGetUser()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      })

      if (error) throw error

      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile information.',
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
          <User className="h-5 w-5 text-primary" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="h-12 text-base mt-2"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="h-12 text-base mt-2"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 text-base mt-2"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full h-12 text-base font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
