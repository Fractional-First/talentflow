import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  CheckCircle2, 
  Shield, 
  Handshake, 
  Briefcase, 
  ClipboardCheck,
  ChevronRight
} from 'lucide-react';
import { AGREEMENT_CONTENT } from '@/content/agreementContent';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const iconMap = {
  shield: Shield,
  handshake: Handshake,
  briefcase: Briefcase
};

export function ConfidentialityChecklist() {
  const { 
    confidentiality, 
    isConfidentialityComplete, 
    confidentialityCompletedAt,
    updateConfidentiality, 
    completeConfidentiality,
    isSubmitting 
  } = useAgreementStatus();
  
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const { confidentiality: content } = AGREEMENT_CONTENT;

  // If already completed, show success state
  if (confidentialityCompletedAt) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-base text-green-800">
              Confidentiality Agreed
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">
            {content.successMessage}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Completed on {new Date(confidentialityCompletedAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleComplete = async () => {
    const success = await completeConfidentiality();
    if (success) {
      toast.success('Confidentiality agreement completed!');
    }
  };

  const allChecked = 
    confidentiality.confidentialityAgreed && 
    confidentiality.nonCircumventionAgreed && 
    confidentiality.workBoundariesAgreed;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Complete Your Setup</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            1 task remaining
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {content.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Accordion 
          type="single" 
          collapsible 
          value={expanded} 
          onValueChange={setExpanded}
        >
          {Object.entries(content.sections).map(([key, section]) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Shield;
            const isChecked = confidentiality[`${key}Agreed` as keyof typeof confidentiality];
            
            return (
              <AccordionItem key={key} value={key} className="border rounded-lg px-3 mb-2">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`p-1.5 rounded-full ${isChecked ? 'bg-green-100' : 'bg-muted'}`}>
                      {isChecked ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{section.title}</p>
                      <p className="text-xs text-muted-foreground">{section.summary}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="pl-10 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {section.content}
                    </p>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <Checkbox
                        id={`${key}-agree`}
                        checked={isChecked as boolean}
                        onCheckedChange={(checked) => 
                          updateConfidentiality({ [`${key}Agreed`]: checked === true })
                        }
                      />
                      <Label 
                        htmlFor={`${key}-agree`} 
                        className="text-sm cursor-pointer leading-relaxed"
                      >
                        {content.checkboxes[key as keyof typeof content.checkboxes]}
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Button
          onClick={handleComplete}
          disabled={!allChecked || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            <>
              {content.submitButton}
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
