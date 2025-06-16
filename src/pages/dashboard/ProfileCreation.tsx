import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardFooter,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Step } from "@/components/OnboardingProgress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  File,
  Clock,
  HelpCircle,
  Linkedin,
  Copy,
  AlertCircle,
  Link,
  FileText,
  Trash2,
  Plus,
  Paperclip,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { DocumentUploadSection } from "@/components/profile-creation/DocumentUploadSection"
import { useDocumentUpload } from "@/hooks/profile-creation/useDocumentUpload"
import { N8N_DOCUMENTS_WEBHOOK } from "@/components/profile-creation/types"
import { SupportingDocsSection } from "@/components/profile-creation/SupportingDocsSection"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Design",
  "Construction",
  "Transportation",
  "Hospitality",
  "Other",
]

const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Executive (10+ years)",
]

const LINKEDIN_PDF_GUIDE_URL =
  "https://www.linkedin.com/help/linkedin/answer/a521735/how-to-save-a-profile-as-a-pdf?lang=en"

type ProfileData = {
  linkedin?: File
  resume?: File
  docs: Array<{ title: string; file: File }>
  links: Array<{ title: string; link: string }>
}

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentPosition: string
  company: string
  industry: string
  experienceLevel: string
  summary: string
  skills: string
}

const ProfileCreation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [serverError, setServerError] = useState("")
  const [isLinkedInUser, setIsLinkedInUser] = useState(false)

  // Effect to check if the user signed up with LinkedIn
  useEffect(() => {
    const authMethod = localStorage.getItem("authMethod")
    if (authMethod === "linkedin" || location.state?.linkedInSignUp) {
      setIsLinkedInUser(true)
    }
  }, [location])

  const steps: Step[] = [
    {
      id: 1,
      name: "Sign Up",
      description: "Create your account",
      status: "completed",
      estimatedTime: "2-3 minutes",
    },
    {
      id: 2,
      name: "Create Profile",
      description: "Enter your information",
      status: "current",
      estimatedTime: "5-7 minutes",
    },
    {
      id: 3,
      name: "Review Profile",
      description: "Review your profile",
      status: "upcoming",
      estimatedTime: "3-5 minutes",
    },
  ]

  const validateProfile = (): string[] => {
    const errors: string[] = []

    if (!profile.linkedin && !profile.resume) {
      errors.push(
        "At least one of the following is required: LinkedIn PDF or Resume"
      )
    }

    return errors
  }

  const submitProfileData = async () => {
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

    setIsSubmitting(true)
    setServerError("")
    setValidationErrors([])

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      const formDataToSubmit = new FormData()

      // Add user ID to the form data
      formDataToSubmit.append("userId", user.id)

      // Add profile documents
      if (profile.linkedin) {
        formDataToSubmit.append("linkedin", profile.linkedin)
      }
      if (profile.resume) {
        formDataToSubmit.append("resume", profile.resume)
      }

      // Send POST request to webhook
      const response = await fetch(N8N_DOCUMENTS_WEBHOOK, {
        method: "POST",
        body: formDataToSubmit,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Server error: ${response.status} ${response.statusText}. ${errorText}`
        )
      }

      // Parse the response to check for success
      const responseData = await response.json()

      // Check if the API response indicates an error
      if (responseData.error || responseData.status === "error") {
        throw new Error(
          responseData.message ||
            "Server reported an error processing your profile"
        )
      }

      // Store completion status in localStorage
      const completedSections = JSON.parse(
        localStorage.getItem("completedSections") || "{}"
      )
      completedSections.profile = true
      localStorage.setItem(
        "completedSections",
        JSON.stringify(completedSections)
      )

      toast({
        title: "Profile saved successfully",
        description:
          "Your profile information has been submitted and processed.",
      })

      // Invalidate React Query cache for profile data to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] })

      // Redirect to profile snapshot page
      navigate("/dashboard/profile-snapshot")
    } catch (error) {
      console.error("Error submitting profile:", error)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitProfileData()
  }

  return (
    <DashboardLayout steps={steps} currentStep={2}>
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
                isLinkedInUser={isLinkedInUser}
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
              disabled={isSubmitting || !hasRequiredDocuments}
            >
              {isSubmitting ? "Saving..." : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default ProfileCreation
