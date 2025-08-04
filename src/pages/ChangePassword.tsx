import { AuthBackground } from "@/components/auth/AuthBackground"
import { BrandHeader } from "@/components/auth/BrandHeader"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "@/queries/auth/useGetUser"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const ChangePassword = () => {
  const { data: user } = useGetUser()
  const queryClient = useQueryClient()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      // Update the user's password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (passwordError) throw passwordError

      // Update the onboarding status to PROFILE_GENERATED
      if (user?.id) {
        const { error: statusError } = await supabase
          .from("profiles")
          .update({ onboarding_status: "PROFILE_GENERATED" })
          .eq("id", user.id)

        if (statusError) throw statusError

        // Invalidate the profile query to trigger redirect
        await queryClient.invalidateQueries({
          queryKey: ["profile", user.id],
        })

        toast.success("Password updated successfully!")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md">
        <StepCard>
          <StepCardHeader>
            <BrandHeader />
            <StepCardTitle className="text-center">
              Set Your Password
            </StepCardTitle>
            <StepCardDescription className="text-center">
              Please create a secure password for your account
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Set Password"}
              </Button>
            </form>
          </StepCardContent>
        </StepCard>
      </div>
    </div>
  )
}

export default ChangePassword