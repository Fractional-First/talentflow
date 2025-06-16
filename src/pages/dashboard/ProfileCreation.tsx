import { initialSteps } from "@/components/dashboard/OnboardingSteps"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DocumentUploadSection } from "@/components/profile-creation/DocumentUploadSection"
import { SupportingDocsSection } from "@/components/profile-creation/SupportingDocsSection"
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
import { useDocumentUpload } from "@/hooks/profile-creation/useDocumentUpload"
import { toast } from "@/hooks/use-toast"
import { useSubmitProfile } from "@/queries/useSubmitProfile"
import { AlertCircle, ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ProfileCreation = () => {
  const navigate = useNavigate()

  const {
    profile,
    handleLinkedInUpload,
    handleResumeUpload,
    removeProfileDocument,
    hasRequiredDocuments,
    addSupportingDocument,
    addSupportingLink,
    removeSupportingDoc,
    removeSupportingLink,
  } = useDocumentUpload()

  const submitProfileMutation = useSubmitProfile()

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [serverError, setServerError] = useState("")

  const validateProfile = (): string[] => {
    const errors: string[] = []
    if (!profile.linkedin && !profile.resume) {
      errors.push(
        "At least one of the following is required: LinkedIn PDF or Resume"
      )
    }
    return errors
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
          navigate("/dashboard/profile-snapshot")
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

  return (
    <DashboardLayout steps={initialSteps} currentStep={2}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <StepCard>
            <StepCardHeader>
              <StepCardTitle>Create Your Profile</StepCardTitle>
              <StepCardDescription>
                Tell us about your professional background and career goals
              </StepCardDescription>
              <div className="flex items-center mt-2 bg-muted/40 px-3 py-2 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Estimated completion time: <strong>5-7 minutes</strong>
                </span>
              </div>
            </StepCardHeader>

            <StepCardContent>
              {/* VALIDATION ERRORS */}
              {validationErrors.length > 0 && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="mb-1 font-semibold text-red-800">
                    Validation Error
                  </AlertTitle>
                  <AlertDescription className="text-sm text-red-900">
                    <ul className="list-disc ml-4">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Display any server connection errors */}
              {serverError && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="mb-1 font-semibold text-red-800">
                    Connection Error
                  </AlertTitle>
                  <AlertDescription className="text-sm text-red-900">
                    {serverError}
                    <p className="mt-1 text-xs">
                      You can continue filling out the form and try submitting
                      again later.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <DocumentUploadSection
                linkedinFile={profile.linkedin}
                resumeFile={profile.resume}
                onLinkedInUpload={handleLinkedInUpload}
                onResumeUpload={handleResumeUpload}
                onLinkedInRemove={() => removeProfileDocument("linkedin")}
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
            </StepCardContent>
          </StepCard>

          {/* FOOTER: NAV BUTTONS */}
          <StepCardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <Button
              type="submit"
              disabled={
                submitProfileMutation.isPending || !hasRequiredDocuments
              }
            >
              {submitProfileMutation.isPending ? "Saving..." : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default ProfileCreation
