import { useState } from 'react';
import { Clock, Lock, Unlock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { TermsAcceptanceModal } from '@/components/agreements/TermsAcceptanceModal';
import { toast } from 'sonner';

interface JobSearchStatusSectionProps {
  activelyLooking: boolean;
  setActivelyLooking: (value: boolean) => void;
}

const JobSearchStatusSection = ({
  activelyLooking,
  setActivelyLooking
}: JobSearchStatusSectionProps) => {
  const { isTermsAccepted } = useAgreementStatus();
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (checked && !isTermsAccepted) {
      // User wants to turn on actively looking but hasn't accepted terms
      setShowTermsModal(true);
      return;
    }
    setActivelyLooking(checked);
  };

  const handleUnlockMatching = () => {
    setShowTermsModal(true);
  };

  const handleTermsSuccess = () => {
    setActivelyLooking(true);
    toast.success('Job matching unlocked! You are now actively looking.');
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Job Search Status</h3>
              <p className="text-sm text-muted-foreground">
                {isTermsAccepted 
                  ? 'Set your current job search status'
                  : 'Accept terms to unlock job matching'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isTermsAccepted ? (
              <>
                <Switch 
                  id="actively-looking" 
                  checked={activelyLooking}
                  onCheckedChange={handleToggle}
                />
                <label htmlFor="actively-looking" className="text-sm font-medium">
                  {activelyLooking ? 'Actively Looking' : 'Passively Looking'}
                </label>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnlockMatching}
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                Unlock Matching
              </Button>
            )}
          </div>
        </div>

        {/* Unlocked indicator */}
        {isTermsAccepted && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
            <Unlock className="h-4 w-4" />
            <span>Job matching is unlocked</span>
          </div>
        )}
      </div>

      <TermsAcceptanceModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onSuccess={handleTermsSuccess}
      />
    </>
  );
};

export default JobSearchStatusSection;
