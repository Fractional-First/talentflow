import { useState } from 'react';
import { MSA_CONTENT, MSAStage2Data } from '@/content/candidateMSA';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, ArrowLeft, FileText, Lock, Shield, Briefcase } from 'lucide-react';

interface Stage2ConfidentialityProps {
  data: MSAStage2Data;
  onUpdate: (data: Partial<MSAStage2Data>) => void;
  onContinue: () => void;
  onBack: () => void;
  isComplete: boolean;
}

export function Stage2Confidentiality({ 
  data, 
  onUpdate, 
  onContinue, 
  onBack, 
  isComplete 
}: Stage2ConfidentialityProps) {
  const { stage2, fullMSA } = MSA_CONTENT;
  const [showFullTerms, setShowFullTerms] = useState(false);

  const sectionIcons = {
    confidentiality: Lock,
    nonCircumvention: Shield,
    workBoundaries: Briefcase
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Stage 2 – {stage2.title}
        </h2>
        <p className="text-muted-foreground">
          {stage2.description}
        </p>
      </div>

      {/* Sections Accordion */}
      <Accordion type="multiple" defaultValue={['confidentiality', 'nonCircumvention', 'workBoundaries']} className="space-y-3">
        {Object.entries(stage2.sections).map(([key, section]) => {
          const Icon = sectionIcons[key as keyof typeof sectionIcons];
          return (
            <AccordionItem 
              key={key} 
              value={key}
              className="border border-border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Checkbox
            id="confidentiality"
            checked={data.confidentialityAgreed}
            onCheckedChange={(checked) => onUpdate({ confidentialityAgreed: checked === true })}
          />
          <Label htmlFor="confidentiality" className="text-sm cursor-pointer leading-relaxed">
            {stage2.checkboxes.confidentiality}
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Checkbox
            id="nonCircumvention"
            checked={data.nonCircumventionAgreed}
            onCheckedChange={(checked) => onUpdate({ nonCircumventionAgreed: checked === true })}
          />
          <Label htmlFor="nonCircumvention" className="text-sm cursor-pointer leading-relaxed">
            {stage2.checkboxes.nonCircumvention}
          </Label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Checkbox
            id="workBoundaries"
            checked={data.workBoundariesAgreed}
            onCheckedChange={(checked) => onUpdate({ workBoundariesAgreed: checked === true })}
          />
          <Label htmlFor="workBoundaries" className="text-sm cursor-pointer leading-relaxed">
            {stage2.checkboxes.workBoundaries}
          </Label>
        </div>
      </div>

      {/* Post acceptance note */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-sm text-primary font-medium">
          {stage2.postAcceptanceNote}
        </p>
      </div>

      {/* View Full Terms Sheet */}
      <Sheet open={showFullTerms} onOpenChange={setShowFullTerms}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            View Full Terms
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{fullMSA.title}</SheetTitle>
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
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={!isComplete}
          className="w-full sm:w-auto"
          size="lg"
        >
          {stage2.continueButton}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
