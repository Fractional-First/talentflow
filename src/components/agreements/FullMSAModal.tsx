import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  ArrowRight, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AGREEMENT_CONTENT, SigningType } from '@/content/agreementContent';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface FullMSAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function FullMSAModal({ open, onOpenChange, onComplete }: FullMSAModalProps) {
  const { fullMSA, updateFullMSA, completeFullMSA, isSubmitting } = useAgreementStatus();
  const [showFullDocument, setShowFullDocument] = useState(false);
  const { fullMSA: content } = AGREEMENT_CONTENT;

  const isComplete = 
    fullMSA.agreed && 
    fullMSA.signingType && 
    (fullMSA.signingType === 'individual' || fullMSA.entityName.trim());

  const handleSubmit = async () => {
    const success = await completeFullMSA();
    if (success) {
      toast.success('Master Agreement signed successfully!');
      onOpenChange(false);
      onComplete?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{content.title}</DialogTitle>
              <DialogDescription>{content.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Introduction */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{content.intro}</p>
              <ul className="space-y-2">
                {content.summary.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Signing Type Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">How will you sign?</h3>
              <RadioGroup
                value={fullMSA.signingType || ''}
                onValueChange={(value) => updateFullMSA({ signingType: value as SigningType })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="individual" id="msa-individual" />
                  <Label htmlFor="msa-individual" className="cursor-pointer text-sm">
                    {content.signingOptions.individual}
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="entity" id="msa-entity" className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="msa-entity" className="cursor-pointer text-sm">
                      {content.signingOptions.entity}
                    </Label>
                    {fullMSA.signingType === 'entity' && (
                      <Input
                        placeholder="Entity name"
                        value={fullMSA.entityName}
                        onChange={(e) => updateFullMSA({ entityName: e.target.value })}
                        className="max-w-sm"
                      />
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Full Document View Trigger */}
            <Sheet open={showFullDocument} onOpenChange={setShowFullDocument}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Master Agreement
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl">
                <SheetHeader>
                  <SheetTitle>{content.document.title}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground font-medium">
                      {content.document.subtitle}
                    </p>
                    {content.document.sections.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-semibold text-sm">{section.heading}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border bg-muted/30">
              <Checkbox
                id="full-msa-agree"
                checked={fullMSA.agreed}
                onCheckedChange={(checked) => updateFullMSA({ agreed: checked === true })}
              />
              <Label 
                htmlFor="full-msa-agree" 
                className="text-sm cursor-pointer leading-relaxed"
              >
                {content.checkboxes.fullMSA}
              </Label>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  {content.submitButton}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
