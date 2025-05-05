
import { Button } from "@/components/ui/button";
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from "@/components/StepCard";
import { Briefcase, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface PlacementTypeStepProps {
  availabilityTypes: {
    fullTime: boolean;
    fractional: boolean;
  };
  onSelectTypes: (types: { fullTime: boolean; fractional: boolean }) => void;
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
  type: 'fullTime' | 'fractional';
  title: string;
  description: string;
  icon: typeof Briefcase;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full p-6 rounded-lg border-2 transition-all flex items-start ${
      isSelected 
        ? "border-primary bg-primary/5 shadow-soft" 
        : "border-border hover:border-primary/50"
    }`}
  >
    <div className={`rounded-full p-2 mr-4 ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
      <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
    </div>
    <div className="flex-grow text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Checkbox 
          checked={isSelected}
          className="ml-2"
          onCheckedChange={() => onClick()}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </button>
);

export const PlacementTypeStep = ({
  availabilityTypes,
  onSelectTypes,
  onContinue,
}: PlacementTypeStepProps) => {
  const toggleType = (type: 'fullTime' | 'fractional') => {
    onSelectTypes({
      ...availabilityTypes,
      [type]: !availabilityTypes[type]
    });
  };

  const hasSelection = availabilityTypes.fullTime || availabilityTypes.fractional;

  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Select Your Preferred Placement Type</StepCardTitle>
        <StepCardDescription>
          Choose how you'd like to work. You may select one or both options. This will help us tailor job opportunities and compensation structures to your preferences.
        </StepCardDescription>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="space-y-4">
          <PlacementTypeCard
            type="fullTime"
            title="Full-time Position"
            description="40 hours per week, dedicated to one company. Traditional employment with benefits."
            icon={Briefcase}
            isSelected={availabilityTypes.fullTime}
            onClick={() => toggleType('fullTime')}
          />
          
          <PlacementTypeCard
            type="fractional"
            title="Fractional Position"
            description="Part-time commitment, flexible hours. Work with multiple companies simultaneously."
            icon={Clock}
            isSelected={availabilityTypes.fractional}
            onClick={() => toggleType('fractional')}
          />
          
          <div className="pt-6">
            <Button 
              onClick={onContinue}
              disabled={!hasSelection}
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
