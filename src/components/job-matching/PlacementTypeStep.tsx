
import { Button } from "@/components/ui/button";
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from "@/components/StepCard";
import { Briefcase, Clock, CalendarRange } from "lucide-react";

interface PlacementTypeStepProps {
  availabilityType: 'full-time' | 'fractional' | 'interim';
  onSelectType: (type: 'full-time' | 'fractional' | 'interim') => void;
  onContinue: () => void;
}

const PlacementTypeCard = ({
  type,
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
}: {
  type: 'full-time' | 'fractional' | 'interim';
  title: string;
  description: string;
  icon: typeof Briefcase;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full p-6 rounded-lg border-2 transition-all ${
      isSelected 
        ? "border-primary bg-primary/5 shadow-soft" 
        : "border-border hover:border-primary/50"
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`rounded-full p-2 ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
        <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="text-left">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export const PlacementTypeStep = ({
  availabilityType,
  onSelectType,
  onContinue,
}: PlacementTypeStepProps) => {
  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Select Your Preferred Placement Type</StepCardTitle>
        <StepCardDescription>
          Choose how you'd like to work. This will help us tailor job opportunities and compensation structures to your preferences.
        </StepCardDescription>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="space-y-4">
          <PlacementTypeCard
            type="full-time"
            title="Full-time Position"
            description="40 hours per week, dedicated to one company. Traditional employment with benefits."
            icon={Briefcase}
            isSelected={availabilityType === 'full-time'}
            onClick={() => onSelectType('full-time')}
          />
          
          <PlacementTypeCard
            type="fractional"
            title="Fractional Position"
            description="Part-time commitment, flexible hours. Work with multiple companies simultaneously."
            icon={Clock}
            isSelected={availabilityType === 'fractional'}
            onClick={() => onSelectType('fractional')}
          />
          
          <PlacementTypeCard
            type="interim"
            title="Interim Position"
            description="Temporary role with defined start and end dates. Project-based work."
            icon={CalendarRange}
            isSelected={availabilityType === 'interim'}
            onClick={() => onSelectType('interim')}
          />
          
          <div className="pt-6">
            <Button 
              onClick={onContinue}
              disabled={!availabilityType}
              className="w-full"
            >
              Continue to Job Preferences
            </Button>
          </div>
        </div>
      </StepCardContent>
    </StepCard>
  );
};
