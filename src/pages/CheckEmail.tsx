import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { AuthBackground } from "@/components/auth/AuthBackground"
import { BrandHeader } from "@/components/auth/BrandHeader"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

const CheckEmail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const { user, loading } = useAuth()
  const email = loading ? "" : user?.email || searchParams.get("email") || ""


  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email address not found. Please try signing up again.")
      navigate("/signup")
      return
    }

    try {
      setIsResending(true)
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/create-profile`,
        },
      })

      if (error) throw error

      toast.success("Verification email resent successfully!")
    } catch (error: any) {
      toast.error(error.message || "Error resending email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md">
        <StepCard>
          <StepCardHeader>
            <BrandHeader />
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <StepCardTitle className="text-center">
              Check your email
            </StepCardTitle>
            <StepCardDescription className="text-center">
              We've sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click the link in the email to verify your account</p>
              <p>• The link will expire in 24 hours</p>
              <p>• Check your spam folder if you don't see the email</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend verification email"
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/signup")}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign up
              </Button>
            </div>
          </StepCardContent>
        </StepCard>
      </div>
    </div>
  )
}

export default CheckEmail
