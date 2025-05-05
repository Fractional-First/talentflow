
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalendarDays } from 'lucide-react';

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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fractional" 
            checked={availabilityTypes.fractional}
            onCheckedChange={(checked) => 
              setAvailabilityTypes({ ...availabilityTypes, fractional: checked === true })}
          />
          <div>
            <Label htmlFor="fractional" className="font-medium">Fractional</Label>
            <p className="text-sm text-muted-foreground">Part-time commitment, may work with multiple companies</p>
          </div>
        </div>
        
        {availabilityTypes.fractional && (
          <Accordion type="single" collapsible className="ml-7">
            <AccordionItem value="flexibility-options">
              <AccordionTrigger className="text-sm py-2">
                Choose flexibility options
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Preferred Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries({
                        mon: 'Mon',
                        tue: 'Tue',
                        wed: 'Wed',
                        thu: 'Thu',
                        fri: 'Fri',
                        sat: 'Sat',
                        sun: 'Sun'
                      }).map(([key, label]) => (
                        <div key={key} className="flex flex-col items-center">
                          <Checkbox 
                            id={`day-${key}`} 
                            checked={selectedDays[key as keyof typeof selectedDays]}
                            onCheckedChange={(checked) => 
                              setSelectedDays(prev => ({...prev, [key]: checked === true}))}
                            className="mb-1"
                          />
                          <label htmlFor={`day-${key}`} className="text-xs">{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">Time Preference</Label>
                    <RadioGroup defaultValue="all-day" value={timePreference} onValueChange={setTimePreference}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-day" id="all-day" />
                        <Label htmlFor="all-day">All Day</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mornings" id="mornings" />
                        <Label htmlFor="mornings">Mornings Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoons" id="afternoons" />
                        <Label htmlFor="afternoons">Afternoons Only</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
                        <SelectItem value="CST">Central Time (CST/CDT)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST/MDT)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySection;
