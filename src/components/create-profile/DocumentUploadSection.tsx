import { Linkedin, File, HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DocumentUpload } from "./DocumentUpload"
import { toast } from "@/hooks/use-toast"

interface DocumentUploadSectionProps {
  linkedinFile?: File
  resumeFile?: File
  onLinkedInUpload: (file: File) => void
  onResumeUpload: (file: File) => void
  onLinkedInRemove: () => void
  onResumeRemove: () => void
}

const LINKEDIN_PDF_GUIDE_URL =
  "https://www.linkedin.com/help/linkedin/answer/a541960"

export const DocumentUploadSection = ({
  linkedinFile,
  resumeFile,
  onLinkedInUpload,
  onResumeUpload,
  onLinkedInRemove,
  onResumeRemove,
}: DocumentUploadSectionProps) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* RESUME UPLOAD */}
      <DocumentUpload
        title="Resume Upload (Optional)"
        description="Upload your resume and we'll extract the relevant information to help enhance your profile."
        file={resumeFile}
        onUpload={onResumeUpload}
        onRemove={onResumeRemove}
      />

      {/* HIDDEN LINKEDIN PDF UPLOAD - Keep wiring but hide UI */}
      {false && (
        <DocumentUpload
          title="Upload LinkedIn Profile (PDF)"
          description="Download your LinkedIn profile as a PDF, then upload it here to share your professional information in detail."
          icon={<Linkedin className="h-6 w-6 text-[#0A66C2]" />}
          linkedinInstructionsComponent={() => (
            <Alert
              className="mb-4 bg-card border-2 sm:border"
              style={{
                borderColor: "#BFE3DD",
              }}
            >
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-[#449889]" />
                </div>
                <div className="flex-1 min-w-0">
                  <AlertTitle
                    className="mb-2 sm:mb-1 font-semibold text-base sm:text-sm"
                    style={{
                      color: "#449889",
                    }}
                  >
                    How to Save LinkedIn Profile as PDF (Desktop only):
                  </AlertTitle>
                  <AlertDescription
                    className="text-sm leading-relaxed"
                    style={{
                      color: "#1A1A1A",
                    }}
                  >
                    Log in at linkedin.com → Click <strong>Me</strong> (top
                    right) → <strong>View Profile</strong> → Click{" "}
                    <strong>More</strong> (or Resources) → Select{" "}
                    <strong>Save to PDF</strong> → PDF downloads automatically.
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          file={linkedinFile}
          onUpload={onLinkedInUpload}
          onRemove={onLinkedInRemove}
        />
      )}
    </div>
  )
}
