import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MSAProgressIndicator } from './MSAProgressIndicator';
import { Stage1Identity } from './msa-stages/Stage1Identity';
import { Stage2Confidentiality } from './msa-stages/Stage2Confidentiality';
import { Stage3FullAgreement } from './msa-stages/Stage3FullAgreement';
import { useCandidateMSA } from '@/hooks/useCandidateMSA';
import { Sparkles } from 'lucide-react';

interface CandidateAgreementWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateAgreementWizard({ open, onOpenChange }: CandidateAgreementWizardProps) {
  const {
    currentStage,
    stage1,
    stage2,
    stage3,
    tncAccepted,
    isSubmitting,
    isStage1Complete,
    isStage2Complete,
    isStage3Complete,
    updateStage1,
    updateStage2,
    updateStage3,
    goToNextStage,
    goToPreviousStage,
    acceptAgreement
  } = useCandidateMSA();

  const handleClose = (value: boolean) => {
    // Only allow closing if agreement is accepted
    if (tncAccepted) {
      onOpenChange(value);
    }
  };

  const handleSubmit = async () => {
    await acceptAgreement();
    // Close modal after acceptance
    setTimeout(() => onOpenChange(false), 500);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] h-[90vh] flex flex-col p-0 gap-0">
        {/* Header with welcome message */}
        <div className="px-6 pt-6 pb-2 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                CANDIDATE MSA – Fractional First Candidate Onboarding
              </h1>
              <p className="text-sm text-muted-foreground">
                Great news! You've been selected to join our talent network.
              </p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <MSAProgressIndicator
            currentStage={currentStage}
            stage1Complete={isStage1Complete()}
            stage2Complete={isStage2Complete()}
          />
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-6">
            {currentStage === 1 && (
              <Stage1Identity
                data={stage1}
                onUpdate={updateStage1}
                onContinue={goToNextStage}
                isComplete={isStage1Complete()}
              />
            )}
            
            {currentStage === 2 && (
              <Stage2Confidentiality
                data={stage2}
                onUpdate={updateStage2}
                onContinue={goToNextStage}
                onBack={goToPreviousStage}
                isComplete={isStage2Complete()}
              />
            )}
            
            {currentStage === 3 && (
              <Stage3FullAgreement
                data={stage3}
                signingType={stage1.signingType}
                entityName={stage1.entityName}
                onUpdate={updateStage3}
                onBack={goToPreviousStage}
                onSubmit={handleSubmit}
                isComplete={isStage3Complete()}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
