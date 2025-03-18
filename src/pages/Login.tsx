import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Separator } from '@/components/ui/separator';
import { Linkedin } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

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
            <StepCardTitle className="text-center">Welcome back</StepCardTitle>
            <StepCardDescription className="text-center">
              Log in to continue your onboarding journey
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLinkedInLogin}
              disabled={isSubmitting}
            >
              <Linkedin className="h-5 w-5" />
              <span>Log in with LinkedIn</span>
            </Button>
            
            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm"
                >
                  Forgot password?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
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
