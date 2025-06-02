
import { useState, useEffect, useReducer } from 'react';
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
import { Upload, ArrowRight, ArrowLeft, File, Clock, HelpCircle, Linkedin, FileSpreadsheet, Copy, AlertCircle, Link, FileText, Trash2, Plus, FileImage, Paperclip } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

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

// Profile document type
type ProfileDocument = {
  type: 'linkedin' | 'resume' | 'other';
  file: File;
  title?: string;
  description?: string;
};

// Supporting document type
type SupportingDocument = {
  type: 'document' | 'link';
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  url?: string;
};

// Define our state shape
interface ProfileState {
  // Form data
  formData: {
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
  // New simplified file structure
  profileDocuments: ProfileDocument[];
  // Supporting documents
  supportingFiles: Map<string, File>;
  supportingDocuments: SupportingDocument[];
  currentDoc: {
    type: 'document' | 'link';
    title: string;
    description: string;
    url: string;
    fileName: string;
  };
  // UI state
  showManualEntry: boolean;
  showSupportingDocs: boolean;
  isEmailVerified: boolean;
  isSubmitting: boolean;
  serverError: string;
  validationErrors: string[];
  // Context state
  isLinkedInUser: boolean;
  isUsingLinkedInInfo: boolean;
}

// Define actions for our reducer
type ProfileAction =
  | { type: 'UPDATE_FORM_FIELD'; field: string; value: string }
  | { type: 'ADD_PROFILE_DOCUMENT'; document: ProfileDocument }
  | { type: 'REMOVE_PROFILE_DOCUMENT'; index: number }
  | { type: 'SET_SUPPORTING_FILE'; title: string; file: File }
  | { type: 'UPDATE_DOC_FIELD'; field: keyof ProfileState['currentDoc']; value: string }
  | { type: 'TOGGLE_MANUAL_ENTRY'; value: boolean }
  | { type: 'TOGGLE_SUPPORTING_DOCS' }
  | { type: 'ADD_SUPPORTING_DOCUMENT'; document: SupportingDocument }
  | { type: 'REMOVE_SUPPORTING_DOCUMENT'; index: number }
  | { type: 'SET_EMAIL_VERIFIED'; value: boolean }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_SERVER_ERROR'; error: string }
  | { type: 'SET_VALIDATION_ERRORS'; errors: string[] }
  | { type: 'SET_LINKEDIN_USER'; value: boolean }
  | { type: 'USE_LINKEDIN_INFO'; value: boolean };

// Initial state for our reducer
const initialState: ProfileState = {
  formData: {
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
  },
  profileDocuments: [],
  supportingFiles: new Map(),
  supportingDocuments: [],
  currentDoc: {
    type: 'document',
    title: '',
    description: '',
    url: '',
    fileName: ''
  },
  showManualEntry: false,
  showSupportingDocs: false,
  isEmailVerified: false,
  isSubmitting: false,
  serverError: '',
  validationErrors: [],
  isLinkedInUser: false,
  isUsingLinkedInInfo: false
};

// Reducer function to handle all state changes
function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };
    case 'ADD_PROFILE_DOCUMENT':
      return {
        ...state,
        profileDocuments: [...state.profileDocuments, action.document]
      };
    case 'REMOVE_PROFILE_DOCUMENT': {
      const newDocs = [...state.profileDocuments];
      newDocs.splice(action.index, 1);
      return { ...state, profileDocuments: newDocs };
    }
    case 'SET_SUPPORTING_FILE': {
      const newMap = new Map(state.supportingFiles);
      newMap.set(action.title, action.file);
      return { ...state, supportingFiles: newMap };
    }
    case 'UPDATE_DOC_FIELD':
      return {
        ...state,
        currentDoc: { ...state.currentDoc, [action.field]: action.value }
      };
    case 'TOGGLE_MANUAL_ENTRY':
      return { ...state, showManualEntry: action.value };
    case 'TOGGLE_SUPPORTING_DOCS':
      return { ...state, showSupportingDocs: !state.showSupportingDocs };
    case 'ADD_SUPPORTING_DOCUMENT':
      return {
        ...state,
        supportingDocuments: [...state.supportingDocuments, action.document],
        // Reset current document fields
        currentDoc: {
          type: 'document',
          title: '',
          description: '',
          url: '',
          fileName: ''
        }
      };
    case 'REMOVE_SUPPORTING_DOCUMENT': {
      const newDocs = [...state.supportingDocuments];
      newDocs.splice(action.index, 1);
      return { ...state, supportingDocuments: newDocs };
    }
    case 'SET_EMAIL_VERIFIED':
      return { ...state, isEmailVerified: action.value };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'SET_SERVER_ERROR':
      return { ...state, serverError: action.error };
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.errors };
    case 'SET_LINKEDIN_USER':
      return { ...state, isLinkedInUser: action.value };
    case 'USE_LINKEDIN_INFO':
      // In a real implementation, we would also update the form data here
      // with the LinkedIn information
      return {
        ...state,
        isUsingLinkedInInfo: action.value,
        showManualEntry: true,
        formData: action.value ? {
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
        } : state.formData
      };
    default:
      return state;
  }
}

