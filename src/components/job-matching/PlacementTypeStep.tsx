
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from "@/components/StepCard";
import { Briefcase, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CompensationSection from "./CompensationSection";
import AvailabilitySection from "./AvailabilitySection";
import { ChevronDown } from "lucide-react";

interface PlacementTypeStepProps {
  availabilityTypes: {
    fullTime: boolean;
    fractional: boolean;
  };
  onSelectTypes: (types: { fullTime: boolean; fractional: boolean }) => void;
  onContinue: () => void;
  // Props needed for the job preference sections
  rateRange: number[];
  setRateRange: (range: number[]) => void;
  paymentType: string;
  setPaymentType: (type: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedDays: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  setSelectedDays: React.Dispatch<React.SetStateAction<{
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  }>>;
  timePreference: string;
  setTimePreference: (preference: string) => void;
  timezone: string;
  setTimezone: (zone: string) => void;
}

const PlacementTypeCard = ({
  type,
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
  isOpen,
  onToggle,
  children,
}: {
  type: 'fullTime' | 'fractional';
  title: string;
  description: string;
  icon: typeof Briefcase;
  isSelected: boolean;
  onClick: () => void;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) => (
  <div className="w-full">
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
    
    {isSelected && (
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
        className="mt-2 ml-8 border-l-2 border-primary/30 pl-4"
      >
        <CollapsibleTrigger className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
          <span>Configure preferences</span>
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          {children}
        </CollapsibleContent>
      </Collapsible>
    )}
  </div>
);

export const PlacementTypeStep = ({
  availabilityTypes,
  onSelectTypes,
  onContinue,
  rateRange,
  setRateRange,
  paymentType,
  setPaymentType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedDays,
  setSelectedDays,
  timePreference,
  setTimePreference,
  timezone,
  setTimezone,
}: PlacementTypeStepProps) => {
  const toggleType = (type: 'fullTime' | 'fractional') => {
    onSelectTypes({
      ...availabilityTypes,
      [type]: !availabilityTypes[type]
    });
  };

  const hasSelection = availabilityTypes.fullTime || availabilityTypes.fractional;
  
  // Track open/close state for each placement type's preferences
  const [fullTimeOpen, setFullTimeOpen] = useState(false);
  const [flexibleOpen, setFlexibleOpen] = useState(false);

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
            isOpen={fullTimeOpen}
            onToggle={() => setFullTimeOpen(!fullTimeOpen)}
          >
            <div className="bg-background/80 rounded-lg p-4">
              <h5 className="font-medium mb-2 text-sm">Full-time Preferences</h5>
              <CompensationSection
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                rateRange={rateRange}
                setRateRange={setRateRange}
              />
              <div className="mt-4">
                <AvailabilitySection
                  availabilityTypes={{ fullTime: true, fractional: false }}
                  setAvailabilityTypes={() => {}}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  selectedDays={selectedDays}
                  setSelectedDays={setSelectedDays}
                  timePreference={timePreference}
                  setTimePreference={setTimePreference}
                  timezone={timezone}
                  setTimezone={setTimezone}
                />
              </div>
            </div>
          </PlacementTypeCard>
          
          <PlacementTypeCard
            type="fractional"
            title="Flexible Position"
            description="Part-time commitment, flexible hours. Work with multiple companies simultaneously."
            icon={Clock}
            isSelected={availabilityTypes.fractional}
            onClick={() => toggleType('fractional')}
            isOpen={flexibleOpen}
            onToggle={() => setFlexibleOpen(!flexibleOpen)}
          >
            <div className="bg-background/80 rounded-lg p-4">
              <h5 className="font-medium mb-2 text-sm">Flexible Position Preferences</h5>
              <CompensationSection
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                rateRange={rateRange}
                setRateRange={setRateRange}
              />
              <div className="mt-4">
                <AvailabilitySection
                  availabilityTypes={{ fullTime: false, fractional: true }}
                  setAvailabilityTypes={() => {}}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  selectedDays={selectedDays}
                  setSelectedDays={setSelectedDays}
                  timePreference={timePreference}
                  setTimePreference={setTimePreference}
                  timezone={timezone}
                  setTimezone={setTimezone}
                />
              </div>
            </div>
          </PlacementTypeCard>
          
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
