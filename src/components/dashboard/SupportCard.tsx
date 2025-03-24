
import { Button } from '@/components/ui/button';
import { StepCard, StepCardContent, StepCardHeader, StepCardTitle } from '@/components/StepCard';

export const SupportCard = () => {
  return (
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
  );
};
