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
import { useSubmitProfile } from "@/queries/useSubmitProfile"
import { useSubmitLinkedInProfile } from "@/queries/useSubmitLinkedInProfile"
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Home } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ProfileCreation = () => {
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

  const submitProfileMutation = useSubmitProfile()
  const submitLinkedInMutation = useSubmitLinkedInProfile()

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [serverError, setServerError] = useState("")
  const [useResumeFlow, setUseResumeFlow] = useState(false)

  const validateProfile = (): string[] => {
    const errors: string[] = []
    if (!profile.linkedin && !profile.linkedinUrl && !profile.resume) {
      errors.push(
        "At least one of the following is required: LinkedIn URL, LinkedIn PDF, or Resume"
      )
    }
    return errors
  }

  const handleLinkedInSubmit = async (linkedinUrl: string) => {
    setValidationErrors([])
    setServerError("")
    handleLinkedInUrlSubmit(linkedinUrl)

    submitLinkedInMutation.mutate(
      { linkedinUrl },
      {
        onSuccess: () => {
          toast({
            title: "Profile created successfully",
            description:
              "Your profile has been created from your LinkedIn information.",
          })
          navigate("/edit-profile")
        },
        onError: (error) => {
          let errorMessage =
            "There was a problem creating your profile from LinkedIn. Please try again."
          if (error instanceof Error) {
            if (error.message.includes("Failed to fetch")) {
              errorMessage =
                "Unable to connect to the server. Please check your internet connection and try again."
            } else if (error.message.includes("Server error")) {
              errorMessage =
                "The server encountered an error processing your LinkedIn profile. Please try again."
            } else {
              errorMessage = error.message
            }
          }
          setServerError(errorMessage)
          toast({
            title: "Error creating profile",
            description: errorMessage,
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateProfile()
    if (errors.length > 0) {
      setValidationErrors(errors)
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive",
      })
      return
    }
    setValidationErrors([])
    setServerError("")
    submitProfileMutation.mutate(
      { profile },
      {
        onSuccess: () => {
          toast({
            title: "Profile saved successfully",
            description:
              "Your profile information has been submitted and processed.",
          })
          navigate("/edit-profile")
        },
        onError: (error) => {
          let errorMessage =
            "There was a problem submitting your profile. Please try again."
          if (error instanceof Error) {
            if (error.message.includes("Failed to fetch")) {
              errorMessage =
                "Unable to connect to the server. Please check your internet connection and try submitting again."
            } else if (error.message.includes("Server error")) {
              errorMessage =
                "The server encountered an error processing your profile. Please try submitting again."
            } else {
              errorMessage = error.message
            }
          }
          setServerError(errorMessage)
          toast({
            title: "Error saving profile",
            description: errorMessage,
            variant: "destructive",
          })
        },
      }
    )
  }

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
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[44px] px-3 sm:px-4"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <main>
            {submitProfileMutation.isPending ||
            submitLinkedInMutation.isPending ? (
              <ProfileLoadingUI />
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <StepCard>
                  <StepCardHeader className="px-4 sm:px-6 py-6 sm:py-8">
                    <StepCardTitle className="text-h2 font-urbanist text-center sm:text-left">
                      Create Your Profile
                    </StepCardTitle>
                    <StepCardDescription className="text-body font-urbanist text-center sm:text-left mt-2">
                      Tell us about your professional background and career
                      goals
                    </StepCardDescription>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start mt-4 bg-muted/40 px-4 py-3 rounded-md">
                      <Clock className="h-4 w-4 text-muted-foreground mb-1 sm:mb-0 sm:mr-2" />
                      <span className="text-caption text-muted-foreground font-urbanist text-center sm:text-left">
                        Estimated completion time:{" "}
                        <strong>
                          {!useResumeFlow ? "~1 minute" : "5-7 minutes"}
                        </strong>
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
                      {!useResumeFlow ? (
                        <LinkedInInputSection
                          onLinkedInSubmit={handleLinkedInSubmit}
                          onResumeFallback={() => setUseResumeFlow(true)}
                          isSubmitting={submitLinkedInMutation.isPending}
                        />
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <DocumentUploadSection
                            linkedinFile={profile.linkedin}
                            resumeFile={profile.resume}
                            onLinkedInUpload={handleLinkedInUpload}
                            onResumeUpload={handleResumeUpload}
                            onLinkedInRemove={() =>
                              removeProfileDocument("linkedin")
                            }
                            onResumeRemove={() =>
                              removeProfileDocument("resume")
                            }
                          />
                          <SupportingDocsSection
                            docs={profile.docs}
                            links={profile.links}
                            addDocument={addSupportingDocument}
                            addLink={addSupportingLink}
                            removeDoc={removeSupportingDoc}
                            removeLink={removeSupportingLink}
                          />

                          {/* FOOTER: NAV BUTTONS - Only show for resume flow */}
                          <StepCardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6 px-4 sm:px-6">
                            <Button
                              variant="outline"
                              onClick={() => navigate("/dashboard")}
                              type="button"
                              className="font-urbanist min-h-[48px] w-full sm:w-auto order-2 sm:order-1"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back to Dashboard
                            </Button>

                            <Button
                              type="submit"
                              disabled={
                                submitProfileMutation.isPending ||
                                !hasRequiredDocuments
                              }
                              className="font-urbanist min-h-[48px] w-full sm:w-auto order-1 sm:order-2"
                            >
                              {submitProfileMutation.isPending
                                ? "Saving..."
                                : "Continue"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </StepCardFooter>
                        </form>
                      )}
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

export default ProfileCreation
