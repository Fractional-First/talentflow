import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { StepCardFooter } from '@/components/StepCard';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  File, 
  Linkedin, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  Copy, 
  Paperclip,
  Plus,
  X,
  Link
} from 'lucide-react';

const LINKEDIN_PDF_GUIDE_URL = 'https://www.linkedin.com/help/linkedin/answer/17193/exporting-your-profile-to-pdf?lang=en';

interface SupportingDocument {
  type: 'file' | 'link';
  name?: string;
  url?: string;
  title?: string;
  description?: string;
  file?: File;
}

interface ProfileDocument {
  name: string;
  url: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPosition?: string;
  company?: string;
  yearsExperience?: string;
  skills?: string;
  summary?: string;
  linkedin?: ProfileDocument | null;
  resume?: ProfileDocument | null;
  supportingDocuments?: SupportingDocument[];
}

const initialFormData: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  currentPosition: '',
  company: '',
  yearsExperience: '',
  skills: '',
  summary: '',
  linkedin: null,
  resume: null,
  supportingDocuments: [],
};

const steps = [
  { id: 1, title: 'Welcome' },
  { id: 2, title: 'Create Profile' },
  { id: 3, title: 'Job Preferences' },
];

const ProfileCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<ProfileData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showSupportingDocs, setShowSupportingDocs] = useState(false);
  const [isLinkedInUser, setIsLinkedInUser] = useState(false);
  const [isUsingLinkedInInfo, setIsUsingLinkedInInfo] = useState(false);

  const linkedinFileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_data')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error loading profile data:', error);
          return;
        }
        if (data?.profile_data) {
          const pd = data.profile_data as ProfileData;
          setFormData(pd);
          if (pd.linkedin) setIsLinkedInUser(true);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    loadProfileData();
  }, [user?.id]);

  // Validation function
  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.firstName || formData.firstName.trim() === '') {
      errors.push('First name is required.');
    }
    if (!formData.lastName || formData.lastName.trim() === '') {
      errors.push('Last name is required.');
    }
    if (!formData.email || formData.email.trim() === '') {
      errors.push('Email address is required.');
    } else {
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Email address is invalid.');
      }
    }
    if (!formData.currentPosition || formData.currentPosition.trim() === '') {
      errors.push('Current position is required.');
    }
    if (!formData.yearsExperience || formData.yearsExperience.trim() === '') {
      errors.push('Years of experience is required.');
    } else {
      const years = Number(formData.yearsExperience);
      if (isNaN(years) || years < 0 || years > 50) {
        errors.push('Years of experience must be a number between 0 and 50.');
      }
    }
    if (!formData.skills || formData.skills.trim() === '') {
      errors.push('Key skills are required.');
    }
    if (!formData.summary || formData.summary.trim() === '') {
      errors.push('Professional summary is required.');
    }
    // Require at least one of LinkedIn or Resume uploaded if not manual entry
    if (!showManualEntry && !formData.linkedin && !formData.resume) {
      errors.push('Please upload at least one of LinkedIn PDF or Resume.');
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Check if required documents are uploaded
  const hasRequiredDocuments = !!formData.linkedin || !!formData.resume;

  // Handle file uploads for LinkedIn and Resume
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'linkedin' | 'resume') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 10MB.',
        variant: 'destructive',
      });
      return;
    }
    if (type === 'linkedin' && file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'LinkedIn upload must be a PDF file.',
        variant: 'destructive',
      });
      return;
    }
    if (type === 'resume' && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Resume must be PDF, DOC, or DOCX format.',
        variant: 'destructive',
      });
      return;
    }
    // Upload file to Supabase Storage or handle as needed
    try {
      setIsSubmitting(true);
      const filePath = `${user?.id}/${type}/${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('profile-documents')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const publicUrl = supabase.storage.from('profile-documents').getPublicUrl(filePath).data.publicUrl;
      if (!publicUrl) throw new Error('Failed to get public URL');
      const newDoc: ProfileDocument = { name: file.name, url: publicUrl };
      setFormData(prev => ({
        ...prev,
        [type]: newDoc,
      }));
      toast({
        title: 'Upload successful',
        description: `${type === 'linkedin' ? 'LinkedIn PDF' : 'Resume'} uploaded successfully.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove uploaded LinkedIn or Resume document
  const removeProfileDocument = (type: 'linkedin' | 'resume') => {
    setFormData(prev => ({
      ...prev,
      [type]: null,
    }));
  };

  // Supporting documents state and handlers
  const [supportingDocTitle, setSupportingDocTitle] = useState('');
  const [supportingDocDescription, setSupportingDocDescription] = useState('');
  const [supportingDocUrl, setSupportingDocUrl] = useState('');
  const [supportingDocFile, setSupportingDocFile] = useState<File | null>(null);
  const [supportingDocType, setSupportingDocType] = useState<'file' | 'link'>('link');

  const handleAddSupportingDocument = async () => {
    if (supportingDocType === 'link') {
      if (!supportingDocUrl.trim()) {
        toast({
          title: 'Invalid URL',
          description: 'Please enter a valid URL.',
          variant: 'destructive',
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        supportingDocuments: [
          ...(prev.supportingDocuments || []),
          {
            type: 'link',
            url: supportingDocUrl.trim(),
            title: supportingDocTitle.trim() || undefined,
            description: supportingDocDescription.trim() || undefined,
          },
        ],
      }));
      setSupportingDocTitle('');
      setSupportingDocDescription('');
      setSupportingDocUrl('');
      toast({
        title: 'Link added',
        description: 'Supporting link added successfully.',
        variant: 'success',
      });
    } else if (supportingDocType === 'file' && supportingDocFile) {
      if (supportingDocFile.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'File size must be less than 10MB.',
          variant: 'destructive',
        });
        return;
      }
      try {
        setIsSubmitting(true);
        const filePath = `${user?.id}/supporting-documents/${supportingDocFile.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from('profile-documents')
          .upload(filePath, supportingDocFile, { upsert: true });
        if (uploadError) throw uploadError;
        const publicUrl = supabase.storage.from('profile-documents').getPublicUrl(filePath).data.publicUrl;
        if (!publicUrl) throw new Error('Failed to get public URL');
        setFormData(prev => ({
          ...prev,
          supportingDocuments: [
            ...(prev.supportingDocuments || []),
            {
              type: 'file',
              name: supportingDocFile.name,
              url: publicUrl,
              title: supportingDocTitle.trim() || undefined,
              description: supportingDocDescription.trim() || undefined,
            },
          ],
        }));
        setSupportingDocTitle('');
        setSupportingDocDescription('');
        setSupportingDocFile(null);
        toast({
          title: 'File added',
          description: 'Supporting file added successfully.',
          variant: 'success',
        });
      } catch (error) {
        console.error('Supporting document upload error:', error);
        toast({
          title: 'Upload failed',
          description: 'There was an error uploading your file. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
    }
  };

  const removeSupportingDocument = (index: number) => {
    setFormData(prev => {
      const newDocs = [...(prev.supportingDocuments || [])];
      newDocs.splice(index, 1);
      return {
        ...prev,
        supportingDocuments: newDocs,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validateForm()) return;
    if (!user?.id) {
      setServerError('User not authenticated.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            profile_data: formData,
          },
          { onConflict: 'id' }
        );
      if (error) {
        setServerError('Failed to save profile data.');
        console.error('Save error:', error);
        return;
      }
      toast({
        title: 'Profile saved',
        description: 'Your profile information has been saved successfully.',
        variant: 'success',
      });
      navigate('/dashboard/job-preferences');
    } catch (error) {
      setServerError('An unexpected error occurred.');
      console.error('Unexpected error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="flex items-center mt-2 bg-muted/40 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Estimated completion time: <strong>5-7 minutes</strong>
                </span>
              </div>
            </StepCardHeader>

            <StepCardContent>
              {/* VALIDATION ERRORS */}
              {validationErrors.length > 0 && (
                <Alert className="mb-4 bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <AlertTitle className="mb-1 font-semibold text-destructive">
                    Validation Error
                  </AlertTitle>
                  <AlertDescription className="text-sm text-destructive">
                    <ul className="list-disc ml-4">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* COMBINED INSTRUCTIONAL HELPER TEXT */}
              <Alert className="mb-4 bg-info-light border-info-border">
                <div className="flex gap-2">
                  <div className="mt-0.5">
                    {isLinkedInUser ? <Linkedin className="h-5 w-5 text-primary" /> : <HelpCircle className="h-5 w-5 text-info" />}
                  </div>
                  <div>
                    <AlertTitle className="mb-1 font-semibold text-info">
                      Profile Information Requirements
                    </AlertTitle>
                    <AlertDescription className="text-sm text-info">
                      <p className="mb-1">At least <strong>one</strong> of the following is required:</p>
                      <ul className="list-disc ml-6 mb-2">
                        <li>Upload your resume/CV <span className="font-semibold">(PDF or DOCX)</span></li>
                        <li>Upload your LinkedIn profile as a <span className="font-semibold">PDF</span></li>
                      </ul>
                      
                      {isLinkedInUser && (
                        <p className="p-1.5 bg-info-light/50 rounded border border-info-border text-xs">
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

              {/* Display any server connection errors */}
              {serverError && (
                <Alert className="mb-4 bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <AlertTitle className="mb-1 font-semibold text-destructive">
                    Connection Error
                  </AlertTitle>
                  <AlertDescription className="text-sm text-destructive">
                    {serverError}
                    <p className="mt-1 text-xs">
                      You can continue filling out the form and try submitting again later.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {!showManualEntry ? (
                <div className="space-y-6">
                  {/* UPLOADED DOCUMENTS DISPLAY */}
                  {(formData.linkedin || formData.resume) && (
                    <div className="border rounded-lg p-4 bg-success-light border-success-border">
                      <h3 className="font-medium mb-3 text-success">Uploaded Documents</h3>
                      <div className="space-y-2">
                        {formData.linkedin && (
                          <div className="flex items-center justify-between p-2 rounded bg-background border border-success-border">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-primary/10">
                                <Linkedin className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-success">LinkedIn</p>
                                <p className="text-xs text-muted-foreground">{formData.linkedin.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProfileDocument('linkedin')}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {formData.resume && (
                          <div className="flex items-center justify-between p-2 rounded bg-background border border-success-border">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-primary/10">
                                <File className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-success">Resume</p>
                                <p className="text-xs text-muted-foreground">{formData.resume.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProfileDocument('resume')}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LINKEDIN PDF UPLOAD SEGMENT */}
                  <div className="border rounded-lg p-6 mb-2">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-3 rounded-full mr-3">
                        <Linkedin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Upload LinkedIn Profile (PDF)</h3>
                        <p className="text-sm text-muted-foreground">
                          Download your LinkedIn profile as a PDF, then upload it here to share your professional information in detail.
                        </p>
                        <div className="text-xs mt-1">
                          <a
                            href={LINKEDIN_PDF_GUIDE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            How to export your LinkedIn profile →
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Upload interface */}
                    <div className="relative">
                      <input
                        type="file"
                        ref={linkedinFileInputRef}
                        onChange={(e) => handleFileUpload(e, 'linkedin')}
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload LinkedIn PDF</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF files only, max 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* RESUME UPLOAD SEGMENT */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-3 rounded-full mr-3">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Upload Resume/CV</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload your most current resume or CV in PDF or DOCX format
                        </p>
                      </div>
                    </div>

                    {/* Upload interface */}
                    <div className="relative">
                      <input
                        type="file"
                        ref={resumeFileInputRef}
                        onChange={(e) => handleFileUpload(e, 'resume')}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to upload Resume/CV</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX files, max 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* DISPLAY WHEN BOTH FILES ARE UPLOADED */}
                  {formData.linkedin && formData.resume && (
                    <Alert className="mb-4 bg-success-light border-success-border">
                      <div className="flex gap-2">
                        <div className="mt-0.5">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <AlertTitle className="mb-1 font-semibold text-success">
                            Both files uploaded successfully
                          </AlertTitle>
                          <AlertDescription className="text-sm text-success">
                            Great job! You've uploaded both your LinkedIn PDF and resume. 
                            This will give us the most complete picture of your professional background.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  )}
                  
                  {/* SUPPORTING DOCUMENTS SECTION */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-3 rounded-full mr-3">
                            <Paperclip className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Supporting Documents & Links (Optional)</h3>
                            <p className="text-sm text-muted-foreground">
                              Add publications, news articles, portfolios, or other resources that showcase your work
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSupportingDocs(!showSupportingDocs)}
                        type="button"
                      >
                        {showSupportingDocs ? 'Hide Form' : 'Add Documents'}
                      </Button>
                    </div>
                    
                    <Alert className="mb-4 bg-info-light border-info-border">
                      <div className="flex gap-2">
                        <div className="mt-0.5">
                          <HelpCircle className="h-5 w-5 text-info" />
                        </div>
                        <div>
                          <AlertTitle className="mb-1 font-semibold text-info">
                            Enhanced Profile Quality
                          </AlertTitle>
                          <AlertDescription className="text-sm text-info">
                            The more supporting materials you provide, the stronger and more complete your profile will be. These additions help us present a well-rounded and accurate representation of your professional expertise.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                    
                    {/* Display existing supporting documents */}
                    {formData.supportingDocuments && formData.supportingDocuments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Added Documents & Links</h4>
                        <div className="space-y-2">
                          {formData.supportingDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded border">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded bg-primary/10">
                                  {doc.type === 'file' ? (
                                    <File className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Link className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{doc.title || doc.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {doc.type === 'file' ? `File: ${doc.name}` : `Link: ${doc.url}`}
                                  </p>
                                  {doc.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSupportingDocument(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Supporting documents form */}
                    {showSupportingDocs && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            variant={supportingDocType === 'link' ? 'default' : 'outline'}
                            onClick={() => setSupportingDocType('link')}
                            type="button"
                          >
                            Link
                          </Button>
                          <Button
                            variant={supportingDocType === 'file' ? 'default' : 'outline'}
                            onClick={() => setSupportingDocType('file')}
                            type="button"
                          >
                            File
                          </Button>
                        </div>

                        {supportingDocType === 'link' ? (
                          <>
                            <div>
                              <Label htmlFor="supportingDocUrl">URL *</Label>
                              <Input
                                id="supportingDocUrl"
                                value={supportingDocUrl}
                                onChange={(e) => setSupportingDocUrl(e.target.value)}
                                placeholder="https://example.com/portfolio"
                              />
                            </div>
                            <div>
                              <Label htmlFor="supportingDocTitle">Title</Label>
                              <Input
                                id="supportingDocTitle"
                                value={supportingDocTitle}
                                onChange={(e) => setSupportingDocTitle(e.target.value)}
                                placeholder="Portfolio, Publication, etc."
                              />
                            </div>
                            <div>
                              <Label htmlFor="supportingDocDescription">Description</Label>
                              <Textarea
                                id="supportingDocDescription"
                                value={supportingDocDescription}
                                onChange={(e) => setSupportingDocDescription(e.target.value)}
                                placeholder="Brief description of the link"
                                rows={2}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="supportingDocFile">File *</Label>
                              <Input
                                id="supportingDocFile"
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setSupportingDocFile(e.target.files[0]);
                                  } else {
                                    setSupportingDocFile(null);
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="supportingDocTitleFile">Title</Label>
                              <Input
                                id="supportingDocTitleFile"
                                value={supportingDocTitle}
                                onChange={(e) => setSupportingDocTitle(e.target.value)}
                                placeholder="Portfolio, Publication, etc."
                              />
                            </div>
                            <div>
                              <Label htmlFor="supportingDocDescriptionFile">Description</Label>
                              <Textarea
                                id="supportingDocDescriptionFile"
                                value={supportingDocDescription}
                                onChange={(e) => setSupportingDocDescription(e.target.value)}
                                placeholder="Brief description of the file"
                                rows={2}
                              />
                            </div>
                          </>
                        )}

                        <div className="flex justify-end">
                          <Button
                            onClick={handleAddSupportingDocument}
                            disabled={isSubmitting}
                            type="button"
                          >
                            Add Document
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SWITCH TO MANUAL ENTRY */}
                  <div className="text-center mt-6">
                    <Button
                      variant="link"
                      onClick={() => setShowManualEntry(true)}
                      className="text-sm"
                      type="button"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Enter manually instead
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Manual Profile Entry</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowManualEntry(false)}
                      type="button"
                    >
                      Back to import options
                    </Button>
                  </div>
                  
                  {isUsingLinkedInInfo && (
                    <Alert variant="default" className="bg-primary/10 border-primary/30 mb-4">
                      <Linkedin className="h-4 w-4 text-primary" />
                      <AlertTitle>LinkedIn Profile Information Applied</AlertTitle>
                      <AlertDescription>
                        Your profile information has been pre-filled with data from your LinkedIn account. You can edit any fields as needed.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Manual form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentPosition">Current Position *</Label>
                    <Input
                      id="currentPosition"
                      value={formData.currentPosition || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPosition: e.target.value }))}
                      placeholder="e.g., Senior Product Manager"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Current Company</Label>
                    <Input
                      id="company"
                      value={formData.company || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your current company"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsExperience || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                      placeholder="Enter years of experience"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Key Skills *</Label>
                    <Input
                      id="skills"
                      value={formData.skills || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="e.g., Product Strategy, User Research, Agile (comma-separated)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary *</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Provide a brief summary of your professional background and key achievements..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </StepCardContent>
          </StepCard>

          {/* FOOTER: NAV BUTTONS */}
          <StepCardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !hasRequiredDocuments}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ProfileCreation;
