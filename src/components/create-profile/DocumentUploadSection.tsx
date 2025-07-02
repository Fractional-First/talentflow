import { Linkedin, File } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DocumentUpload } from "./DocumentUpload";
import { toast } from "@/hooks/use-toast";
interface DocumentUploadSectionProps {
  linkedinFile?: File;
  resumeFile?: File;
  onLinkedInUpload: (file: File) => void;
  onResumeUpload: (file: File) => void;
  onLinkedInRemove: () => void;
  onResumeRemove: () => void;
}
const LINKEDIN_PDF_GUIDE_URL = "https://www.linkedin.com/help/linkedin/answer/a541960";
export const DocumentUploadSection = ({
  linkedinFile,
  resumeFile,
  onLinkedInUpload,
  onResumeUpload,
  onLinkedInRemove,
  onResumeRemove
}: DocumentUploadSectionProps) => {
  return <div className="space-y-6">
      {/* INSTRUCTIONAL HELPER TEXT */}
      <Alert className="mb-4" style={{
      background: "#E6F4F2",
      borderColor: "#BFE3DD"
    }}>
        <div className="flex gap-2">
          <div className="mt-0.5">
            <File className="h-5 w-5 text-[#449889]" />
          </div>
          <div>
            <AlertTitle className="mb-1 font-semibold" style={{
            color: "#449889"
          }}>
              Profile Information Requirements
            </AlertTitle>
            <AlertDescription className="text-sm" style={{
            color: "#1A1A1A"
          }}>
              <p className="mb-1">
                At least <strong>one</strong> of the following is required:
              </p>
              <ul className="list-disc ml-6 mb-2">
                <li>
                  Upload your resume/CV{" "}
                  <span className="font-semibold">(PDF or DOCX)</span>
                </li>
                <li>
                  Upload your LinkedIn profile as a{" "}
                  <span className="font-semibold">PDF</span>
                </li>
              </ul>
              <div className="flex items-center mt-2 text-xs">
                
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* LINKEDIN PDF UPLOAD */}
      <DocumentUpload title="Upload LinkedIn Profile (PDF)" description="Download your LinkedIn profile as a PDF, then upload it here to share your professional information in detail." icon={<Linkedin className="h-6 w-6 text-[#0A66C2]" />} file={linkedinFile} onUpload={onLinkedInUpload} onRemove={onLinkedInRemove} accept=".pdf" />

      {/* RESUME UPLOAD */}
      <DocumentUpload title="Resume Upload" description="Upload your resume and we'll extract the relevant information to help enhance your profile." file={resumeFile} onUpload={onResumeUpload} onRemove={onResumeRemove} />

      {/* SUCCESS MESSAGE WHEN BOTH FILES ARE UPLOADED */}
      {linkedinFile && resumeFile && <Alert className="mb-4 bg-green-50 border-green-200">
          <div className="flex gap-2">
            <div className="mt-0.5">
              <File className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <AlertTitle className="mb-1 font-semibold text-green-800">
                Both files uploaded successfully
              </AlertTitle>
              <AlertDescription className="text-sm text-green-900">
                Great job! You've uploaded both your LinkedIn PDF and resume.
                This will give us the most complete picture of your professional
                background.
              </AlertDescription>
            </div>
          </div>
        </Alert>}
    </div>;
};