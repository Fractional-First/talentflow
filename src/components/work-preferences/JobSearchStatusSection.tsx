import { useState } from 'react';
import { Clock, Lock, Unlock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { useNavigate } from 'react-router-dom';

interface JobSearchStatusSectionProps {
  activelyLooking: boolean;
  setActivelyLooking: (value: boolean) => void;
}

const JobSearchStatusSection = ({
  activelyLooking,
  setActivelyLooking
}: JobSearchStatusSectionProps) => {
  const { isTermsAccepted } = useAgreementStatus();
  const navigate = useNavigate();

  const handleToggle = (checked: boolean) => {
    if (checked && !isTermsAccepted) {
      // Redirect to work preferences which will show the terms splash
      navigate('/work-preferences');
      return;
    }
    setActivelyLooking(checked);
  };

  const handleUnlockMatching = () => {
    // Navigate to work preferences - splash will show there
    navigate('/work-preferences');
  };

  return (
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
            <button
              onClick={handleUnlockMatching}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Lock className="h-4 w-4" />
              Set Job Preferences
            </button>
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
  );
};

export default JobSearchStatusSection;
