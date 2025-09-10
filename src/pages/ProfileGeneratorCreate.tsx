import { DocumentUploadSection } from "@/components/create-profile/DocumentUploadSection"
import { LinkedInInputSection } from "@/components/create-profile/LinkedInInputSection"
import { SupportingDocsSection } from "@/components/create-profile/SupportingDocsSection"
import { ProfileLoadingUI } from "@/components/create-profile/ProfileLoadingUI"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardFooter,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useDocumentUpload } from "@/queries/useDocumentUpload"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { profileStorage, GeneratedProfile } from "@/utils/profileStorage"

// Anonymous profile submission hook using production N8N workflow
const useSubmitAnonymousLinkedInProfile = () => {
  const [isPending, setIsPending] = useState(false)

  const mutate = async ({
    linkedinUrl,
    onSuccess,
    onError,
  }: {
    linkedinUrl: string
    onSuccess?: (data: any) => void
    onError?: (error: Error) => void
  }) => {
    setIsPending(true)
    try {
      const response = await fetch(
        "https://webhook-processor-production-1757.up.railway.app/webhook/generate-profile-guest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            linkedinUrl: linkedinUrl,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to generate profile: ${response.status} ${errorText}`
        )
      }

      const profileData = await response.json()

      // Store in sessionStorage
      profileStorage.set(profileData)

      onSuccess?.(profileData)
    } catch (error) {
      onError?.(error as Error)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

const ProfileGeneratorCreate = () => {
  const navigate = useNavigate()

  const {
    profile,
    handleLinkedInUpload,
    handleResumeUpload,
    handleLinkedInUrlSubmit,
    removeProfileDocument,
    hasRequiredDocuments,
    addSupportingDocument,
    addSupportingLink,
    removeSupportingDoc,
    removeSupportingLink,
  } = useDocumentUpload()

  const submitAnonymousLinkedInMutation = useSubmitAnonymousLinkedInProfile()

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [serverError, setServerError] = useState("")
  // const [useResumeFlow, setUseResumeFlow] = useState(false) // Commented out - only LinkedIn flow for unauthenticated users

  // Redirect authenticated users
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await import("@/integrations/supabase/client").then((m) =>
          m.supabase.auth.getUser()
        )
        if (user) {
          navigate("/create-profile", { replace: true })
        }
      } catch (error) {
        // User is not authenticated, continue with anonymous flow
      }
    }
    checkAuth()
  }, [navigate])

  // const validateProfile = (): string[] => {
  //   const errors: string[] = []
  //   if (!profile.linkedin && !profile.linkedinUrl && !profile.resume) {
  //     errors.push(
  //       "At least one of the following is required: LinkedIn URL, LinkedIn PDF, or Resume"
  //     )
  //   }
  //   return errors
  // } // Commented out - only LinkedIn flow for unauthenticated users

  const handleLinkedInSubmit = async (linkedinUrl: string) => {
    setValidationErrors([])
    setServerError("")
    // handleLinkedInUrlSubmit(linkedinUrl) // Commented out - not needed for anonymous flow

    submitAnonymousLinkedInMutation.mutate({
      linkedinUrl,
      onSuccess: () => {
        toast({
          title: "Profile generated successfully",
          description:
            "Your profile has been created from your LinkedIn information.",
        })
        navigate("/profile-generator/preview")
      },
      onError: (error) => {
        let errorMessage =
          "There was a problem generating your profile from LinkedIn. Please try again."
        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch")) {
            errorMessage =
              "Unable to connect to the server. Please check your internet connection and try again."
          } else if (error.message.includes("Failed to generate profile")) {
            errorMessage = error.message
          } else {
            errorMessage = error.message
          }
        }
        setServerError(errorMessage)
        toast({
          title: "Error generating profile",
          description: errorMessage,
          variant: "destructive",
        })
      },
    })
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   // Commented out - only LinkedIn flow for unauthenticated users
  //   // Resume/PDF upload flow removed for simplicity
  // }

  const backgroundEffect = (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
    </div>
  )

  return (
    <div className="min-h-screen w-full flex flex-col">
      {backgroundEffect}

      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png"
              alt="Fractional First"
              className="h-10 sm:h-12 w-auto cursor-pointer"
              onClick={() => navigate("/profile-generator")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile-generator")}
              className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[44px] px-3 sm:px-4"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <main>
            {submitAnonymousLinkedInMutation.isPending ? (
              <ProfileLoadingUI />
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <StepCard>
                  <StepCardHeader className="px-4 sm:px-6 py-6 sm:py-8">
                    <StepCardTitle className="text-h2 font-urbanist text-center sm:text-left">
                      Generate Your Profile
                    </StepCardTitle>
                    <StepCardDescription className="text-body font-urbanist text-center sm:text-left mt-2">
                      Create your professional profile to see how it looks
                      before signing up
                    </StepCardDescription>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start mt-4 bg-muted/40 px-4 py-3 rounded-md">
                      <Clock className="h-4 w-4 text-muted-foreground mb-1 sm:mb-0 sm:mr-2" />
                      <span className="text-caption text-muted-foreground font-urbanist text-center sm:text-left">
                        Estimated completion time: <strong>~1 minute</strong>
                      </span>
                    </div>
                  </StepCardHeader>

                  <StepCardContent className="px-4 sm:px-6 py-6 sm:py-8">
                    {/* VALIDATION ERRORS */}
                    {validationErrors.length > 0 && (
                      <Alert className="mb-6 bg-red-50 border-red-200">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-2">
                          <AlertTitle className="mb-2 text-h3 text-red-800 font-urbanist">
                            Validation Error
                          </AlertTitle>
                          <AlertDescription className="text-caption text-red-900 font-urbanist">
                            <ul className="list-disc ml-4 space-y-1">
                              {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    {/* Display any server connection errors */}
                    {serverError && (
                      <Alert className="mb-6 bg-red-50 border-red-200">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-2">
                          <AlertTitle className="mb-2 text-h3 text-red-800 font-urbanist">
                            Connection Error
                          </AlertTitle>
                          <AlertDescription className="text-caption text-red-900 font-urbanist">
                            {serverError}
                            <p className="mt-2 text-xs leading-relaxed">
                              You can continue filling out the form and try
                              submitting again later.
                            </p>
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    <div className="space-y-6 sm:space-y-8">
                      <LinkedInInputSection
                        onLinkedInSubmit={handleLinkedInSubmit}
                        onResumeFallback={() => {}} // No-op since resume flow is disabled
                        isSubmitting={submitAnonymousLinkedInMutation.isPending}
                        hideResumeFallback={true}
                      />
                    </div>
                  </StepCardContent>
                </StepCard>
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="border-t border-border/40 py-4 sm:py-6 mt-8 sm:mt-10">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Fractional First. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ProfileGeneratorCreate
