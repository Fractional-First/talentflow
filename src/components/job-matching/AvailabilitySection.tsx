
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

  // Convert selectedDays to selectedTimeSlots format for WeeklyCalendar
  const selectedTimeSlots: { [key: string]: boolean } = {};
  
  // Initialize with empty time slots
  const dayMap = {
    mon: 'Mon',
    tue: 'Tue', 
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun'
  };

  // Convert the selectedDays format to selectedTimeSlots format
  Object.entries(selectedDays).forEach(([key, isSelected]) => {
    const dayName = dayMap[key as keyof typeof dayMap];
    if (isSelected) {
      // Set working hours (9 AM to 5 PM) as selected by default
      for (let hour = 9; hour < 17; hour++) {
        selectedTimeSlots[`${dayName}-${hour}`] = true;
      }
    }
  });

  const setSelectedTimeSlots = (slots: React.SetStateAction<{ [key: string]: boolean }>) => {
    // Convert back to selectedDays format
    const newSlots = typeof slots === 'function' ? slots(selectedTimeSlots) : slots;
    const newSelectedDays = { ...selectedDays };
    
    // Reset all days to false first
    Object.keys(newSelectedDays).forEach(key => {
      newSelectedDays[key as keyof typeof newSelectedDays] = false;
    });
    
    // Check if any time slots are selected for each day
    Object.keys(newSlots).forEach(slotKey => {
      if (newSlots[slotKey]) {
        const [dayName] = slotKey.split('-');
        const dayKey = Object.entries(dayMap).find(([k, v]) => v === dayName)?.[0];
        if (dayKey) {
          newSelectedDays[dayKey as keyof typeof newSelectedDays] = true;
        }
      }
    });
    
    setSelectedDays(newSelectedDays);
  };

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
              <Label className="text-sm mb-3 block">Weekly Schedule</Label>
              <WeeklyCalendar 
                selectedTimeSlots={selectedTimeSlots}
                setSelectedTimeSlots={setSelectedTimeSlots}
                timezone={timezone}
                setTimezone={setTimezone}
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
          </div>
        </>
      )}
    </>
  );
};

export default AvailabilitySection;
