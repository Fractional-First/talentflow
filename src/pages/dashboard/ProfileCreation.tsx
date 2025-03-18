
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
import { Upload, ArrowRight, ArrowLeft, File } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Profile', description: 'Enter your information', status: 'current' },
    { id: 3, name: 'Profile Snapshot', description: 'Review your profile', status: 'upcoming' },
    { id: 4, name: 'Agreement', description: 'Sign legal documents', status: 'upcoming' },
    { id: 5, name: 'Branding', description: 'Enhance your profile', status: 'upcoming' },
    { id: 6, name: 'Job Matching', description: 'Get matched to jobs', status: 'upcoming' }
  ];
  
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you'd handle file upload to your server/storage
      setResumeUploaded(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
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
            </StepCardHeader>
            
            <StepCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="currentPosition">Current Position</Label>
                    <Input id="currentPosition" />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry</Label>
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
            </StepCardContent>
          </StepCard>
          
          <StepCard>
            <StepCardHeader>
              <StepCardTitle>Professional Summary</StepCardTitle>
              <StepCardDescription>
                Share a brief summary of your professional experience and career goals
              </StepCardDescription>
            </StepCardHeader>
            
            <StepCardContent>
              <div className="space-y-4">
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
            </StepCardContent>
          </StepCard>
          
          <StepCard>
            <StepCardHeader>
              <StepCardTitle>Upload Your Resume</StepCardTitle>
              <StepCardDescription>
                Upload your resume to help us better understand your experience and skills
              </StepCardDescription>
            </StepCardHeader>
            
            <StepCardContent>
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
              
              <Separator className="my-6" />
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">LinkedIn Import</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Alternatively, you can import your professional data directly from LinkedIn.
                </p>
                <Button variant="outline">
                  Import from LinkedIn
                </Button>
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
              disabled={isSubmitting}
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
