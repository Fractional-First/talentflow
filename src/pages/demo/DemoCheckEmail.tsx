import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { ArrowRight, ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function DemoCheckEmail() {
  const navigate = useNavigate();

  const handleResend = () => {
    toast.success('Email resent! (Demo mode)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthBackground />
      <div className="w-full max-w-md mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Step 2 of 7</strong> — Check Email
          </span>
        </div>

        <BrandHeader />
        
        <Card className="mt-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to verify your account and continue with onboarding.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/demo/identity-verification')}
                className="w-full"
                size="lg"
              >
                I've Verified My Email
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={handleResend}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Email
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/demo/signup')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/demo/identity-verification')}
                className="flex-1"
              >
                Skip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
