
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Step } from '@/components/OnboardingProgress';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([
    { 
      id: 1, 
      name: 'Sign Up', 
      description: 'Create your account', 
      status: 'completed' 
    },
    { 
      id: 2, 
      name: 'Profile', 
      description: 'Enter your information', 
      status: 'completed' 
    },
    { 
      id: 3, 
      name: 'Profile Snapshot', 
      description: 'Review your profile', 
      status: 'current' 
    },
    { 
      id: 4, 
      name: 'Agreement', 
      description: 'Sign legal documents', 
      status: 'upcoming' 
    },
    { 
      id: 5, 
      name: 'Branding', 
      description: 'Enhance your profile', 
      status: 'upcoming' 
    },
    { 
      id: 6, 
      name: 'Job Matching', 
      description: 'Get matched to jobs', 
      status: 'upcoming' 
    }
  ]);
  
  const currentStep = steps.findIndex(step => step.status === 'current') + 1;
  
  // Display appropriate content based on onboarding progress
  const getNextStep = () => {
    const nextStep = steps.find(step => step.status === 'current');
    
    if (!nextStep) {
      return {
        title: 'You\'ve Completed All Steps',
        description: 'Congratulations! You\'ve completed the entire onboarding process.',
        path: '/dashboard/waiting-room',
        buttonText: 'View Job Matches'
      };
    }
    
    switch (nextStep.id) {
      case 1:
        return {
          title: 'Create Your Profile',
          description: 'Let\'s start by setting up your professional profile.',
          path: '/dashboard/profile-creation',
          buttonText: 'Create Profile'
        };
      case 2:
        return {
          title: 'Create Your Profile',
          description: 'Let\'s start by setting up your professional profile.',
          path: '/dashboard/profile-creation',
          buttonText: 'Create Profile'
        };
      case 3:
        return {
          title: 'Review Your Profile Snapshot',
          description: 'Take a look at your profile summary and make any necessary adjustments.',
          path: '/dashboard/profile-snapshot',
          buttonText: 'Review Profile'
        };
      case 4:
        return {
          title: 'Review and Sign Documents',
          description: 'Review and sign the necessary legal documents to proceed.',
          path: '/dashboard/agreement',
          buttonText: 'View Documents'
        };
      case 5:
        return {
          title: 'Enhance Your Professional Brand',
          description: 'Take advantage of our tools to enhance your professional brand.',
          path: '/dashboard/branding',
          buttonText: 'Enhance Brand'
        };
      case 6:
        return {
          title: 'Job Matching',
          description: 'Get matched with job opportunities that fit your profile.',
          path: '/dashboard/job-matching',
          buttonText: 'View Matches'
        };
      default:
        return {
          title: 'Continue Your Journey',
          description: 'Continue with the next step in your onboarding process.',
          path: '/dashboard',
          buttonText: 'Continue'
        };
    }
  };
  
  const nextStep = getNextStep();
  
  // Calculate onboarding progress
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

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
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
