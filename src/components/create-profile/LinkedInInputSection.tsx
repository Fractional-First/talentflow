import { Linkedin, ArrowRight, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface LinkedInInputSectionProps {
  onLinkedInSubmit: (linkedinUrl: string) => void
  onResumeFallback: () => void
  isSubmitting?: boolean
  hideResumeFallback?: boolean
}

export const LinkedInInputSection = ({
  onLinkedInSubmit,
  onResumeFallback,
  isSubmitting = false,
  hideResumeFallback = false,
}: LinkedInInputSectionProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [validationError, setValidationError] = useState("")

  const validateLinkedInUrl = (url: string): boolean => {
    if (!url.trim()) {
      setValidationError("Please enter your LinkedIn username or URL")
      return false
    }

    // Clean up the input - remove any whitespace
    const cleanUrl = url.trim()

    // Check if it's a valid LinkedIn URL or username
    const linkedinUrlPattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9\-_]+\/?$/
    const linkedinUsernamePattern = /^[a-zA-Z0-9\-_]+$/

    if (
      linkedinUrlPattern.test(cleanUrl) ||
      linkedinUsernamePattern.test(cleanUrl)
    ) {
      setValidationError("")
      return true
    }

    setValidationError(
      "Please enter a valid LinkedIn username or URL (e.g., 'john-doe' or 'https://linkedin.com/in/john-doe')"
    )
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling to parent form
    if (validateLinkedInUrl(linkedinUrl)) {
      onLinkedInSubmit(linkedinUrl.trim())
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* INSTRUCTIONAL HELPER TEXT */}
      <Alert
        className="mb-4 sm:mb-6 bg-card border-2 sm:border"
        style={{
          borderColor: "#BFE3DD",
        }}
      >
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
          </div>
          <div className="flex-1 min-w-0">
            <AlertTitle
              className="mb-2 sm:mb-1 font-semibold text-base sm:text-sm"
              style={{
                color: "#449889",
              }}
            >
              Create Profile from LinkedIn
            </AlertTitle>
            <AlertDescription
              className="text-sm leading-relaxed"
              style={{
                color: "#1A1A1A",
              }}
            >
              <p className="mb-3 sm:mb-1">
                Enter your LinkedIn username or URL and we'll automatically
                extract your professional information to create your profile.
              </p>
              <p className="text-xs text-muted-foreground">
                This is the fastest way to get started - no file uploads
                required!
              </p>
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* LINKEDIN INPUT FORM */}
      <div className="border rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4 sm:mb-6">
          <div className="bg-primary/10 p-2 sm:p-3 rounded-full flex-shrink-0">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base sm:text-lg mb-1">
              LinkedIn Profile
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Enter your LinkedIn username or full URL
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url" className="text-sm font-medium">
              LinkedIn Username or URL
            </Label>
            <Input
              id="linkedin-url"
              type="text"
              placeholder="john-doe or https://linkedin.com/in/john-doe"
              value={linkedinUrl}
              onChange={(e) => {
                setLinkedinUrl(e.target.value)
                if (validationError) setValidationError("")
              }}
              className="min-h-[48px]"
              disabled={isSubmitting}
            />
            {validationError && (
              <p className="text-sm text-red-600">{validationError}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !linkedinUrl.trim()}
              className="font-urbanist min-h-[48px] flex-1 sm:flex-none sm:w-auto"
            >
              {isSubmitting ? "Creating Profile..." : "Create Profile"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* FALLBACK OPTION */}
      {!hideResumeFallback && (
        <div className="border-t pt-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Prefer to upload your resume instead?
            </div>
            <Button
              variant="outline"
              onClick={onResumeFallback}
              disabled={isSubmitting}
              className="font-urbanist min-h-[48px] gap-2"
            >
              <FileText className="h-4 w-4" />
              Sign up using Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
