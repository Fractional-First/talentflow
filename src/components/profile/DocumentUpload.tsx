
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Upload, File, Linkedin, HelpCircle, Trash2, ArrowRight } from 'lucide-react';

const LINKEDIN_PDF_GUIDE_URL =
  "https://www.linkedin.com/help/linkedin/answer/a521735/how-to-save-a-profile-as-a-pdf?lang=en";

interface DocumentUploadProps {
  onSubmit: (files: { linkedin?: File; resume?: File }) => void;
  isSubmitting: boolean;
  isLinkedInUser?: boolean;
}

export const DocumentUpload = ({ onSubmit, isSubmitting, isLinkedInUser = false }: DocumentUploadProps) => {
  const [files, setFiles] = useState<{ linkedin?: File; resume?: File }>({});

  const handleLinkedInUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, linkedin: file }));
      
      toast({
        title: "LinkedIn PDF uploaded",
        description: "Your LinkedIn profile PDF was successfully uploaded."
      });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, resume: file }));
      
      toast({
        title: "Resume uploaded",
        description: "Your resume was successfully uploaded."
      });
    }
  };

  const removeFile = (type: 'linkedin' | 'resume') => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
    
    toast({
      title: "Document removed",
      description: "The profile document has been removed."
    });
  };

  const handleSubmit = () => {
    if (!files.linkedin && !files.resume) {
      toast({
        title: "No documents uploaded",
        description: "Please upload at least one document (LinkedIn PDF or Resume) to continue.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(files);
  };

  const hasFiles = files.linkedin || files.resume;

  return (
    <div className="space-y-6">
      {/* Instructional Helper Text */}
      <Alert className="bg-blue-50 border-blue-200">
        <div className="flex gap-2">
          <div className="mt-0.5">
            {isLinkedInUser ? <Linkedin className="h-5 w-5 text-[#0A66C2]" /> : <HelpCircle className="h-5 w-5 text-blue-600" />}
          </div>
          <div>
            <AlertTitle className="mb-1 font-semibold text-blue-800">
              Profile Information Requirements
            </AlertTitle>
            <AlertDescription className="text-sm text-blue-900">
              <p className="mb-1">At least <strong>one</strong> of the following is required:</p>
              <ul className="list-disc ml-6 mb-2">
                <li>Upload your resume <span className="font-semibold">(PDF or DOCX)</span></li>
                <li>Upload your LinkedIn profile as a <span className="font-semibold">PDF</span></li>
              </ul>
              
              {isLinkedInUser && (
                <p className="p-1.5 bg-blue-100/50 rounded border border-blue-200 text-xs">
                  <strong>Note:</strong> LinkedIn sign-in provides only limited information. For your full experience, please upload your LinkedIn profile as a PDF.
                </p>
              )}
              
              <div className="flex items-center mt-2 text-xs">
                <a href={LINKEDIN_PDF_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">
                  How to export your LinkedIn profile →
                </a>
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Uploaded Documents Display */}
      {hasFiles && (
        <div className="border rounded-lg p-4 bg-green-50 border-green-200">
          <h3 className="font-medium mb-3 text-green-800">Uploaded Documents</h3>
          <div className="space-y-2">
            {files.linkedin && (
              <div className="flex items-center justify-between p-2 rounded bg-green-100 border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-green-200">
                    <Linkedin className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">LinkedIn</p>
                    <p className="text-xs text-green-600">{files.linkedin.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('linkedin')}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            {files.resume && (
              <div className="flex items-center justify-between p-2 rounded bg-green-100 border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-green-200">
                    <File className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Resume</p>
                    <p className="text-xs text-green-600">{files.resume.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('resume')}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LinkedIn PDF Upload */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-[#0A66C2]/10 p-3 rounded-full mr-3">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          </div>
          <div>
            <h3 className="font-medium">Upload LinkedIn Profile (PDF)</h3>
            <p className="text-sm text-muted-foreground">
              Download your LinkedIn profile as a PDF, then upload it here.
            </p>
          </div>
        </div>
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-muted/50 p-3 rounded-full mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mb-1 font-medium">Drag and drop your LinkedIn PDF here</p>
            <p className="text-sm text-muted-foreground mb-3">PDF up to 5MB</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('linkedin-pdf-upload')?.click()}
              type="button"
            >
              Select File
            </Button>
            <input
              id="linkedin-pdf-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleLinkedInUpload}
            />
          </div>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full mr-3">
            <File className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Resume Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload your resume and we'll extract the relevant information.
            </p>
          </div>
        </div>
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-muted/50 p-3 rounded-full mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mb-1 font-medium">Drag and drop your resume here</p>
            <p className="text-sm text-muted-foreground mb-3">Supports PDF, DOCX, up to 5MB</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('resume')?.click()}
              type="button"
            >
              Select File
            </Button>
            <input
              id="resume"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
            />
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {files.linkedin && files.resume && (
        <Alert className="bg-green-50 border-green-200">
          <File className="h-5 w-5 text-green-600" />
          <AlertTitle className="mb-1 font-semibold text-green-800">
            Both files uploaded successfully
          </AlertTitle>
          <AlertDescription className="text-sm text-green-900">
            Great job! You've uploaded both your LinkedIn PDF and resume. 
            This will give us the most complete picture of your professional background.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !hasFiles}
          type="button"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
