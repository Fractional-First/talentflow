import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ArrowRight, ArrowLeft, File, Clock, HelpCircle, Linkedin, FileSpreadsheet, Copy, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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

const ProfileCreation = () => {
  const navigate = useNavigate();
  
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileMethod, setProfileMethod] = useState<'manual' | 'linkedin' | 'resume'>('linkedin');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [dataCollectionConsent, setDataCollectionConsent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed', estimatedTime: '2-3 minutes' },
    { id: 2, name: 'Profile', description: 'Enter your information', status: 'current', estimatedTime: '5-7 minutes' },
    { id: 3, name: 'Profile Snapshot', description: 'Review your profile', status: 'upcoming', estimatedTime: '3-5 minutes' }
  ];
  
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeUploaded(true);
      setProfileMethod('resume');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/profile-snapshot');
    }, 1000);
  };

  const requestEmailVerification = () => {
    setTimeout(() => {
      setIsEmailVerified(true);
    }, 1500);
  };

  const handleCompleteSection = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      const completedSections = JSON.parse(localStorage.getItem('completedSections') || '{}');
      completedSections.profile = true;
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      
      navigate('/dashboard/profile-snapshot');
    }, 1000);
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
                <span className="text-sm text-muted-foreground">Estimated completion time: <strong>5-7 minutes</strong></span>
              </div>
            </StepCardHeader>
            
            <StepCardContent>
              {!showManualEntry ? (
                <div className="space-y-6">
                  {/* LinkedIn Import Option */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#0A66C2]/10 p-3 rounded-full mr-3">
                        <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn Import</h3>
                        <p className="text-sm text-muted-foreground">
                          Quickly import your professional profile from LinkedIn
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => setProfileMethod('linkedin')}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      Connect LinkedIn
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      We never post to your LinkedIn without permission
                    </p>
                  </div>
                  
                  {/* Resume Upload Option */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-3 rounded-full mr-3">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Resume Upload</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload your resume and we'll extract the information
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      {resumeUploaded ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/10 p-3 rounded-full mb-3">
                            <File className="h-6 w-6 text-primary" />
                          </div>
                          <p className="mb-1 font-medium">Resume uploaded successfully</p>
                          <p className="text-sm text-muted-foreground mb-3">resume.pdf</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setResumeUploaded(false)}
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
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Manual Entry Link */}
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
                        <Input id="firstName" required />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email">Email</Label>
                          <Badge variant={isEmailVerified ? "success" : "outline"} className="ml-2">
                            {isEmailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Input id="email" type="email" required />
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
                        <Input id="currentPosition" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="industry">Industry</Label>
                        </div>
                        <Select>
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
                        <Input id="lastName" required />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" />
                      </div>
                      
                      <div>
                        <Label htmlFor="company">Current Company</Label>
                        <Input id="company" />
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select>
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
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skills">Key Skills (comma separated)</Label>
                      <Input 
                        id="skills" 
                        placeholder="e.g., Project Management, JavaScript, Data Analysis, Leadership"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </StepCardContent>
          </StepCard>
          
          {/* Data Collection Consent Card */}
          <StepCard>
            <StepCardHeader>
              <StepCardTitle>Data Collection Consent</StepCardTitle>
              <StepCardDescription>
                How we'll use your information to provide better matches
              </StepCardDescription>
            </StepCardHeader>
            
            <StepCardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ethical Data Use</AlertTitle>
                <AlertDescription>
                  We use your profile data and preferences to provide more accurate job matching. Your data is never sold to third parties.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dataConsent"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={dataCollectionConsent}
                  onChange={() => setDataCollectionConsent(!dataCollectionConsent)}
                />
                <label htmlFor="dataConsent" className="text-sm text-muted-foreground">
                  I consent to the collection and use of my profile data for job matching purposes, including participation in choice modeling to improve recommendations.
                </label>
              </div>
            </StepCardContent>
          </StepCard>
          
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
              disabled={isSubmitting || !dataCollectionConsent}
              onClick={handleCompleteSection}
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
