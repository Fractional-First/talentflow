
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Step } from '@/components/OnboardingProgress';
import { StepCardContent } from '@/components/StepCard';
import { ProgressTracker, CompletedSteps } from '@/components/dashboard/ProgressTracker';
import { NextStepCard } from '@/components/dashboard/NextStepCard';
import { SupportCard } from '@/components/dashboard/SupportCard';
import { WelcomeCard, DashboardNavGrid } from '@/components/dashboard/DashboardCards';
import { initialSteps, fullStepsList, getNextStepInfo } from '@/components/dashboard/OnboardingSteps';

const Dashboard = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  
  // Check localStorage on component mount to determine if onboarding is complete
  useEffect(() => {
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    if (onboardingStatus === 'true') {
      setOnboardingComplete(true);
      setSteps(fullStepsList); // Show all steps when onboarding is complete
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
    setSteps(fullStepsList); // Show all steps when completing onboarding
    localStorage.setItem('onboardingComplete', 'true');
  };

  // Display appropriate content based on onboarding progress
  const getNextStep = () => {
    const nextStep = steps.find(step => step.status === 'current');
    
    if (!nextStep) {
      setOnboardingComplete(true);
      setSteps(fullStepsList); // Show all steps when completing onboarding
      localStorage.setItem('onboardingComplete', 'true');
      return getNextStepInfo(undefined, steps);
    }
    
    return getNextStepInfo(nextStep, steps);
  };
  
  const nextStep = getNextStep();

  // After onboarding is complete, show dashboard style view
  if (onboardingComplete) {
    return (
      <DashboardLayout steps={steps} currentStep={currentStep}>
        <div className="space-y-8">
          <WelcomeCard />
          <DashboardNavGrid />
        </div>
      </DashboardLayout>
    );
  }

  // Initial linear onboarding flow
  return (
    <DashboardLayout steps={steps} currentStep={currentStep}>
      <div className="space-y-6">
        <ProgressTracker 
          progressPercentage={progressPercentage}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          steps={steps}
        />
        
        <StepCardContent>
          <NextStepCard 
            title={nextStep.title}
            description={nextStep.description}
            path={nextStep.path}
            buttonText={nextStep.buttonText}
            estimatedTime={nextStep.estimatedTime}
          />
        </StepCardContent>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompletedSteps steps={steps} />
          <SupportCard />
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
