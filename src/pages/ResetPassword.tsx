
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validResetLink, setValidResetLink] = useState(false);

  useEffect(() => {
    // Check if this is a valid password reset link from Supabase
    const checkResetLink = async () => {
      const type = searchParams.get('type');
      
      // If this is a recovery type link from Supabase, it's valid
      if (type === 'recovery') {
        setValidResetLink(true);
        console.log('Valid password reset link detected');
        return;
      }
      
      // If no recovery type, check if user has an active session (already authenticated)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setValidResetLink(true);
          console.log('User has active session for password reset');
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
      
      // If we get here, this is not a valid reset scenario
      console.log('Invalid reset link, redirecting to forgot password');
      toast.error('Invalid reset link. Please request a new password reset.');
      navigate('/forgot-password');
    };

    checkResetLink();
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error updating password');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form until we've validated this is a proper reset link
  if (!validResetLink) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <AuthBackground />
        <div className="w-full max-w-md">
          <StepCard>
            <StepCardContent>
              <div className="text-center">
                <p>Validating reset link...</p>
              </div>
            </StepCardContent>
          </StepCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />
      
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
            <StepCardTitle className="text-center">Set new password</StepCardTitle>
            <StepCardDescription className="text-center">
              Enter your new password below
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    autoComplete="new-password"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {password && password.length < 6 && (
                <p className="text-sm text-destructive">
                  Password must be at least 6 characters long
                </p>
              )}
              
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-destructive">
                  Passwords do not match
                </p>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              >
                {loading ? 'Updating...' : 'Update password'}
              </Button>
            </form>
          </StepCardContent>
        </StepCard>
      </div>
    </div>
  );
};

export default ResetPassword;
