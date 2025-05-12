
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalendarDays, Clock } from 'lucide-react';
import WeeklyCalendar from './WeeklyCalendar';

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
  // Create a state for selected time slots based on the current selectedDays
  const initialTimeSlots = {} as { [key: string]: boolean };
  
  // Map days to indices in the weekly calendar
  const daysMap: { [key: string]: string } = {
    'mon': 'Mon',
    'tue': 'Tue',
    'wed': 'Wed',
    'thu': 'Thu',
    'fri': 'Fri', 
    'sat': 'Sat',
    'sun': 'Sun'
  };
  
  // Set initial time slots based on existing preferences
  Object.entries(selectedDays).forEach(([day, selected]) => {
    if (selected) {
      // If this day is selected, set the proper time range based on preference
      const startHour = timePreference === 'mornings' ? 8 : timePreference === 'afternoons' ? 13 : 9;
      const endHour = timePreference === 'mornings' ? 12 : timePreference === 'afternoons' ? 17 : 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        initialTimeSlots[`${daysMap[day]}-${hour}`] = true;
      }
    }
  });
  
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(initialTimeSlots);
  
  // Handle updates to the time slots by updating the selectedDays and timePreference
  const handleTimeSlotsChange = (newTimeSlots: { [key: string]: boolean }) => {
    setSelectedTimeSlots(newTimeSlots);
    
    // Update selectedDays based on whether any time slot for a day is selected
    const updatedDays = { ...selectedDays };
    Object.entries(daysMap).forEach(([dayKey, dayValue]) => {
      const hasActiveSlot = Object.keys(newTimeSlots).some(
        key => key.startsWith(dayValue) && newTimeSlots[key]
      );
      updatedDays[dayKey as keyof typeof selectedDays] = hasActiveSlot;
    });
    
    setSelectedDays(updatedDays);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Availability & Schedule</h3>
          <p className="text-sm text-muted-foreground">Set your work availability preferences</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {!availabilityTypes.fractional && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="full-time" 
                checked={availabilityTypes.fullTime}
                onCheckedChange={(checked) => 
                  setAvailabilityTypes({ ...availabilityTypes, fullTime: checked === true })}
              />
              <div>
                <Label htmlFor="full-time" className="font-medium">Full-time</Label>
                <p className="text-sm text-muted-foreground">40 hours per week, dedicated to one company</p>
              </div>
            </div>
            
            {availabilityTypes.fullTime && (
              <Accordion type="single" collapsible className="ml-7">
                <AccordionItem value="start-date">
                  <AccordionTrigger className="text-sm py-2">
                    Specify start date
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Label htmlFor="ft-start-date" className="text-sm">Earliest Start Date</Label>
                      <Input
                        id="ft-start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
        
        {!availabilityTypes.fullTime && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fractional" 
                checked={availabilityTypes.fractional}
                onCheckedChange={(checked) => 
                  setAvailabilityTypes({ ...availabilityTypes, fractional: checked === true })}
              />
              <div>
                <Label htmlFor="fractional" className="font-medium">Flexible</Label>
                <p className="text-sm text-muted-foreground">Part-time commitment, may work with multiple companies</p>
              </div>
            </div>
            
            {availabilityTypes.fractional && (
              <Accordion type="single" defaultValue="flexibility-options" collapsible className="ml-7">
                <AccordionItem value="flexibility-options">
                  <AccordionTrigger className="text-sm py-2">
                    Choose flexibility options
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Weekly Schedule</Label>
                      </div>
                      
                      <WeeklyCalendar 
                        selectedTimeSlots={selectedTimeSlots}
                        setSelectedTimeSlots={handleTimeSlotsChange}
                        timezone={timezone}
                        setTimezone={setTimezone}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySection;
