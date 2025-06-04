
import { StepCard, StepCardContent, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobMatchingConfirmationProps {
  onGoToDashboard: () => void;
}

export const JobMatchingConfirmation = ({ onGoToDashboard }: JobMatchingConfirmationProps) => {
  return (
    <StepCard>
      <StepCardHeader>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <StepCardTitle className="text-2xl">✅ You're all set.</StepCardTitle>
        </div>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="text-center space-y-6">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your profile and job preferences have been saved and are now visible to the hiring team.
            <br />
            We'll be in touch if there's a strong match — in the meantime, feel free to update or refine anytime.
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={onGoToDashboard}
              size="lg"
              className="px-8"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </StepCardContent>
    </StepCard>
  );
};
