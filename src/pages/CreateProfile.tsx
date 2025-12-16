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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useDocumentUpload } from "@/queries/useDocumentUpload"
import { toast } from "@/hooks/use-toast"
import { useSubmitLinkedInProfile } from "@/queries/useSubmitLinkedInProfile"
import { useAgreementStatus } from "@/hooks/useAgreementStatus"
import { AGREEMENT_CONTENT } from "@/content/agreementContent"
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Home } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ProfileCreation = () => {
  const navigate = useNavigate()
  const { isWarrantAgreed, acceptWarrant } = useAgreementStatus()
  const [localWarrantChecked, setLocalWarrantChecked] = useState(isWarrantAgreed)

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

  const submitLinkedInMutation = useSubmitLinkedInProfile()

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [serverError, setServerError] = useState("")
  const [currentLinkedInUrl, setCurrentLinkedInUrl] = useState("")

  const validateProfile = (): string[] => {
    const errors: string[] = []
    if (!profile.linkedinUrl) {
      errors.push("LinkedIn URL is required")
    }
    return errors
  }

  const handleWarrantChange = async (checked: boolean) => {
    setLocalWarrantChecked(checked)
    if (checked && !isWarrantAgreed) {
      await acceptWarrant()
    }
  }

  const handleLinkedInSubmit = async (linkedinUrl: string) => {
    // Check warrant first
    if (!localWarrantChecked) {
      toast({
        title: "Accuracy confirmation required",
        description: "Please confirm your information is accurate before continuing.",
        variant: "destructive",
      })
      return
    }

    setValidationErrors([])
    setServerError("")
    handleLinkedInUrlSubmit(linkedinUrl)

    submitLinkedInMutation.mutate(
      { linkedinUrl, profile },
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

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 pb-20">
        <div className="max-w-4xl mx-auto">
          <main>
            {submitLinkedInMutation.isPending ? (
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
                        onResumeFallback={() => {}} // Disabled - no resume flow
                        isSubmitting={submitLinkedInMutation.isPending}
                        hideResumeFallback={true}
                        showSubmitButton={false} // Hide the submit button since we'll use the sticky footer
                        onLinkedInUrlChange={setCurrentLinkedInUrl}
                      />

                      {/* OPTIONAL DOCUMENT UPLOAD SECTIONS */}
                      <div className="border-t pt-6">
                        <DocumentUploadSection
                          linkedinFile={profile.linkedin}
                          resumeFile={profile.resume}
                          onLinkedInUpload={handleLinkedInUpload}
                          onResumeUpload={handleResumeUpload}
                          onLinkedInRemove={() =>
                            removeProfileDocument("linkedin")
                          }
                          onResumeRemove={() => removeProfileDocument("resume")}
                        />
                        <SupportingDocsSection
                          docs={profile.docs}
                          links={profile.links}
                          addDocument={addSupportingDocument}
                          addLink={addSupportingLink}
                          removeDoc={removeSupportingDoc}
                          removeLink={removeSupportingLink}
                        />
                      </div>
                    </div>
                  </StepCardContent>
                </StepCard>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FIXED FOOTER WITH ACCURACY WARRANT AND CREATE PROFILE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/40 py-4 px-4 sm:px-6 z-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Accuracy Warrant Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox 
                id="accuracy-warrant"
                checked={localWarrantChecked}
                onCheckedChange={handleWarrantChange}
                className="mt-0.5"
              />
              <Label 
                htmlFor="accuracy-warrant"
                className="text-sm cursor-pointer leading-relaxed text-muted-foreground"
              >
                {AGREEMENT_CONTENT.accuracyWarrant.label}
              </Label>
            </div>

            <Button
              onClick={() => {
                if (currentLinkedInUrl.trim()) {
                  handleLinkedInSubmit(currentLinkedInUrl.trim())
                } else {
                  toast({
                    title: "LinkedIn URL required",
                    description: "Please enter your LinkedIn URL to continue.",
                    variant: "destructive",
                  })
                }
              }}
              disabled={
                submitLinkedInMutation.isPending || !currentLinkedInUrl.trim() || !localWarrantChecked
              }
              className="font-urbanist min-h-[48px] px-8 whitespace-nowrap"
            >
              {submitLinkedInMutation.isPending
                ? "Creating Profile..."
                : "Create Profile"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
