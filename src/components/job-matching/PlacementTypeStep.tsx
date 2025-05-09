import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from "@/components/StepCard";
import { Briefcase, Clock, MapPin, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CompensationSection from "./CompensationSection";
import AvailabilitySection from "./AvailabilitySection";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LocationSection from "./LocationSection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  remotePreference?: boolean;
  setRemotePreference?: (preference: boolean) => void;
  industryPreferences?: string[];
  setIndustryPreferences?: React.Dispatch<React.SetStateAction<string[]>>;
  currentLocation?: string;
  setCurrentLocation?: (location: string) => void;
  locationPreferences?: string[];
  setLocationPreferences?: React.Dispatch<React.SetStateAction<string[]>>;
  workEligibility?: string[];
  setWorkEligibility?: React.Dispatch<React.SetStateAction<string[]>>;
}

const PlacementTypeCard = ({
  type,
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
  children,
}: {
  type: 'fullTime' | 'fractional';
  title: string;
  description: string;
  icon: typeof Briefcase;
  isSelected: boolean;
  onClick: () => void;
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
    
    {isSelected && children && (
      <div className="mt-4 ml-8 border-l-2 border-primary/30 pl-4">
        <div className="pt-2 space-y-6">
          {children}
        </div>
      </div>
    )}
  </div>
);

// Updated Remote Work Preference component with toggle buttons
const RemoteWorkPreference = ({ 
  remotePreference, 
  setRemotePreference 
}: { 
  remotePreference?: boolean; 
  setRemotePreference?: (value: boolean) => void 
}) => {
  if (!remotePreference || !setRemotePreference) return null;
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Remote Work Preference</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="remote-preference-step" 
            checked={remotePreference}
            onCheckedChange={setRemotePreference}
          />
          <label htmlFor="remote-preference-step" className="text-sm font-medium">
            {remotePreference ? 'Yes' : 'No'}
          </label>
        </div>
      </div>
      
      <div className="px-4">
        <ToggleGroup 
          type="single" 
          value={remotePreference ? "remote" : "onsite"} 
          onValueChange={(value) => {
            if (value) setRemotePreference(value === "remote");
          }}
        >
          <ToggleGroupItem value="remote" className="flex-1">Remote</ToggleGroupItem>
          <ToggleGroupItem value="onsite" className="flex-1">On-site</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

// Enhanced Industry Preferences with Add button and dialog
const IndustryPreferenceSection = ({
  industryPreferences,
  setIndustryPreferences
}: {
  industryPreferences?: string[];
  setIndustryPreferences?: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [open, setOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState("");
  
  if (!industryPreferences || !setIndustryPreferences) return null;

  const handleAddIndustry = () => {
    if (newIndustry.trim() && !industryPreferences.includes(newIndustry.trim())) {
      setIndustryPreferences([...industryPreferences, newIndustry.trim()]);
      setNewIndustry("");
      setOpen(false);
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Industry Preferences</h3>
      </div>
      <div className="flex flex-wrap gap-2 px-4">
        {industryPreferences.map(industry => (
          <Badge key={industry} variant="outline">
            {industry}
            <button 
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setIndustryPreferences(prev => prev.filter(i => i !== industry))}
            >
              ×
            </button>
          </Badge>
        ))}
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add Industry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Industry Preference</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input 
                value={newIndustry} 
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Enter industry name" 
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddIndustry()}
              />
              <Button onClick={handleAddIndustry}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Simple component for Location Information
const LocationPreferenceSection = ({
  currentLocation,
  setCurrentLocation,
  locationPreferences,
  setLocationPreferences,
  workEligibility,
  setWorkEligibility
}: {
  currentLocation?: string;
  setCurrentLocation?: (location: string) => void;
  locationPreferences?: string[];
  setLocationPreferences?: React.Dispatch<React.SetStateAction<string[]>>;
  workEligibility?: string[];
  setWorkEligibility?: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  if (!currentLocation || !setCurrentLocation || !locationPreferences || !setLocationPreferences || !workEligibility || !setWorkEligibility) return null;

  return (
    <div className="py-4">
      <LocationSection
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        workEligibility={workEligibility}
        setWorkEligibility={setWorkEligibility}
        locationPreferences={locationPreferences}
        setLocationPreferences={setLocationPreferences}
        remotePreference={false} // We handle remote preference separately
        setRemotePreference={() => {}} // Empty function since we handle it separately
      />
    </div>
  );
};

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
  remotePreference,
  setRemotePreference,
  industryPreferences,
  setIndustryPreferences,
  currentLocation,
  setCurrentLocation,
  locationPreferences,
  setLocationPreferences,
  workEligibility,
  setWorkEligibility
}: PlacementTypeStepProps) => {
  const toggleType = (type: 'fullTime' | 'fractional') => {
    onSelectTypes({
      ...availabilityTypes,
      [type]: !availabilityTypes[type]
    });
  };

  const hasSelection = availabilityTypes.fullTime || availabilityTypes.fractional;
  
  // Set appropriate payment type when selecting position type
  const handleFullTimeToggle = () => {
    if (!availabilityTypes.fullTime) {
      setPaymentType('annual'); // Force annual salary for full-time
    }
    toggleType('fullTime');
  };
  
  const handleFlexibleToggle = () => {
    if (!availabilityTypes.fractional) {
      setPaymentType('hourly'); // Default to hourly for flexible positions
    }
    toggleType('fractional');
  };

  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Select Your Preferred Placement Type</StepCardTitle>
        <StepCardDescription>
          Choose how you'd like to work. You may select one or both options. This will help us tailor job opportunities and compensation structures to your preferences.
        </StepCardDescription>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="space-y-6">
          <PlacementTypeCard
            type="fullTime"
            title="Full-time Position"
            description="40 hours per week, dedicated to one company. Traditional employment with benefits."
            icon={Briefcase}
            isSelected={availabilityTypes.fullTime}
            onClick={handleFullTimeToggle}
          >
            {availabilityTypes.fullTime && (
              <div className="bg-background/80 rounded-lg p-4 space-y-6">
                {/* Full-time position only shows annual salary option */}
                <CompensationSection
                  paymentType="annual"
                  setPaymentType={() => {}} // Lock to annual
                  rateRange={rateRange}
                  setRateRange={setRateRange}
                  showOnly="annual"
                />
                
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
                
                <RemoteWorkPreference 
                  remotePreference={remotePreference}
                  setRemotePreference={setRemotePreference}
                />
                
                <LocationPreferenceSection
                  currentLocation={currentLocation}
                  setCurrentLocation={setCurrentLocation}
                  locationPreferences={locationPreferences}
                  setLocationPreferences={setLocationPreferences}
                  workEligibility={workEligibility}
                  setWorkEligibility={setWorkEligibility}
                />
                
                <IndustryPreferenceSection
                  industryPreferences={industryPreferences}
                  setIndustryPreferences={setIndustryPreferences}
                />
              </div>
            )}
          </PlacementTypeCard>
          
          <PlacementTypeCard
            type="fractional"
            title="Flexible Position"
            description="Part-time commitment, flexible hours. Work with multiple companies simultaneously."
            icon={Clock}
            isSelected={availabilityTypes.fractional}
            onClick={handleFlexibleToggle}
          >
            {availabilityTypes.fractional && (
              <div className="bg-background/80 rounded-lg p-4 space-y-6">
                {/* Flexible position only shows hourly and daily rate options */}
                <CompensationSection
                  paymentType={paymentType === 'annual' ? 'hourly' : paymentType}
                  setPaymentType={setPaymentType}
                  rateRange={rateRange}
                  setRateRange={setRateRange}
                  showOnly="hourly-daily"
                />
                
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
                
                <RemoteWorkPreference 
                  remotePreference={remotePreference}
                  setRemotePreference={setRemotePreference}
                />
                
                <LocationPreferenceSection
                  currentLocation={currentLocation}
                  setCurrentLocation={setCurrentLocation}
                  locationPreferences={locationPreferences}
                  setLocationPreferences={setLocationPreferences}
                  workEligibility={workEligibility}
                  setWorkEligibility={setWorkEligibility}
                />
                
                <IndustryPreferenceSection
                  industryPreferences={industryPreferences}
                  setIndustryPreferences={setIndustryPreferences}
                />
              </div>
            )}
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
