import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardFooter,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { AuthBackground } from "@/components/auth/AuthBackground"
import { BrandHeader } from "@/components/auth/BrandHeader"
import { LinkedInSignUp } from "@/components/auth/LinkedInSignUp"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSignUp } from "@/queries/auth/useSignUp"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { profileStorage } from "@/utils/profileStorage"
import { useEffect, useState } from "react"

const SignUp = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useSignUp()
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    // Check if we have generated profile data
    const generatedProfile = profileStorage.get()
    setProfileData(generatedProfile)
  }, [])

  // Extract name from profile data
  const getInitialName = (fullName: string) => {
    if (!fullName) return ""
    const nameParts = fullName.trim().split(" ")
    return nameParts[0] || ""
  }

  const getInitialLastName = (fullName: string) => {
    if (!fullName) return ""
    const nameParts = fullName.trim().split(" ")
    return nameParts.slice(1).join(" ") || ""
  }

  // Debug the extracted names
  const initialFirstName = profileData ? getInitialName(profileData.name) : ""
  const initialLastName = profileData
    ? getInitialLastName(profileData.name)
    : ""

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
  ) => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    try {
      await signUp(email, password, firstName, lastName)
      navigate(`/check-email?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      toast.error(error.message || "Sign up failed")
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
              Create your account
            </StepCardTitle>
            <StepCardDescription className="text-center">
              Start your onboarding journey with us today
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            {profileData && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  <strong>Great! Your profile is ready.</strong> Once you sign
                  up, you'll be able to edit your profile, set your work
                  preferences, and be eligible to be connected to opportunities
                  for work.
                </AlertDescription>
              </Alert>
            )}

            <LinkedInSignUp isSubmitting={loading} />

            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <SignUpForm
              onSubmit={handleSignUp}
              isSubmitting={loading}
              initialFirstName={initialFirstName}
              initialLastName={initialLastName}
            />
          </StepCardContent>

          <StepCardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            </span>
          </StepCardFooter>
        </StepCard>
      </div>
    </div>
  )
}

export default SignUp
