import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from 'lucide-react';
import React from 'react';
import TimezoneSelector from './TimezoneSelector';
interface AvailabilitySectionProps {
  availabilityTypes: {
    fullTime: boolean;
    fractional: boolean;
  };
  setAvailabilityTypes: (types: {
    fullTime: boolean;
    fractional: boolean;
  }) => void;
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
const AvailabilitySection = ({
  availabilityTypes,
  timezone,
  setTimezone
}: AvailabilitySectionProps) => {
  const showFractionalOptions = availabilityTypes.fractional;

  // State for hours per week (default to 20 hours for fractional work)
  const [hoursPerWeek, setHoursPerWeek] = React.useState([20]);
  return <>
      {showFractionalOptions && <>
          <div className="flex items-center gap-2 mb-6">
            
            <div>
              
              
            </div>
          </div>
          
          <div className="space-y-6 px-4">
            <div>
              <Label className="text-sm mb-3 block">Hours Per Week</Label>
              <div className="space-y-4">
                <Slider value={hoursPerWeek} onValueChange={setHoursPerWeek} max={40} min={5} step={5} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5 hours</span>
                  <span className="font-medium text-foreground">{hoursPerWeek[0]} hours per week</span>
                  <span>40 hours</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm mb-2 block">Your Timezone</Label>
              <TimezoneSelector selectedTimezone={timezone} onTimezoneChange={setTimezone} placeholder="Select your timezone..." />
            </div>
          </div>
        </>}
    </>;
};
export default AvailabilitySection;