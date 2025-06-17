
import { Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import JobSearchStatusSection from './JobSearchStatusSection';
import CompensationSection from './CompensationSection';
import AvailabilitySection from './AvailabilitySection';
import LocationSection from './LocationSection';
import IndustryPreferencesSection from './IndustryPreferencesSection';

interface JobMatchingPreferencesSectionProps {
  activelyLooking: boolean;
  setActivelyLooking: (value: boolean) => void;
  availabilityType: 'full-time' | 'fractional' | 'interim';
  setAvailabilityType: (type: 'full-time' | 'fractional' | 'interim') => void;
  availabilityTypes: {
    fullTime: boolean;
    fractional: boolean;
  };
  setAvailabilityTypes: (types: { fullTime: boolean; fractional: boolean }) => void;
  rateRange: number[];
  setRateRange: (range: number[]) => void;
  paymentType: string;
  setPaymentType: (type: string) => void;
  remotePreference: boolean;
  setRemotePreference: (preference: boolean) => void;
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
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
  locationPreferences: string[];
  setLocationPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  workEligibility: string[];
  setWorkEligibility: React.Dispatch<React.SetStateAction<string[]>>;
  industryPreferences: string[];
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  estimatedTime: string;
}

const JobMatchingPreferencesSection = ({
  activelyLooking,
  setActivelyLooking,
  availabilityType,
  setAvailabilityType,
  availabilityTypes,
  setAvailabilityTypes,
  rateRange,
  setRateRange,
  paymentType,
  setPaymentType,
  remotePreference,
  setRemotePreference,
  currentLocation,
  setCurrentLocation,
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
  locationPreferences,
  setLocationPreferences,
  workEligibility,
  setWorkEligibility,
  industryPreferences,
  setIndustryPreferences,
  estimatedTime
}: JobMatchingPreferencesSectionProps) => {
  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Job Matching Preferences</StepCardTitle>
        <StepCardDescription>
          Configure your job matching preferences to help us find the perfect opportunities for you
        </StepCardDescription>
        <div className="flex items-center mt-2 bg-muted/40 px-3 py-2 rounded-md">
          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Estimated completion time: <strong>{estimatedTime}</strong></span>
        </div>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="space-y-6">
          <JobSearchStatusSection
            activelyLooking={activelyLooking}
            setActivelyLooking={setActivelyLooking}
          />
          
          <Separator />
          
          <CompensationSection
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            rateRange={rateRange}
            setRateRange={setRateRange}
          />
          
          <Separator />
          
          <AvailabilitySection
            availabilityTypes={availabilityTypes}
            timezone={timezone}
            setTimezone={setTimezone}
          />
          
          <Separator />
          
          <LocationSection
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            workEligibility={workEligibility}
            setWorkEligibility={setWorkEligibility}
            locationPreferences={locationPreferences}
            setLocationPreferences={setLocationPreferences}
            remotePreference={remotePreference}
            setRemotePreference={setRemotePreference}
          />
          
          <Separator />
          
          <IndustryPreferencesSection
            industryPreferences={industryPreferences}
            setIndustryPreferences={setIndustryPreferences}
          />
        </div>
      </StepCardContent>
    </StepCard>
  );
};

export default JobMatchingPreferencesSection;
