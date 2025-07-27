
import { DocumentUploadSection } from "@/components/create-profile/DocumentUploadSection"
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
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Home } from "lucide-react"
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

  console.log(profile)

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png" 
              alt="Fractional First" 
              className="h-12 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <main>
            {submitProfileMutation.isPending ? (
              <ProfileLoadingUI />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <StepCard>
                    <StepCardHeader>
                      <StepCardTitle className="text-h2 font-urbanist">Create Your Profile</StepCardTitle>
                      <StepCardDescription className="text-body font-urbanist">
                        Tell us about your professional background and career goals
                      </StepCardDescription>
                      <div className="flex items-center mt-2 bg-muted/40 px-3 py-2 rounded-md">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-caption text-muted-foreground font-urbanist">
                          Estimated completion time: <strong>5-7 minutes</strong>
                        </span>
                      </div>
                    </StepCardHeader>

                    <StepCardContent>
                      {/* VALIDATION ERRORS */}
                      {validationErrors.length > 0 && (
                        <Alert className="mb-4 bg-red-50 border-red-200">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <AlertTitle className="mb-1 text-h3 text-red-800 font-urbanist">
                            Validation Error
                          </AlertTitle>
                          <AlertDescription className="text-caption text-red-900 font-urbanist">
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
                          <AlertTitle className="mb-1 text-h3 text-red-800 font-urbanist">
                            Connection Error
                          </AlertTitle>
                          <AlertDescription className="text-caption text-red-900 font-urbanist">
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
                      className="font-urbanist"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>

                    <Button
                      type="submit"
                      disabled={
                        submitProfileMutation.isPending || !hasRequiredDocuments
                      }
                      className="font-urbanist"
                    >
                      {submitProfileMutation.isPending ? "Saving..." : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </StepCardFooter>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>

      <footer className="border-t border-border/40 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Fractional First. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ProfileCreation
