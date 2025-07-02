
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
  return (
    <div className="space-y-6">
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
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* LINKEDIN PDF UPLOAD SECTION */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full mr-3">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          </div>
          <div>
            <h3 className="font-medium">Upload LinkedIn Profile (PDF)</h3>
            <div className="text-sm text-muted-foreground">
              Download your LinkedIn profile as a PDF, then upload it here to share your professional information in detail.
            </div>
          </div>
        </div>

        {/* LINKEDIN INSTRUCTIONS INFO BOX - directly under title */}
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
                How to Save LinkedIn Profile as PDF (Desktop only):
              </AlertTitle>
              <AlertDescription className="text-sm" style={{
                color: "#1A1A1A"
              }}>
                Log in at linkedin.com → Click <strong>Me</strong> (top right) → <strong>View Profile</strong> → Click <strong>More</strong> (or Resources) → Select <strong>Save to PDF</strong> → PDF downloads automatically.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* LINKEDIN UPLOAD COMPONENT */}
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
          {linkedinFile ? (
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <File className="h-6 w-6 text-primary" />
              </div>
              <p className="mb-1 font-medium">File uploaded successfully</p>
              <p className="text-sm text-muted-foreground mb-3">{linkedinFile.name}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  onClick={() => document.getElementById("linkedin-upload")?.click()}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                  onClick={onLinkedInRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-muted/50 p-3 rounded-full mb-3">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mb-1 font-medium">Drag and drop your LinkedIn PDF here</p>
              <p className="text-sm text-muted-foreground mb-3">
                Supports PDF, up to 5MB
              </p>
              <div>
                <button
                  type="button"
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  onClick={() => document.getElementById("linkedin-upload")?.click()}
                >
                  Select File
                </button>
                <input
                  id="linkedin-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      if (file.size > 5 * 1024 * 1024) {
                        toast({
                          title: "File too large",
                          description: "Please select a file smaller than 5MB.",
                          variant: "destructive",
                        });
                        return;
                      }
                      onLinkedInUpload(file);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESUME UPLOAD */}
      <DocumentUpload 
        title="Resume Upload" 
        description="Upload your resume and we'll extract the relevant information to help enhance your profile." 
        file={resumeFile} 
        onUpload={onResumeUpload} 
        onRemove={onResumeRemove} 
      />

      {/* SUCCESS MESSAGE WHEN BOTH FILES ARE UPLOADED */}
      {linkedinFile && resumeFile && (
        <Alert className="mb-4 bg-green-50 border-green-200">
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
        </Alert>
      )}
    </div>
  );
};
