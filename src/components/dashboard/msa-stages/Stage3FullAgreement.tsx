import { useState } from 'react';
import { MSA_CONTENT, MSAStage3Data, SigningType } from '@/content/candidateMSA';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, FileText, Check, Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface Stage3FullAgreementProps {
  data: MSAStage3Data;
  signingType: SigningType | null;
  entityName: string;
  onUpdate: (data: Partial<MSAStage3Data>) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isComplete: boolean;
  isSubmitting: boolean;
}

export function Stage3FullAgreement({ 
  data, 
  signingType,
  entityName,
  onUpdate, 
  onBack, 
  onSubmit,
  isComplete,
  isSubmitting
}: Stage3FullAgreementProps) {
  const { stage3, fullMSA } = MSA_CONTENT;
  const [showFullMSA, setShowFullMSA] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with celebration */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Stage 3 – {stage3.title}
          </h2>
        </div>
        <p className="text-lg text-primary font-medium">
          {stage3.description}
        </p>
      </div>

      {/* Intro and summary */}
      <div className="space-y-3">
        <p className="text-muted-foreground">{stage3.intro}</p>
        <ul className="space-y-2">
          {stage3.summary.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        {/* Full MSA Acceptance */}
        <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Checkbox
            id="fullMSA"
            checked={data.fullMSAAgreed}
            onCheckedChange={(checked) => onUpdate({ fullMSAAgreed: checked === true })}
          />
          <Label htmlFor="fullMSA" className="text-sm cursor-pointer leading-relaxed">
            {stage3.checkboxes.fullMSA}
          </Label>
        </div>

        {/* Signing confirmation - conditional based on stage 1 selection */}
        {signingType === 'individual' && (
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
            <Checkbox
              id="signingConfirm"
              checked={data.signingConfirmed}
              onCheckedChange={(checked) => onUpdate({ signingConfirmed: checked === true })}
            />
            <Label htmlFor="signingConfirm" className="text-sm cursor-pointer leading-relaxed">
              {stage3.checkboxes.individual}
            </Label>
          </div>
        )}

        {signingType === 'entity' && (
          <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
            <Checkbox
              id="signingConfirm"
              checked={data.signingConfirmed}
              onCheckedChange={(checked) => onUpdate({ signingConfirmed: checked === true })}
            />
            <Label htmlFor="signingConfirm" className="text-sm cursor-pointer leading-relaxed">
              {stage3.checkboxes.entity} ({entityName})
            </Label>
          </div>
        )}
      </div>

      {/* View Full MSA Sheet */}
      <Sheet open={showFullMSA} onOpenChange={setShowFullMSA}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            View Full MSA
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{fullMSA.title}</SheetTitle>
            <p className="text-sm text-muted-foreground">{fullMSA.subtitle}</p>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            <div className="space-y-6 pr-4">
              {fullMSA.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-foreground">{section.heading}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isComplete || isSubmitting}
          className="w-full sm:flex-1 bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {stage3.submitButton}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
