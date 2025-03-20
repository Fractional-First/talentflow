
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Step } from '@/components/OnboardingProgress';
import { ArrowRight, CheckCircle2, User, FileText, Briefcase, Image, ArrowUpRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { 
      id: 1, 
      name: 'Sign Up', 
      description: 'Create your account', 
      status: 'completed',
      estimatedTime: '2-3 minutes' 
    },
    { 
      id: 2, 
      name: 'Profile', 
      description: 'Enter your information', 
      status: 'completed',
      estimatedTime: '5-7 minutes' 
    },
    { 
      id: 3, 
      name: 'Profile Snapshot', 
      description: 'Review your profile', 
      status: 'current',
      estimatedTime: '3-5 minutes' 
    },
    { 
      id: 4, 
      name: 'Agreement', 
      description: 'Sign legal documents', 
      status: 'upcoming',
      estimatedTime: '4-6 minutes' 
    },
    { 
      id: 5, 
      name: 'Branding', 
      description: 'Enhance your profile', 
      status: 'upcoming',
      estimatedTime: '5-8 minutes' 
    },
    { 
      id: 6, 
      name: 'Job Matching', 
      description: 'Get matched to jobs', 
      status: 'upcoming',
      estimatedTime: '3-5 minutes' 
    }
  ]);
  
  // Check localStorage on component mount to determine if onboarding is complete
  useEffect(() => {
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    if (onboardingStatus === 'true') {
      setOnboardingComplete(true);
    }
  }, []);
  
  const currentStep = steps.findIndex(step => step.status === 'current') + 1;
  
  // Calculate onboarding progress
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // For demo purposes, let's add a function to complete onboarding
  const completeOnboarding = () => {
    setOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
  };

  // Display appropriate content based on onboarding progress
  const getNextStep = () => {
    const nextStep = steps.find(step => step.status === 'current');
    
    if (!nextStep) {
      setOnboardingComplete(true);
      localStorage.setItem('onboardingComplete', 'true');
      return {
        title: 'You\'ve Completed All Steps',
        description: 'Congratulations! You\'ve completed the entire onboarding process.',
        path: '/dashboard/waiting-room',
        buttonText: 'View Job Matches',
        estimatedTime: ''
      };
    }
    
    switch (nextStep.id) {
      case 1:
        return {
          title: 'Create Your Profile',
          description: 'Let\'s start by setting up your professional profile.',
          path: '/dashboard/profile-creation',
          buttonText: 'Create Profile',
          estimatedTime: nextStep.estimatedTime
        };
      case 2:
        return {
          title: 'Create Your Profile',
          description: 'Let\'s start by setting up your professional profile.',
          path: '/dashboard/profile-creation',
          buttonText: 'Create Profile',
          estimatedTime: nextStep.estimatedTime
        };
      case 3:
        return {
          title: 'Review Your Profile Snapshot',
          description: 'Take a look at your profile summary and make any necessary adjustments.',
          path: '/dashboard/profile-snapshot',
          buttonText: 'Review Profile',
          estimatedTime: nextStep.estimatedTime
        };
      case 4:
        return {
          title: 'Review and Sign Documents',
          description: 'Review and sign the necessary legal documents to proceed.',
          path: '/dashboard/agreement',
          buttonText: 'View Documents',
          estimatedTime: nextStep.estimatedTime
        };
      case 5:
        return {
          title: 'Enhance Your Professional Brand',
          description: 'Take advantage of our tools to enhance your professional brand.',
          path: '/dashboard/branding',
          buttonText: 'Enhance Brand',
          estimatedTime: nextStep.estimatedTime
        };
      case 6:
        return {
          title: 'Job Matching',
          description: 'Get matched with job opportunities that fit your profile.',
          path: '/dashboard/job-matching',
          buttonText: 'View Matches',
          estimatedTime: nextStep.estimatedTime
        };
      default:
        return {
          title: 'Continue Your Journey',
          description: 'Continue with the next step in your onboarding process.',
          path: '/dashboard',
          buttonText: 'Continue',
          estimatedTime: ''
        };
    }
  };
  
  const nextStep = getNextStep();

  // After onboarding is complete, show dashboard style view
  if (onboardingComplete) {
    return (
      <DashboardLayout steps={steps} currentStep={currentStep}>
        <div className="space-y-8">
          <StepCard>
            <StepCardHeader>
              <StepCardTitle>Welcome to Your Dashboard</StepCardTitle>
              <StepCardDescription>
                You've completed onboarding! Now you can freely navigate between different sections.
              </StepCardDescription>
            </StepCardHeader>
            
            <StepCardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Your TalentFlow Status</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2 mb-6" />
                
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">All onboarding steps completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">Active</Badge>
                  <span className="text-sm text-muted-foreground">Your profile is visible to potential employers</span>
                </div>
              </div>
            </StepCardContent>
          </StepCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StepCard className="h-full transition-all hover:shadow-md">
              <button 
                onClick={() => navigate('/dashboard/profile-creation')}
                className="text-left w-full"
              >
                <StepCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <StepCardTitle>Profile Setup</StepCardTitle>
                    </div>
                    <Badge variant="success">Complete</Badge>
                  </div>
                  <StepCardDescription>
                    View and edit your professional profile
                  </StepCardDescription>
                </StepCardHeader>
                
                <StepCardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Update your skills, experience, and personal information
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </StepCardContent>
              </button>
            </StepCard>
            
            <StepCard className="h-full transition-all hover:shadow-md">
              <button 
                onClick={() => navigate('/dashboard/agreement')}
                className="text-left w-full"
              >
                <StepCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <StepCardTitle>Legal Agreement (MSA)</StepCardTitle>
                    </div>
                    <Badge variant="success">Signed</Badge>
                  </div>
                  <StepCardDescription>
                    Review signed agreements
                  </StepCardDescription>
                </StepCardHeader>
                
                <StepCardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      View your signed Master Services Agreement
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </StepCardContent>
              </button>
            </StepCard>
            
            <StepCard className="h-full transition-all hover:shadow-md">
              <button 
                onClick={() => navigate('/dashboard/branding')}
                className="text-left w-full"
              >
                <StepCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Image className="h-5 w-5 text-primary" />
                      </div>
                      <StepCardTitle>Professional Branding</StepCardTitle>
                    </div>
                    <Badge variant="success">Complete</Badge>
                  </div>
                  <StepCardDescription>
                    Enhance your professional presence
                  </StepCardDescription>
                </StepCardHeader>
                
                <StepCardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Update your portfolio and professional images
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </StepCardContent>
              </button>
            </StepCard>
            
            <StepCard className="h-full transition-all hover:shadow-md">
              <button 
                onClick={() => navigate('/dashboard/job-matching')}
                className="text-left w-full"
              >
                <StepCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <StepCardTitle>AI Job Matching</StepCardTitle>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <StepCardDescription>
                    View and manage job matches
                  </StepCardDescription>
                </StepCardHeader>
                
                <StepCardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      See opportunities matched to your profile
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </StepCardContent>
              </button>
            </StepCard>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Initial linear onboarding flow
  return (
    <DashboardLayout steps={steps} currentStep={currentStep}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Welcome to Your Dashboard</StepCardTitle>
            <StepCardDescription>
              Track your onboarding progress and complete the remaining steps
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Onboarding Progress</h3>
                <span className="text-sm font-medium">{Math.round(progressPercentage)}% Complete</span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                {completedSteps} of {totalSteps} steps completed
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{nextStep.title}</h3>
                  <p className="text-muted-foreground mt-1">{nextStep.description}</p>
                  {nextStep.estimatedTime && (
                    <div className="flex items-center mt-2 bg-muted/40 inline-flex px-3 py-1 rounded-md">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Estimated time: <strong>{nextStep.estimatedTime}</strong></span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => navigate(nextStep.path)}
                  className="ml-4 shadow-soft"
                >
                  {nextStep.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </StepCardContent>
        </StepCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StepCard className="h-full">
            <StepCardHeader>
              <StepCardTitle className="text-xl">Completed Steps</StepCardTitle>
            </StepCardHeader>
            
            <StepCardContent>
              <ul className="space-y-3">
                {steps
                  .filter(step => step.status === 'completed')
                  .map(step => (
                    <li key={step.id} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                      <span>{step.name} - {step.description}</span>
                    </li>
                  ))}
              </ul>
              
              {completedSteps === 0 && (
                <p className="text-muted-foreground">No steps completed yet. Start your journey!</p>
              )}
            </StepCardContent>
          </StepCard>
          
          <StepCard className="h-full">
            <StepCardHeader>
              <StepCardTitle className="text-xl">Need Help?</StepCardTitle>
            </StepCardHeader>
            
            <StepCardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions or need assistance with your onboarding process, our support team is here to help.
              </p>
              
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </StepCardContent>
          </StepCard>
        </div>
        
        {/* For demo purposes only - remove in production */}
        {!onboardingComplete && (
          <div className="mt-8 border-t pt-4">
            <Button variant="outline" onClick={completeOnboarding} className="w-full">
              Demo: Complete Onboarding (Skip to Dashboard View)
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
