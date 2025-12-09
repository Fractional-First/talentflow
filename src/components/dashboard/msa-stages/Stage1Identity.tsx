import { MSA_CONTENT, MSAStage1Data, SigningType } from '@/content/candidateMSA';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, ArrowRight } from 'lucide-react';

interface Stage1IdentityProps {
  data: MSAStage1Data;
  onUpdate: (data: Partial<MSAStage1Data>) => void;
  onContinue: () => void;
  isComplete: boolean;
}

export function Stage1Identity({ data, onUpdate, onContinue, isComplete }: Stage1IdentityProps) {
  const { stage1 } = MSA_CONTENT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Stage 1 – {stage1.title}
        </h2>
        <p className="text-muted-foreground">
          {stage1.description}
        </p>
      </div>

      {/* Key Confirmations */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Key Confirmations</h3>
        <ul className="space-y-2">
          {stage1.keyConfirmations.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Signing Type Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          How will you sign? <span className="text-destructive">*</span>
        </h3>
        <RadioGroup
          value={data.signingType || ''}
          onValueChange={(value) => onUpdate({ signingType: value as SigningType })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="cursor-pointer">
              {stage1.signingOptions.individual}
            </Label>
          </div>
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="entity" id="entity" className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="entity" className="cursor-pointer">
                {stage1.signingOptions.entity}
              </Label>
              {data.signingType === 'entity' && (
                <Input
                  placeholder="Entity name"
                  value={data.entityName}
                  onChange={(e) => onUpdate({ entityName: e.target.value })}
                  className="max-w-sm"
                />
              )}
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Checkbox
          id="stage1-confirm"
          checked={data.confirmed}
          onCheckedChange={(checked) => onUpdate({ confirmed: checked === true })}
        />
        <Label 
          htmlFor="stage1-confirm" 
          className="text-sm cursor-pointer leading-relaxed"
        >
          {stage1.checkboxLabel}
        </Label>
      </div>

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          onClick={onContinue}
          disabled={!isComplete}
          className="w-full sm:w-auto"
          size="lg"
        >
          {stage1.continueButton}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
