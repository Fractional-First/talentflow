import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import { AGREEMENT_CONTENT } from '@/content/agreementContent';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { toast } from 'sonner';

export default function DemoIdentityVerification() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { identity } = AGREEMENT_CONTENT;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    toast.success('Identity verified! (Demo mode - no changes saved)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthBackground />
      <div className="w-full max-w-lg mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Demo Preview</strong> — This is how the Identity Verification page looks
          </span>
        </div>

        <BrandHeader />
        
        <Card className="mt-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">{identity.title}</CardTitle>
            <CardDescription className="text-base">
              {identity.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Confirmations List */}
            <div className="space-y-3">
              {identity.confirmations.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border bg-background">
              <Checkbox
                id="identity-confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
              />
              <Label 
                htmlFor="identity-confirm" 
                className="text-sm cursor-pointer leading-relaxed"
              >
                {identity.checkboxLabel}
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!confirmed || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                'Verifying...'
              ) : (
                <>
                  {identity.submitButton}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Back to Agreements */}
            <Button
              variant="ghost"
              onClick={() => navigate('/agreements')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agreements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
