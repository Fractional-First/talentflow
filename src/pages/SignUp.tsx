
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { LinkedInSignUp } from '@/components/auth/LinkedInSignUp';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [isLinkedInSubmitting, setIsLinkedInSubmitting] = useState(false);

  const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      // In a real app, you'd show an error toast
      console.error("Passwords don't match");
      return;
    }
    
    await signUp(email, password);
  };

  const handleLinkedInSignUp = () => {
    // In a real app, this would trigger OAuth
    setIsLinkedInSubmitting(true);
    
    // Store auth method in localStorage
    localStorage.setItem('authMethod', 'linkedin');
    
    // Simulate API call
    setTimeout(() => {
      setIsLinkedInSubmitting(false);
      // Navigate to profile creation with state indicating LinkedIn signup
      navigate('/dashboard/profile-creation', { 
        state: { linkedInSignUp: true } 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />
      
      <div className="w-full max-w-md">
        <StepCard>
          <StepCardHeader>
            <BrandHeader />
            <StepCardTitle className="text-center">Create your account</StepCardTitle>
            <StepCardDescription className="text-center">
              Join TalentFlow to start your onboarding journey
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <LinkedInSignUp 
              onClick={handleLinkedInSignUp}
              isSubmitting={isLinkedInSubmitting}
            />
            
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
            
            <SignUpForm 
              onSubmit={handleSignUp}
              isSubmitting={loading}
            />
          </StepCardContent>
          
          <StepCardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal" 
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
            </span>
          </StepCardFooter>
        </StepCard>
      </div>
    </div>
  );
};

export default SignUp;
