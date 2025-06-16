
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyCalendar } from './WeeklyCalendar';
import TimezoneSelector from './TimezoneSelector';

interface AvailabilitySectionProps {
  availabilityTypes: {
    fullTime: boolean;
    fractional: boolean;
  };
  setAvailabilityTypes: (types: { fullTime: boolean; fractional: boolean }) => void;
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
  setAvailabilityTypes,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedDays,
  setSelectedDays,
  timePreference,
  setTimePreference,
  timezone,
  setTimezone
}: AvailabilitySectionProps) => {
  const showFractionalOptions = availabilityTypes.fractional;

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Availability Type</h3>
          <p className="text-sm text-muted-foreground">What type of work are you interested in?</p>
        </div>
      </div>
      
      <div className="space-y-4 px-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="full-time"
            checked={availabilityTypes.fullTime}
            onCheckedChange={(checked) =>
              setAvailabilityTypes({
                ...availabilityTypes,
                fullTime: !!checked,
              })
            }
          />
          <Label htmlFor="full-time">Full-time positions</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fractional"
            checked={availabilityTypes.fractional}
            onCheckedChange={(checked) =>
              setAvailabilityTypes({
                ...availabilityTypes,
                fractional: !!checked,
              })
            }
          />
          <Label htmlFor="fractional">Fractional/Part-time positions</Label>
        </div>
      </div>

      {showFractionalOptions && (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Fractional Availability</h3>
              <p className="text-sm text-muted-foreground">Define your availability for fractional work</p>
            </div>
          </div>
          
          <div className="space-y-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date" className="text-sm">Available From</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-sm">Available Until</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm mb-3 block">Days Available</Label>
              <WeeklyCalendar 
                selectedDays={selectedDays}
                onDaysChange={setSelectedDays}
              />
            </div>
            
            <div>
              <Label htmlFor="time-preference" className="text-sm">Time Preference</Label>
              <Select value={timePreference} onValueChange={setTimePreference}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-day">All Day</SelectItem>
                  <SelectItem value="morning">Morning Hours (6 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon Hours (12 PM - 6 PM)</SelectItem>
                  <SelectItem value="evening">Evening Hours (6 PM - 12 AM)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm mb-2 block">Your Timezone</Label>
              <TimezoneSelector
                selectedTimezone={timezone}
                onTimezoneChange={setTimezone}
                placeholder="Select your timezone..."
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AvailabilitySection;
