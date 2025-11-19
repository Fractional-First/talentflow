import { useState } from 'react';
import { StepCard, StepCardHeader, StepCardContent, StepCardTitle, StepCardDescription } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Clock } from 'lucide-react';
import { CandidateAgreementModal } from './CandidateAgreementModal';

interface AgreementCardProps {
  onAccept: () => Promise<void>;
}

export function AgreementCard({ onAccept }: AgreementCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <StepCard className="border-2 border-orange-500 shadow-lg">
        <StepCardHeader className="bg-orange-50/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  Action Required
                </Badge>
              </div>
              <StepCardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Client Mandate Agreement
              </StepCardTitle>
              <StepCardDescription className="mt-2">
                <strong className="text-foreground">Action Required:</strong> Review and accept the Candidate Agreement and NDA
              </StepCardDescription>
            </div>
          </div>
        </StepCardHeader>

        <StepCardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <FileText className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                <strong className="text-foreground">Required to proceed with introduction to client for the mandate.</strong>
                {' '}This agreement ensures confidentiality and establishes the terms of your participation in client opportunities.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated time: <strong>5 minutes</strong></span>
            </div>

            <Button
              onClick={() => setModalOpen(true)}
              size="lg"
              className="w-full"
            >
              Review & Accept Agreement
            </Button>
          </div>
        </StepCardContent>
      </StepCard>

      <CandidateAgreementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAccept={onAccept}
      />
    </>
  );
}
