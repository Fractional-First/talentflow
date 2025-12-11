import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { AgreementCard } from '@/components/agreements/AgreementCard';
import { FullMSAModal } from '@/components/agreements/FullMSAModal';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { AGREEMENT_VERSION } from '@/content/agreementContent';
import { toast } from 'sonner';

export default function Agreements() {
  const { 
    isIdentityVerified,
    identityVerifiedAt,
    isConfidentialityComplete,
    confidentialityCompletedAt,
    isFullMSAComplete,
    fullMSACompletedAt,
    allComplete,
    resetDemo
  } = useAgreementStatus();

  const [showFullMSA, setShowFullMSA] = useState(false);

  const handleSignAll = () => {
    setShowFullMSA(true);
  };

  return (
    <SidebarProvider>
      <FullMSAModal 
        open={showFullMSA} 
        onOpenChange={setShowFullMSA} 
      />

      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex items-center gap-4 px-4 sm:px-8 h-14">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Agreements</h1>
            </div>
          </div>

          <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {/* DEMO: Reset button and Preview */}
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-sm text-amber-800">
                <strong>Demo Mode:</strong> Reset agreements or preview onboarding steps.
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/demo'}
                >
                  Preview Onboarding Flow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDemo}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Demo
                </Button>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Your Agreements</h1>
              <p className="text-muted-foreground">
                View and manage your legal documents. Version {AGREEMENT_VERSION}.
              </p>
            </div>

            {/* Agreement Cards */}
            <div className="space-y-4 mb-8">
              {/* Stage 1: Identity */}
              <AgreementCard
                title="Identity & Eligibility"
                description="Verification of your identity and eligibility to work"
                status={isIdentityVerified ? 'completed' : 'pending'}
                completedAt={identityVerifiedAt}
              />

              {/* Stage 2: Confidentiality */}
              <AgreementCard
                title="Confidentiality & Non-Circumvention"
                description="Agreement to protect client information and work through Fractional First"
                status={isConfidentialityComplete ? 'completed' : isIdentityVerified ? 'pending' : 'locked'}
                completedAt={confidentialityCompletedAt}
                lockedMessage="Complete Identity verification first"
              />

              {/* Stage 3: Full MSA */}
              <AgreementCard
                title="Master Candidate Agreement"
                description="Full terms for engaging with client opportunities"
                status={isFullMSAComplete ? 'completed' : 'locked'}
                completedAt={fullMSACompletedAt}
                onSign={() => setShowFullMSA(true)}
                lockedMessage="Available when matched with an opportunity"
              />
            </div>

            {/* Sign All Section */}
            {!allComplete && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Sign All Agreements</CardTitle>
                      <CardDescription>
                        Complete all agreements now to be ready for any opportunity
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleSignAll} className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    Sign All Now (Optional)
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* All Complete Message */}
            {allComplete && (
              <Card className="mb-8 border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">All Agreements Signed</h3>
                      <p className="text-sm text-green-700">
                        You're fully set up and ready for client opportunities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator className="my-8" />

            {/* Additional Resources */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">Additional Resources</h3>
              <div className="space-y-2">
                <a
                  href="https://fractionalfirst.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Privacy Policy
                </a>
                <a
                  href="https://fractionalfirst.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
