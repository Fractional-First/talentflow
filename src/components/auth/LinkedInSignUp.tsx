
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';

interface LinkedInSignUpProps {
  onClick: () => void;
  isSubmitting: boolean;
}

export const LinkedInSignUp = ({ onClick, isSubmitting }: LinkedInSignUpProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={isSubmitting}
    >
      <Linkedin className="h-5 w-5" />
      <span>Sign up with LinkedIn</span>
    </Button>
  );
};
