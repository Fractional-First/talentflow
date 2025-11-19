import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Mail, FileText } from 'lucide-react';
import { CandidateAgreementDocument } from './CandidateAgreementDocument';
import { toast } from 'sonner';

interface CandidateAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => Promise<void>;
}

export function CandidateAgreementModal({
  open,
  onOpenChange,
  onAccept
}: CandidateAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleDownloadPDF = () => {
    toast.info('PDF download will be implemented in production');
  };

  const handleForwardToLegal = () => {
    const subject = encodeURIComponent('Fractional First Candidate Agreement Review');
    const body = encodeURIComponent(
      `Please review the Fractional First Candidate Agreement:\n\n${window.location.origin}/dashboard\n\nI need your legal opinion before accepting.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
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
      setAgreed(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Candidate Agreement for Client Mandate
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto border rounded-lg p-6 bg-muted/30 relative">
          <CandidateAgreementDocument />
          
          {/* Scroll indicator gradient */}
          <div className="sticky bottom-0 h-8 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Agreement (PDF)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForwardToLegal}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Forward to Legal/Advisor
          </Button>
        </div>

        {/* Acceptance controls */}
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="agree"
              className="text-sm leading-relaxed cursor-pointer select-none"
            >
              I confirm that I have reviewed, understood, and agree to the{' '}
              <strong>Fractional First Candidate Agreement and Non-Disclosure Agreement (NDA)</strong>.
            </label>
          </div>

          <Button
            onClick={handleAccept}
            disabled={!agreed || isAccepting}
            className="w-full"
            size="lg"
          >
            {isAccepting ? 'Processing...' : 'Accept and Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
