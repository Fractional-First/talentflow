
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, Copy, Paperclip } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { ManualProfileEntry } from '@/components/profile/ManualProfileEntry';
import { DocumentUpload } from '@/components/profile/DocumentUpload';

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
  
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isLinkedInUser, setIsLinkedInUser] = useState(false);
  const [isUsingLinkedInInfo, setIsUsingLinkedInInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  
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
  
  const handleUseLinkedInInfo = () => {
    setIsUsingLinkedInInfo(true);
    setShowManualEntry(true);
    
    toast({
      title: "LinkedIn information applied",
      description: "Your LinkedIn profile information has been used to pre-fill your profile."
    });
  };

  const submitProfileData = async (data: FormData | { linkedin?: File; resume?: File }, isManual: boolean) => {
    setIsSubmitting(true);
    setServerError('');
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('userId', user.id);

      if (isManual) {
        // Handle manual form data
        const formData = data as FormData;
        Object.entries(formData).forEach(([key, value]) => {
          if (value) {
            formDataToSubmit.append(key, value);
          }
        });
      } else {
        // Handle file uploads
        const fileData = data as { linkedin?: File; resume?: File };
        if (fileData.linkedin) {
          formDataToSubmit.append('linkedin', fileData.linkedin);
        }
        if (fileData.resume) {
          formDataToSubmit.append('resume', fileData.resume);
        }
      }
      
      // Determine webhook URL based on submission type
      const webhookUrl = isManual 
        ? 'https://webhook-processor-production-48f8.up.railway.app/webhook-test/d4245ae6-e289-47aa-95b4-26a93b75f7d9'
        : 'https://webhook-processor-production-48f8.up.railway.app/webhook/d4245ae6-e289-47aa-95b4-26a93b75f7d9';
      
      console.log('Submitting to webhook:', webhookUrl, 'Manual submission:', isManual);
      
      // Send POST request to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formDataToSubmit,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Webhook response:', responseData);
      
      // Store completion status in localStorage
      const completedSections = JSON.parse(localStorage.getItem('completedSections') || '{}');
      completedSections.profile = true;
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      
      toast({
        title: "Profile saved successfully",
        description: "Your profile information has been submitted and processed."
      });
      
      // Invalidate React Query cache
      await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      
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

  const handleManualSubmit = (formData: FormData) => {
    submitProfileData(formData, true);
  };

  const handleDocumentSubmit = (files: { linkedin?: File; resume?: File }) => {
    submitProfileData(files, false);
  };

  const getLinkedInPrefilledData = () => {
    return {
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
    };
  };

  return (
    <DashboardLayout steps={steps} currentStep={2}>
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
            {/* Display server connection errors */}
            {serverError && (
              <Alert className="mb-4 bg-red-50 border-red-200">
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

            {showManualEntry ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
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
                
                <ManualProfileEntry
                  initialData={isUsingLinkedInInfo ? getLinkedInPrefilledData() : {}}
                  onSubmit={handleManualSubmit}
                  isSubmitting={isSubmitting}
                  showLinkedInBadge={isUsingLinkedInInfo}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <DocumentUpload
                  onSubmit={handleDocumentSubmit}
                  isSubmitting={isSubmitting}
                  isLinkedInUser={isLinkedInUser}
                />
                
                {/* Supporting Documents & Links Section */}
                <div className="border rounded-lg p-6 bg-blue-50/30 border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full mt-1">
                        <Paperclip className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900 mb-1">Supporting Documents & Links (Optional)</h3>
                        <p className="text-sm text-blue-700 mb-3">
                          Add publications, news articles, portfolios, or other resources that showcase your work
                        </p>
                        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <div className="bg-blue-200 p-1 rounded-full mt-0.5">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-blue-800 text-sm mb-1">Enhanced Profile Quality</h4>
                              <p className="text-xs text-blue-700">
                                The more supporting materials you provide, the stronger and more complete your profile will be. 
                                These additions help us present a well-rounded and accurate representation of your professional expertise.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-blue-700 border-blue-300 hover:bg-blue-100"
                      type="button"
                    >
                      Add Documents
                    </Button>
                  </div>
                </div>
                
                {/* Options to switch to manual entry */}
                <div className="space-y-4">
                  <div className="text-center">
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
                  
                  {isLinkedInUser && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={handleUseLinkedInInfo}
                        className="text-sm"
                        type="button"
                      >
                        Use LinkedIn info to pre-fill form
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </StepCardContent>
        </StepCard>

        {/* Footer: Nav Buttons */}
        <StepCardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </StepCardFooter>
      </div>
    </DashboardLayout>
  );
};

export default ProfileCreation;