// Validation function
const validateProfileData = (profileDocuments: ProfileDocument[], formData: any): string[] => {
  const errors: string[] = [];
  
  // Check if at least one required document is uploaded
  const hasLinkedIn = profileDocuments.some(doc => doc.type === 'linkedin');
  const hasResume = profileDocuments.some(doc => doc.type === 'resume');
  
  if (!hasLinkedIn && !hasResume) {
    errors.push('At least one of the following is required: LinkedIn PDF or Resume');
  }
  
  // If manual entry is being used, validate basic required fields
  if (!hasLinkedIn && !hasResume && (!formData.firstName || !formData.lastName)) {
    errors.push('First name and last name are required when not uploading documents');
  }
  
  return errors;
};

const ProfileCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(profileReducer, initialState);
  
  // Derived state
  const hasLinkedInDoc = state.profileDocuments.some(doc => doc.type === 'linkedin');
  const hasResumeDoc = state.profileDocuments.some(doc => doc.type === 'resume');
  const hasRequiredDocuments = hasLinkedInDoc || hasResumeDoc;
  
  // Effect to check if the user signed up with LinkedIn
  useEffect(() => {
    const authMethod = localStorage.getItem('authMethod');
    if (authMethod === 'linkedin' || location.state?.linkedInSignUp) {
      dispatch({ type: 'SET_LINKEDIN_USER', value: true });
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
      
      // Remove existing LinkedIn document if any
      const filteredDocs = state.profileDocuments.filter(doc => doc.type !== 'linkedin');
      dispatch({ type: 'REMOVE_PROFILE_DOCUMENT', index: -1 });
      
      // Add new LinkedIn document
      dispatch({ type: 'ADD_PROFILE_DOCUMENT', document: { type: 'linkedin', file } });
      
      toast({
        title: "LinkedIn PDF uploaded",
        description: "Your LinkedIn profile PDF was successfully uploaded."
      });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Remove existing resume document if any
      const filteredDocs = state.profileDocuments.filter(doc => doc.type !== 'resume');
      dispatch({ type: 'REMOVE_PROFILE_DOCUMENT', index: -1 });
      
      // Add new resume document
      dispatch({ type: 'ADD_PROFILE_DOCUMENT', document: { type: 'resume', file } });
      
      toast({
        title: "Resume uploaded",
        description: "Your resume was successfully uploaded."
      });
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    dispatch({ type: 'UPDATE_FORM_FIELD', field: id, value });
  };

  const handleSelectChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_FIELD', field, value });
  };
  
  const submitProfileData = async () => {
    // Validate before submission
    const errors = validateProfileData(state.profileDocuments, state.formData);
    if (errors.length > 0) {
      dispatch({ type: 'SET_VALIDATION_ERRORS', errors });
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'SET_SUBMITTING', value: true });
    dispatch({ type: 'SET_SERVER_ERROR', error: '' });
    dispatch({ type: 'SET_VALIDATION_ERRORS', errors: [] });
    
    try {
      const formDataToSubmit = new FormData();

      // Add form data
      Object.entries(state.formData).forEach(([key, value]) => {
        if (value) {
          formDataToSubmit.append(key, value);
        }
      });
      
      // Add profile documents array
      state.profileDocuments.forEach((doc, index) => {
        formDataToSubmit.append(`profileDocuments[${index}][type]`, doc.type);
        formDataToSubmit.append(`profileDocuments[${index}][file]`, doc.file);
        if (doc.title) {
          formDataToSubmit.append(`profileDocuments[${index}][title]`, doc.title);
        }
        if (doc.description) {
          formDataToSubmit.append(`profileDocuments[${index}][description]`, doc.description);
        }
      });
      
      // Add supporting documents
      state.supportingDocuments.forEach((doc, index) => {
        formDataToSubmit.append(`supportingDocuments[${index}][type]`, doc.type);
        formDataToSubmit.append(`supportingDocuments[${index}][title]`, doc.title);
        
        if (doc.description) {
          formDataToSubmit.append(`supportingDocuments[${index}][description]`, doc.description);
        }
        
        if (doc.type === 'document' && state.supportingFiles.has(doc.title)) {
          const file = state.supportingFiles.get(doc.title);
          if (file) {
            formDataToSubmit.append(`supportingDocuments[${index}][file]`, file);
          }
        }
        
        if (doc.type === 'link' && doc.url) {
          formDataToSubmit.append(`supportingDocuments[${index}][url]`, doc.url);
        }
      });
      
      // Send POST request to webhook
      const response = await fetch('https://primary-production-1687b.up.railway.app/webhook-test/d4245ae6-e289-47aa-95b4-26a93b75f7d9', {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      // Update profile_created flag in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ profile_created: true })
          .eq('id', user.id);
        
        if (profileError) {
          console.error('Error updating profile_created flag:', profileError);
        }
      }
      
      // Store completion status in localStorage
      const completedSections = JSON.parse(localStorage.getItem('completedSections') || '{}');
      completedSections.profile = true;
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      
      toast({
        title: "Profile saved successfully",
        description: "Your profile information has been submitted."
      });
      
      navigate('/dashboard/profile-snapshot');
    } catch (error) {
      console.error('Error submitting profile:', error);
      let errorMessage = "There was a problem submitting your profile.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("Failed to fetch")) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        dispatch({ type: 'SET_SERVER_ERROR', error: errorMessage });
      }
      
      toast({
        title: "Error saving profile",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProfileData();
  };

  const requestEmailVerification = () => {
    setTimeout(() => {
      dispatch({ type: 'SET_EMAIL_VERIFIED', value: true });
      toast({
        title: "Email verified",
        description: "Your email address has been verified successfully."
      });
    }, 1500);
  };

  const handleUseLinkedInInfo = () => {
    dispatch({ type: 'USE_LINKEDIN_INFO', value: true });
    toast({
      title: "LinkedIn information applied",
      description: "Your LinkedIn profile information has been used to pre-fill your profile."
    });
  };

  const handleConnectLinkedIn = () => {
    // In a real app, this would trigger OAuth
    toast({
      title: "LinkedIn Connected",
      description: "Your LinkedIn account has been connected successfully."
    });
    
    // Simulate connection
    setTimeout(() => {
      handleUseLinkedInInfo();
    }, 1000);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      dispatch({ type: 'UPDATE_DOC_FIELD', field: 'fileName', value: file.name });
      
      if (state.currentDoc.title) {
        dispatch({ type: 'SET_SUPPORTING_FILE', title: state.currentDoc.title, file });
      }
    }
  };

  const addSupportingDocument = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (state.currentDoc.type === 'document' && !state.currentDoc.fileName) {
      toast({
        title: "Please select a file",
        description: "You must upload a document before adding it.",
        variant: "destructive"
      });
      return;
    }

    if (state.currentDoc.type === 'link' && !state.currentDoc.url) {
      toast({
        title: "Please enter a URL",
        description: "You must provide a valid URL for your link.",
        variant: "destructive"
      });
      return;
    }

    if (!state.currentDoc.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your document or link.",
        variant: "destructive"
      });
      return;
    }

    const newDoc: SupportingDocument = {
      type: state.currentDoc.type,
      title: state.currentDoc.title,
      description: state.currentDoc.description || undefined,
      fileUrl: state.currentDoc.type === 'document' ? 'file-url-would-go-here' : undefined,
      fileName: state.currentDoc.type === 'document' ? state.currentDoc.fileName : undefined,
      url: state.currentDoc.type === 'link' ? state.currentDoc.url : undefined,
    };

    dispatch({ type: 'ADD_SUPPORTING_DOCUMENT', document: newDoc });
    
    toast({
      title: "Added successfully",
      description: `Your ${state.currentDoc.type} has been added to your profile.`
    });
  };

  const removeDocument = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'REMOVE_SUPPORTING_DOCUMENT', index });
    
    toast({
      title: "Item removed",
      description: "The document or link has been removed from your profile."
    });
  };

  const removeProfileDocument = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'REMOVE_PROFILE_DOCUMENT', index });
    
    toast({
      title: "Document removed",
      description: "The profile document has been removed."
    });
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
              <div className="flex items-center mt-2 bg-muted/40 px-3 py-2 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  Estimated completion time: <strong>5-7 minutes</strong>
                </span>
              </div>
            </StepCardHeader>

            <StepCardContent>

              {/* VALIDATION ERRORS */}
              {state.validationErrors.length > 0 && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="mb-1 font-semibold text-red-800">
                    Validation Error
                  </AlertTitle>
                  <AlertDescription className="text-sm text-red-900">
                    <ul className="list-disc ml-4">
                      {state.validationErrors.map((error, index) => (
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
                    {state.isLinkedInUser ? <Linkedin className="h-5 w-5 text-[#0A66C2]" /> : <HelpCircle className="h-5 w-5 text-blue-600" />}
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
                      
                      {state.isLinkedInUser && (
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
              {state.serverError && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="mb-1 font-semibold text-red-800">
                    Connection Error
                  </AlertTitle>
                  <AlertDescription className="text-sm text-red-900">
                    {state.serverError}
                    <p className="mt-1 text-xs">
                      You can continue filling out the form and try submitting again later.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {!state.showManualEntry ? (
                <div className="space-y-6">

                  {/* UPLOADED DOCUMENTS DISPLAY */}
                  {state.profileDocuments.length > 0 && (
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <h3 className="font-medium mb-3 text-green-800">Uploaded Documents</h3>
                      <div className="space-y-2">
                        {state.profileDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded bg-green-100 border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-green-200">
                                {doc.type === 'linkedin' ? (
                                  <Linkedin className="h-4 w-4 text-green-700" />
                                ) : (
                                  <File className="h-4 w-4 text-green-700" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-green-800 capitalize">{doc.type}</p>
                                <p className="text-xs text-green-600">{doc.file.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => removeProfileDocument(index, e)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
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
                      {hasLinkedInDoc ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-3">
                            <File className="h-6 w-6 text-primary" />
                          </div>
                          <p className="mb-1 font-medium">LinkedIn PDF uploaded successfully</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {state.profileDocuments.find(doc => doc.type === 'linkedin')?.file.name}
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
                      {hasResumeDoc ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-3">
                            <File className="h-6 w-6 text-primary" />
                          </div>
                          <p className="mb-1 font-medium">Resume uploaded successfully</p>
                          <p className="text-sm text-muted-foreground mb-3">
                            {state.profileDocuments.find(doc => doc.type === 'resume')?.file.name}
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
                  {hasLinkedInDoc && hasResumeDoc && (
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
                        onClick={() => dispatch({ type: 'TOGGLE_SUPPORTING_DOCS' })}
                        type="button"
                      >
                        {state.showSupportingDocs ? 'Hide Form' : 'Add Documents'}
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
                    
                    {state.showSupportingDocs && (
                      <Card className="border border-border/60">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Add New Supporting Material</h3>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant={state.currentDoc.type === 'document' ? 'secondary' : 'outline'} 
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch({ type: 'UPDATE_DOC_FIELD', field: 'type', value: 'document' });
                                }}
                                type="button"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Document
                              </Button>
                              <Button 
                                variant={state.currentDoc.type === 'link' ? 'secondary' : 'outline'} 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch({ type: 'UPDATE_DOC_FIELD', field: 'type', value: 'link' });
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
                                placeholder={state.currentDoc.type === 'document' ? "Document Title" : "Link Title"}
                                value={state.currentDoc.title}
                                onChange={(e) => dispatch({ 
                                  type: 'UPDATE_DOC_FIELD', 
                                  field: 'title', 
                                  value: e.target.value 
                                })}
                              />
                            </div>
                            
                            {state.currentDoc.type === 'document' ? (
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
                                    {state.currentDoc.fileName || "Select File"}
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
                                  value={state.currentDoc.url}
                                  onChange={(e) => dispatch({ 
                                    type: 'UPDATE_DOC_FIELD', 
                                    field: 'url', 
                                    value: e.target.value 
                                  })}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="doc-description">Description (Optional)</Label>
                            <Textarea 
                              id="doc-description" 
                              placeholder="Briefly describe this resource..."
                              value={state.currentDoc.description}
                              onChange={(e) => dispatch({ 
                                type: 'UPDATE_DOC_FIELD', 
                                field: 'description', 
                                value: e.target.value 
                              })}
                              className="resize-none"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button
                              onClick={addSupportingDocument}
                              type="button"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add {state.currentDoc.type === 'document' ? 'Document' : 'Link'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {state.supportingDocuments.length > 0 && (
                      <div className="space-y-3 mt-6">
                        <h3 className="font-medium">Added Documents & Links</h3>
                        <div className="space-y-3">
                          {state.supportingDocuments.map((doc, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-3 rounded-md border border-border/60 bg-background"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  {doc.type === 'document' ? (
                                    <FileText className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Link className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                
                                <div>
                                  <p className="font-medium">{doc.title}</p>
                                  {doc.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">{doc.description}</p>
                                  )}
                                  {doc.type === 'document' && doc.fileName && (
                                    <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                  )}
                                  {doc.type === 'link' && doc.url && (
                                    <p className="text-xs text-primary truncate max-w-[200px] md:max-w-[300px]">
                                      {doc.url}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => removeDocument(index, e)}
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
                      onClick={() => dispatch({ type: 'TOGGLE_MANUAL_ENTRY', value: true })}
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
                      onClick={() => dispatch({ type: 'TOGGLE_MANUAL_ENTRY', value: false })}
                      type="button"
                    >
                      Back to import options
                    </Button>
                  </div>
                  
                  {state.isUsingLinkedInInfo && (
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
                        <div className="flex items-center justify-between">
                          <Label htmlFor="firstName">First Name</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Your first name as it appears on official documents.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input 
                          id="firstName" 
                          value={state.formData.firstName} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email">Email</Label>
                          <Badge variant={state.isEmailVerified ? "success" : "outline"} className="ml-2">
                            {state.isEmailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Input 
                            id="email" 
                            type="email" 
                            value={state.formData.email} 
                            onChange={handleFormChange}
                          />
                          {!state.isEmailVerified && (
                            <Button type="button" variant="outline" size="sm" onClick={requestEmailVerification}>
                              Verify
                            </Button>
                          )}
                        </div>
                        {!state.isEmailVerified && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Verification helps ensure profile authenticity
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="currentPosition">Current Position</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Your current job title. If you're between jobs, enter your most recent position.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input 
                          id="currentPosition" 
                          value={state.formData.currentPosition} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="industry">Industry</Label>
                        </div>
                        <Select 
                          value={state.formData.industry}
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
                          value={state.formData.lastName} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={state.formData.phone} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="company">Current Company</Label>
                        <Input 
                          id="company" 
                          value={state.formData.company} 
                          onChange={handleFormChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select 
                          value={state.formData.experienceLevel}
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
                        value={state.formData.summary}
                        onChange={handleFormChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Key Skills (comma separated)</Label>
                      <Input 
                        id="skills" 
                        placeholder="e.g., Project Management, JavaScript, Data Analysis, Leadership"
                        value={state.formData.skills}
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
              disabled={state.isSubmitting || !hasRequiredDocuments}
            >
              {state.isSubmitting ? 'Saving...' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ProfileCreation;
