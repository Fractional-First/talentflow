
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Separator } from '@/components/ui/separator';
import { Linkedin } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLinkedInLogin = () => {
    // In a real app, this would trigger OAuth
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      
      <div className="w-full max-w-md">
        <StepCard>
          <StepCardHeader>
            <div className="text-center mb-2">
              <div 
                className="inline-block cursor-pointer" 
                onClick={() => navigate('/')}
              >
                <span className="text-2xl font-semibold">TalentFlow</span>
              </div>
            </div>
            <StepCardTitle className="text-center">Welcome to TalentFlow</StepCardTitle>
            <StepCardDescription className="text-center">
              The easiest way to find your next opportunity
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLinkedInLogin}
              disabled={isSubmitting}
            >
              <Linkedin className="h-5 w-5" />
              <span>{isSubmitting ? 'Connecting...' : 'Continue with LinkedIn'}</span>
            </Button>
            
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                New to TalentFlow?
              </span>
            </div>
          </StepCardContent>
          
          <StepCardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal" 
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
            </span>
          </StepCardFooter>
        </StepCard>
      </div>
    </div>
  );
};

export default Login;
