
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from 'lucide-react';
import { Step } from '@/components/OnboardingProgress';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';

interface ProgressTrackerProps {
  progressPercentage: number;
  completedSteps: number;
  totalSteps: number;
  steps: Step[];
}

export const ProgressTracker = ({
  progressPercentage,
  completedSteps,
  totalSteps,
  steps
}: ProgressTrackerProps) => {
  return (
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
      </StepCardContent>
    </StepCard>
  );
};

export const CompletedSteps = ({ steps }: { steps: Step[] }) => {
  const completedSteps = steps.filter(step => step.status === 'completed');
  
  return (
    <StepCard className="h-full">
      <StepCardHeader>
        <StepCardTitle className="text-xl">Completed Steps</StepCardTitle>
      </StepCardHeader>
      
      <StepCardContent>
        <ul className="space-y-3">
          {completedSteps.map(step => (
            <li key={step.id} className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
              <span>{step.name} - {step.description}</span>
            </li>
          ))}
        </ul>
        
        {completedSteps.length === 0 && (
          <p className="text-muted-foreground">No steps completed yet. Start your journey!</p>
        )}
      </StepCardContent>
    </StepCard>
  );
};
