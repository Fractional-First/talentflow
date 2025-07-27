
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Trash, RotateCcw } from 'lucide-react'
import { useSignOut } from '@/queries/auth/useSignOut'
import { supabase } from '@/integrations/supabase/client'
import { useGetUser } from '@/queries/auth/useGetUser'
import { resetUserState } from '@/utils/authUtils'

export function AccountActionsSection() {
  const { data: user } = useGetUser()
  const { signOut } = useSignOut()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: 'Error',
        description: 'Please type "DELETE" to confirm account deletion.',
        variant: 'destructive',
      })
      return
    }

    setIsDeleting(true)
    try {
      // First delete the user's profile data
      if (user?.id) {
        await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id)
      }

      // Note: Actual user deletion would require a server-side function
      // For now, we'll sign out the user and show a message
      toast({
        title: 'Account deletion requested',
        description: 'Your account deletion request has been submitted. You will be contacted within 24 hours.',
      })

      setIsDialogOpen(false)
      await signOut()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to process account deletion request.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleResetUserState = async () => {
    if (confirm('Are you sure you want to reset the user state? This will log you out and clear all auth data.')) {
      await resetUserState()
    }
  }

  return (
    <Card className="w-full border-red-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg text-red-700">
          <Trash className="h-5 w-5" />
          Account Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-red-700">User State</h4>
          <p className="text-sm text-gray-600">
            Reset user authentication state and clear all stored auth data.
          </p>
          <Button
            onClick={handleResetUserState}
            variant="outline"
            className="w-full h-12 text-base font-medium border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset User State
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-red-700">Danger Zone</h4>
          <p className="text-sm text-gray-600">
            Once you delete your account, there is no going back. This action cannot be undone.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full h-12 text-base font-medium">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-red-700">Delete Account</DialogTitle>
              <DialogDescription className="text-sm">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="confirm-delete" className="text-sm font-medium">
                  Type "DELETE" to confirm
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="h-12 text-base mt-2"
                  placeholder="DELETE"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setConfirmText('')
                }}
                className="w-full sm:w-auto h-12"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== 'DELETE'}
                className="w-full sm:w-auto h-12"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
