import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Handshake, Briefcase, ExternalLink, Loader2 } from 'lucide-react';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { AGREEMENT_CONTENT } from '@/content/agreementContent';
import { MSASectionViewer } from './MSASectionViewer';

interface TermsAcceptanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const iconMap = {
  shield: Shield,
  handshake: Handshake,
  briefcase: Briefcase,
};

interface TermCardProps {
  title: string;
  summary: string;
  content: string;
  icon: keyof typeof iconMap;
  msaSection: string;
  onViewFull: () => void;
}

function TermCard({ title, summary, content, icon, onViewFull }: TermCardProps) {
  const Icon = iconMap[icon];
  
  return (
    <div className="border rounded-lg p-4 space-y-2 bg-card">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{summary}</p>
        </div>
      </div>
      <button
        onClick={onViewFull}
        className="text-xs text-primary hover:underline flex items-center gap-1 ml-11"
      >
        View Full Terms <ExternalLink className="h-3 w-3" />
      </button>
    </div>
  );
}

export function TermsAcceptanceModal({ open, onOpenChange, onSuccess }: TermsAcceptanceModalProps) {
  const { acceptTerms, isSubmitting } = useAgreementStatus();
  const [agreed, setAgreed] = useState(false);
  const [msaViewerOpen, setMsaViewerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const content = AGREEMENT_CONTENT.termsOfService;

  const handleViewFullTerms = (sectionId: string) => {
    setSelectedSection(sectionId);
    setMsaViewerOpen(true);
  };

  const handleAccept = async () => {
    const success = await acceptTerms();
    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl">{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>
          
          {/* Scrollable Term Summaries */}
          <div className="p-6 space-y-3 overflow-y-auto flex-1">
            <TermCard
              title={content.sections.confidentiality.title}
              summary={content.sections.confidentiality.summary}
              content={content.sections.confidentiality.content}
              icon={content.sections.confidentiality.icon as keyof typeof iconMap}
              msaSection={content.sections.confidentiality.msaSection}
              onViewFull={() => handleViewFullTerms(content.sections.confidentiality.msaSection)}
            />
            <TermCard
              title={content.sections.nonCircumvention.title}
              summary={content.sections.nonCircumvention.summary}
              content={content.sections.nonCircumvention.content}
              icon={content.sections.nonCircumvention.icon as keyof typeof iconMap}
              msaSection={content.sections.nonCircumvention.msaSection}
              onViewFull={() => handleViewFullTerms(content.sections.nonCircumvention.msaSection)}
            />
            <TermCard
              title={content.sections.workBoundaries.title}
              summary={content.sections.workBoundaries.summary}
              content={content.sections.workBoundaries.content}
              icon={content.sections.workBoundaries.icon as keyof typeof iconMap}
              msaSection={content.sections.workBoundaries.msaSection}
              onViewFull={() => handleViewFullTerms(content.sections.workBoundaries.msaSection)}
            />
          </div>
          
          {/* Single Hybrid Checkbox */}
          <div className="p-6 border-t bg-muted/30 flex-shrink-0 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="terms-agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <Label 
                htmlFor="terms-agreement" 
                className="text-sm cursor-pointer leading-relaxed"
              >
                {content.checkboxLabel}
              </Label>
            </div>
            
            <Button 
              onClick={handleAccept} 
              disabled={!agreed || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                content.submitButton
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MSASectionViewer
        open={msaViewerOpen}
        onOpenChange={setMsaViewerOpen}
        scrollToSection={selectedSection}
      />
    </>
  );
}
