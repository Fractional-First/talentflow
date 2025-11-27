import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Sparkles } from 'lucide-react';
import { CandidateAgreementDocument } from './CandidateAgreementDocument';
import { toast } from 'sonner';
import { CANDIDATE_AGREEMENT_CONTENT } from '@/content/candidateAgreement';

interface CandidateAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => Promise<void>;
  readOnly?: boolean;
  showPositiveMessage?: boolean;
}

export function CandidateAgreementModal({
  open,
  onOpenChange,
  onAccept,
  readOnly = false,
  showPositiveMessage = false
}: CandidateAgreementModalProps) {
  const [agreedNDA, setAgreedNDA] = useState(false);
  const [agreedNonCircumvent, setAgreedNonCircumvent] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const allAgreed = agreedNDA && agreedNonCircumvent && agreedTerms;

  const handleDownloadPDF = () => {
    toast.info('PDF download will be implemented in production');
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
      toast.success('Agreement accepted successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to accept agreement');
    } finally {
      setIsAccepting(false);
      setAgreedNDA(false);
      setAgreedNonCircumvent(false);
      setAgreedTerms(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!readOnly ? onOpenChange : undefined}>
      <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader>
          {showPositiveMessage && !readOnly && (
            <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    Great News! You've Been Identified for a Client Opportunity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We're excited to introduce you to a client that matches your expertise. Please review and accept the agreement below to proceed with the introduction.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Client Agreement
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area - doubled in size */}
        <div className="flex-[2] min-h-0 overflow-y-auto border rounded-lg p-6 bg-muted/30 relative">
          <CandidateAgreementDocument />
          
          {/* Scroll indicator gradient */}
          <div className="sticky bottom-0 h-8 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Agreement (PDF)
          </Button>
        </div>

        {/* Acceptance controls - only show if not read-only - compact version */}
        {!readOnly && (
          <div className="pt-2 border-t space-y-1.5">
            <p className="text-xs font-medium text-foreground mb-1.5">
              Please review and accept each section below:
            </p>

            {/* NDA Checkbox */}
            <div className="flex items-start gap-2 p-1.5 bg-muted/30 rounded-lg">
              <Checkbox
                id="agree-nda"
                checked={agreedNDA}
                onCheckedChange={(checked) => setAgreedNDA(checked === true)}
                className="mt-0.5 flex-shrink-0"
              />
              <label
                htmlFor="agree-nda"
                className="text-xs leading-snug cursor-pointer select-none flex-1"
              >
                <strong>{CANDIDATE_AGREEMENT_CONTENT.sectionCategories.nda.title}:</strong>
                {' '}{CANDIDATE_AGREEMENT_CONTENT.sectionCategories.nda.checkboxLabel}
              </label>
            </div>

            {/* Non-Circumvention Checkbox */}
            <div className="flex items-start gap-2 p-1.5 bg-muted/30 rounded-lg">
              <Checkbox
                id="agree-non-circumvent"
                checked={agreedNonCircumvent}
                onCheckedChange={(checked) => setAgreedNonCircumvent(checked === true)}
                className="mt-0.5 flex-shrink-0"
              />
              <label
                htmlFor="agree-non-circumvent"
                className="text-xs leading-snug cursor-pointer select-none flex-1"
              >
                <strong>{CANDIDATE_AGREEMENT_CONTENT.sectionCategories.nonCircumvent.title}:</strong>
                {' '}{CANDIDATE_AGREEMENT_CONTENT.sectionCategories.nonCircumvent.checkboxLabel}
              </label>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start gap-2 p-1.5 bg-muted/30 rounded-lg">
              <Checkbox
                id="agree-terms"
                checked={agreedTerms}
                onCheckedChange={(checked) => setAgreedTerms(checked === true)}
                className="mt-0.5 flex-shrink-0"
              />
              <label
                htmlFor="agree-terms"
                className="text-xs leading-snug cursor-pointer select-none flex-1"
              >
                <strong>{CANDIDATE_AGREEMENT_CONTENT.sectionCategories.terms.title}:</strong>
                {' '}{CANDIDATE_AGREEMENT_CONTENT.sectionCategories.terms.checkboxLabel}
              </label>
            </div>

            <Button
              onClick={handleAccept}
              disabled={!allAgreed || isAccepting}
              className="w-full"
              size="lg"
            >
              {isAccepting ? 'Processing...' : 'Accept Agreement and Proceed'}
            </Button>
          </div>
        )}

        {/* Read-only mode - just close button */}
        {readOnly && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
              size="lg"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
