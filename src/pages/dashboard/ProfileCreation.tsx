import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, ArrowRight, ArrowLeft, File, Clock, HelpCircle, Linkedin, Copy, AlertCircle, Link, FileText, Trash2, Plus, Paperclip } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Design',
  'Construction',
  'Transportation',
  'Hospitality',
  'Other'
];

const experienceLevels = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (6-10 years)',
  'Executive (10+ years)'
];

const LINKEDIN_PDF_GUIDE_URL =
  "https://www.linkedin.com/help/linkedin/answer/a521735/how-to-save-a-profile-as-a-pdf?lang=en";

type ProfileData = {
  linkedin?: File;
  resume?: File;
  docs: Array<{ title: string; file: File }>;
  links: Array<{ title: string; link: string }>;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  company: string;
  industry: string;
  experienceLevel: string;
  summary: string;
  skills: string;
};

const ProfileCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const [profile, setProfile] = useState<ProfileData>({
    docs: [],
    links: []
  });
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPosition: '',
    company: '',
    industry: '',
    experienceLevel: '',
    summary: '',
    skills: ''
  });
  
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showSupportingDocs, setShowSupportingDocs] = useState(false);
  const [isLinkedInUser, setIsLinkedInUser] = useState(false);
  const [isUsingLinkedInInfo, setIsUsingLinkedInInfo] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState('');
  
  // Current document being added
  const [currentDoc, setCurrentDoc] = useState({
    type: 'document' as 'document' | 'link',
    title: '',
    description: '',
    url: '',
    fileName: ''
  });
  
  // Effect to check if the user signed up with LinkedIn
  useEffect(() => {
    const authMethod = localStorage.getItem('authMethod');
    if (authMethod === 'linkedin' || location.state?.linkedInSignUp) {
      setIsLinkedInUser(true);
    }
  }, [location]);
  
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed', estimatedTime: '2-3 minutes' },
    { id: 2, name: 'Create Profile', description: 'Enter your information', status: 'current', estimatedTime: '5-7 minutes' },
    { id: 3, name: 'Review Profile', description: 'Review your profile', status: 'upcoming', estimatedTime: '3-5 minutes' }
  ];
  
  // Handlers
  const handleLinkedInUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfile(prev => ({ ...prev, linkedin: file }));
      
      toast({
        title: "LinkedIn PDF uploaded",
        description: "Your LinkedIn profile PDF was successfully uploaded."
      });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfile(prev => ({ ...prev, resume: file }));
      
      toast({
        title: "Resume uploaded",
        description: "Your resume was successfully uploaded."
      });
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCurrentDoc(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const addSupportingDocument = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (currentDoc.type === 'document' && !currentDoc.fileName) {
      toast({
        title: "Please select a file",
        description: "You must upload a document before adding it.",
        variant: "destructive"
      });
      return;
    }

    if (currentDoc.type === 'link' && !currentDoc.url) {
      toast({
        title: "Please enter a URL",
        description: "You must provide a valid URL for your link.",
        variant: "destructive"
      });
      return;
    }

    if (!currentDoc.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your document or link.",
        variant: "destructive"
      });
      return;
    }

    if (currentDoc.type === 'document') {
      const fileInput = document.getElementById('doc-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        setProfile(prev => ({
          ...prev,
          docs: [...prev.docs, { title: currentDoc.title, file: fileInput.files![0] }]
        }));
      }
    } else {
      setProfile(prev => ({
        ...prev,
        links: [...prev.links, { title: currentDoc.title, link: currentDoc.url }]
      }));
    }

    // Reset current document
    setCurrentDoc({
      type: 'document',
      title: '',
      description: '',
      url: '',
      fileName: ''
    });
    
    toast({
      title: "Added successfully",
      description: `Your ${currentDoc.type} has been added to your profile.`
    });
  };

  const removeDocument = (index: number, type: 'docs' | 'links') => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
    
    toast({
      title: "Item removed",
      description: "The document or link has been removed from your profile."
    });
  };

  const removeProfileDocument = (type: 'linkedin' | 'resume') => {
    setProfile(prev => {
      const newProfile = { ...prev };
      delete newProfile[type];
      return newProfile;
    });
    
    toast({
      title: "Document removed",
      description: "The profile document has been removed."
    });
  };
  
  const validateProfile = (): string[] => {
    const errors: string[] = [];
    
    if (!profile.linkedin && !profile.resume) {
      errors.push('At least one of the following is required: LinkedIn PDF or Resume');
    }
    
    if (!profile.linkedin && !profile.resume && (!formData.firstName || !formData.lastName)) {
      errors.push('First name and last name are required when not uploading documents');
    }
    
    return errors;
  };
  
  const submitProfileData = async () => {
    const errors = validateProfile();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    setValidationErrors([]);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const formDataToSubmit = new FormData();

      // Add user ID to the form data
      formDataToSubmit.append('userId', user.id);

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSubmit.append(key, value);
        }
      });
      
      // Add profile documents
      if (profile.linkedin) {
        formDataToSubmit.append('linkedin', profile.linkedin);
      }
      if (profile.resume) {
        formDataToSubmit.append('resume', profile.resume);
      }
      
      // Add supporting documents
      profile.docs.forEach((doc, index) => {
        formDataToSubmit.append(`docs[${index}][title]`, doc.title);
        formDataToSubmit.append(`docs[${index}][file]`, doc.file);
      });
      
      // Add links
      profile.links.forEach((link, index) => {
        formDataToSubmit.append(`links[${index}][title]`, link.title);
        formDataToSubmit.append(`links[${index}][link]`, link.link);
      });
      
      // Send POST request to webhook
      const response = await fetch('https://primary-production-1687b.up.railway.app/webhook-test/d4245ae6-e289-47aa-95b4-26a93b75f7d9', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // Parse the response to check for success
      const responseData = await response.json();
      console.log('Webhook response:', responseData);
      
      // Update profile_created flag in Supabase BEFORE redirecting
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          profile_created: true,
          profile_data: {
            formData,
            uploadedFiles: {
              hasLinkedIn: !!profile.linkedin,
              hasResume: !!profile.resume,
              linkedInFileName: profile.linkedin?.name,
              resumeFileName: profile.resume?.name
            },
            supportingDocs: profile.docs.map(doc => ({
              title: doc.title,
              fileName: doc.file.name
            })),
            supportingLinks: profile.links,
            submittedAt: new Date().toISOString(),
            webhookResponse: responseData
          },
          profile_version: '0.1'
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error updating profile data:', profileError);
        throw new Error('Failed to update profile status in database');
      }
      
      // Store completion status in localStorage
      const completedSections = JSON.parse(localStorage.getItem('completedSections') || '{}');
      completedSections.profile = true;
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      
      toast({
        title: "Profile saved successfully",
        description: "Your profile information has been submitted and processed."
      });
      
      // Invalidate React Query cache for profile data to ensure fresh data
      await queryClient.invalidateQueries(['profile', user.id]);
      
      // Redirect to profile snapshot page
      navigate('/dashboard/profile-snapshot');
      
    } catch (error) {
      console.error('Error submitting profile:', error);
      let errorMessage = "There was a problem submitting your profile. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Unable to connect to the server. Please check your internet connection and try submitting again.";
        } else if (error.message.includes("Server error")) {
          errorMessage = "The server encountered an error processing your profile. Please try submitting again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setServerError(errorMessage);
      
      toast({
        title: "Error saving profile",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProfileData();
  };

  const requestEmailVerification = () => {
    setTimeout(() => {
      setIsEmailVerified(true);
      toast({
        title: "Email verified",
        description: "Your email address has been verified successfully."
      });
    }, 1500);
  };

  const handleUseLinkedInInfo = () => {
    setIsUsingLinkedInInfo(true);
    setFormData({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      currentPosition: "Product Manager",
      company: "Tech Innovations Inc.",
      industry: "technology",
      experienceLevel: "mid level (3-5 years)",
      summary: "Experienced product manager with 5 years in the technology sector. Skilled in agile methodologies, user experience design, and cross-functional team leadership. Passionate about creating innovative solutions that solve real-world problems.",
      skills: "Product Strategy, User Research, Agile/Scrum, Roadmap Planning, Cross-functional Leadership"
    });
    setShowManualEntry(true);
    
    toast({
      title: "LinkedIn information applied",
      description: "Your LinkedIn profile information has been used to pre-fill your profile."
    });
  };

  const hasRequiredDocuments = profile.linkedin || profile.resume;

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

              {/* COMBINED INSTRUCTIONAL HELPER TEXT */}
              <Alert className="mb-4 bg-blue-50 border-blue-200">
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
                      You can continue filling out the form and try submitting again later.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {!showManualEntry ? (
                <div className="space-y-6">
                  {/* UPLOADED DOCUMENTS DISPLAY */}
                  {(profile.linkedin || profile.resume) && (
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <h3 className="font-medium mb-3 text-green-800">Uploaded Documents</h3>
                      <div className="space-y-2">
                        {profile.linkedin && (
                          <div className="flex items-center justify-between p-2 rounded bg-green-100 border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-green-200">
                                <Linkedin className="h-4 w-4 text-green-700" />
                              </div>
                              <div>
                                <p className="font-medium text-green-800">LinkedIn</p>
                                <p className="text-xs text-green-600">{profile.linkedin.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProfileDocument('linkedin')}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {profile.resume && (
                          <div className="flex items-center justify-between p-2 rounded bg-green-100 border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-green-200">
                                <File className="h-4 w-4 text-green-700" />
                              </div>
                              <div>
                                <p className="font-medium text-green-800">Resume</p>
                                <p className="text-xs text-green-600">{profile.resume.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProfileDocument('resume')}
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

                  {/* LINKEDIN PDF UPLOAD SEGMENT */}
                  <div className="border rounded-lg p-6 mb-2">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#0A66C2]/10 p-3 rounded-full mr-3">
                        <Linkedin className="h-6 w-6 text-[#0A66C2]" />
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
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      {profile.linkedin ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-3">
                            <File className="h-6 w-6 text-primary" />
                          </div>
                          <p className="mb-1 font-medium">LinkedIn PDF uploaded successfully</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {profile.linkedin.name}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('linkedin-pdf-upload')?.click()}
                            type="button"
                          >
                            Replace
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-muted/50 p-3 rounded-full mb-3">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="mb-1 font-medium">Drag and drop your LinkedIn PDF here</p>
                          <p className="text-sm text-muted-foreground mb-3">PDF up to 5MB</p>
                          <div>
                            <label htmlFor="linkedin-pdf-upload">
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
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RESUME UPLOAD SEGMENT */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-3 rounded-full mr-3">
                        <File className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Resume Upload</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload your resume and we'll extract the relevant information to help enhance your profile.
                        </p>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      {profile.resume ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-3">
                            <File className="h-6 w-6 text-primary" />
                          </div>
                          <p className="mb-1 font-medium">Resume uploaded successfully</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {profile.resume.name}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('resume')?.click()}
                            type="button"
                          >
                            Replace
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-muted/50 p-3 rounded-full mb-3">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="mb-1 font-medium">Drag and drop your resume here</p>
                          <p className="text-sm text-muted-foreground mb-3">Supports PDF, DOCX, up to 5MB</p>
                          <div>
                            <label htmlFor="resume">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  document.getElementById('resume')?.click()
                                }
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
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DISPLAY WHEN BOTH FILES ARE UPLOADED */}
                  {profile.linkedin && profile.resume && (
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
                    
                    <Alert className="mb-4 bg-blue-50 border-blue-200">
                      <div className="flex gap-2">
                        <div className="mt-0.5">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <AlertTitle className="mb-1 font-semibold text-blue-800">
                            Enhanced Profile Quality
                          </AlertTitle>
                          <AlertDescription className="text-sm text-blue-900">
                            The more supporting materials you provide, the stronger and more complete your profile will be. These additions help us present a well-rounded and accurate representation of your professional expertise.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                    
                    {showSupportingDocs && (
                      <Card className="border border-border/60">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Add New Supporting Material</h3>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant={currentDoc.type === 'document' ? 'secondary' : 'outline'} 
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentDoc(prev => ({ ...prev, type: 'document' }));
                                }}
                                type="button"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Document
                              </Button>
                              <Button 
                                variant={currentDoc.type === 'link' ? 'secondary' : 'outline'} 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentDoc(prev => ({ ...prev, type: 'link' }));
                                }}
                                type="button"
                              >
                                <Link className="h-4 w-4 mr-1" />
                                Link
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="doc-title">Title*</Label>
                              <Input 
                                id="doc-title" 
                                placeholder={currentDoc.type === 'document' ? "Document Title" : "Link Title"}
                                value={currentDoc.title}
                                onChange={(e) => setCurrentDoc(prev => ({ ...prev, title: e.target.value }))}
                              />
                            </div>
                            
                            {currentDoc.type === 'document' ? (
                              <div>
                                <Label htmlFor="doc-upload">Upload File*</Label>
                                <div className="mt-1 flex items-center">
                                  <Button 
                                    variant="outline" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      document.getElementById('doc-upload')?.click();
                                    }}
                                    type="button"
                                    className="w-full justify-start text-muted-foreground"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {currentDoc.fileName || "Select File"}
                                  </Button>
                                  <input 
                                    id="doc-upload" 
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" 
                                    onChange={handleDocumentUpload}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Supports PDF, DOCX, PPTX, and common image formats up to 10MB
                                </p>
                              </div>
                            ) : (
                              <div>
                                <Label htmlFor="doc-url">URL*</Label>
                                <Input 
                                  id="doc-url" 
                                  placeholder="https://"
                                  value={currentDoc.url}
                                  onChange={(e) => setCurrentDoc(prev => ({ ...prev, url: e.target.value }))}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="doc-description">Description (Optional)</Label>
                            <Textarea 
                              id="doc-description" 
                              placeholder="Briefly describe this resource..."
                              value={currentDoc.description}
                              onChange={(e) => setCurrentDoc(prev => ({ ...prev, description: e.target.value }))}
                              className="resize-none"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button
                              onClick={addSupportingDocument}
                              type="button"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add {currentDoc.type === 'document' ? 'Document' : 'Link'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {(profile.docs.length > 0 || profile.links.length > 0) && (
                      <div className="space-y-3 mt-6">
                        <h3 className="font-medium">Added Documents & Links</h3>
                        <div className="space-y-3">
                          {profile.docs.map((doc, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 rounded-md border border-border/60 bg-background"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                
                                <div>
                                  <p className="font-medium">{doc.title}</p>
                                  <p className="text-xs text-muted-foreground">{doc.file.name}</p>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeDocument(index, 'docs')}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {profile.links.map((link, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 rounded-md border border-border/60 bg-background"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  <Link className="h-5 w-5 text-primary" />
                                </div>
                                
                                <div>
                                  <p className="font-medium">{link.title}</p>
                                  <p className="text-xs text-primary truncate max-w-[200px] md:max-w-[300px]">
                                    {link.link}
                                  </p>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeDocument(index, 'links')}
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
                    <Alert variant="default" className="bg-[#0A66C2]/10 border-[#0A66C2]/30 mb-4">
                      <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                      <AlertTitle>LinkedIn Profile Information Applied</AlertTitle>
                      <AlertDescription>
                        Your profile information has been pre-filled with data from your LinkedIn account. You can edit any fields as needed.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email">Email</Label>
                          <Badge variant={isEmailVerified ? "default" : "outline"} className="ml-2">
                            {isEmailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleFormChange}
                          />
                          {!isEmailVerified && (
                            <Button type="button" variant="outline" size="sm" onClick={requestEmailVerification}>
                              Verify
                            </Button>
                          )}
                        </div>
                        {!isEmailVerified && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Verification helps ensure profile authenticity
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="currentPosition">Current Position</Label>
                        <Input 
                          id="currentPosition" 
                          value={formData.currentPosition} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select 
                          value={formData.industry}
                          onValueChange={(value) => handleSelectChange('industry', value)}
                        >
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry.toLowerCase()}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="company">Current Company</Label>
                        <Input 
                          id="company" 
                          value={formData.company} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select 
                          value={formData.experienceLevel}
                          onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                        >
                          <SelectTrigger id="experience">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map(level => (
                              <SelectItem key={level} value={level.toLowerCase()}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea 
                        id="summary" 
                        placeholder="Briefly describe your professional background, key skills, and career goals..."
                        className="min-h-[120px]"
                        value={formData.summary}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Key Skills (comma separated)</Label>
                      <Input 
                        id="skills" 
                        placeholder="e.g., Project Management, JavaScript, Data Analysis, Leadership"
                        value={formData.skills}
                        onChange={handleFormChange}
                      />
                    </div>
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
