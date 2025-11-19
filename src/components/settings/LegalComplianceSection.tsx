import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, CheckCircle2, ExternalLink } from 'lucide-react';
import { CandidateAgreementModal } from '@/components/dashboard/CandidateAgreementModal';
import { useMockCandidateAgreement } from '@/hooks/useMockCandidateAgreement';
import { CANDIDATE_AGREEMENT_CONTENT } from '@/content/candidateAgreement';
import { toast } from 'sonner';

export function LegalComplianceSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const { tncAccepted, acceptedDate } = useMockCandidateAgreement();

  const formattedDate = acceptedDate 
    ? new Date(acceptedDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const handleDownloadPDF = () => {
    toast.info('PDF download will be implemented in production');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Legal & Compliance</CardTitle>
          <CardDescription>
            View and manage your legal agreements and compliance documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Candidate Agreement */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">
                      {CANDIDATE_AGREEMENT_CONTENT.title}
                    </h3>
                    {tncAccepted && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Accepted
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Version {CANDIDATE_AGREEMENT_CONTENT.version} • 
                    Last Updated: {CANDIDATE_AGREEMENT_CONTENT.lastUpdated}
                  </p>
                  {tncAccepted && formattedDate && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Accepted on {formattedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Agreement
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Additional legal resources */}
          <div className="pt-4 border-t space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Additional Resources</h4>
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
        </CardContent>
      </Card>

      <CandidateAgreementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAccept={async () => {}}
        readOnly={true}
      />
    </>
  );
}
