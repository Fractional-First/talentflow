
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface WeeklyCalendarProps {
  selectedTimeSlots: { [key: string]: boolean };
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  timezone: string;
  setTimezone: (zone: string) => void;
}

// Reorder days to start with Sunday
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Define all hours
const ALL_HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour}${ampm}`;
});

// Define working hours for compact view (8AM to 6PM)
const WORKING_HOURS = ALL_HOURS.slice(8, 19);

// Common time ranges people work in
const COMMON_TIME_RANGES = [
  { name: 'Standard Work Hours', start: 9, end: 17, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { name: 'Evening Hours', start: 17, end: 23, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { name: 'Weekend Only', start: 9, end: 17, days: ['Sat', 'Sun'] },
  { name: 'Clear All', start: -1, end: -1, days: [] },
];

export const WeeklyCalendar = ({
  selectedTimeSlots,
  setSelectedTimeSlots,
  timezone,
  setTimezone
}: WeeklyCalendarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: string; hour: number } | null>(null);
  const [dragMode, setDragMode] = useState<boolean | null>(null); // true for selecting, false for deselecting
  const [showFullDay, setShowFullDay] = useState(false);
  const [timezoneSelected, setTimezoneSelected] = useState(!!timezone);

  // Use working hours or all hours based on view mode
  const HOURS = showFullDay ? ALL_HOURS : WORKING_HOURS;
  
  const toggleTimeSlot = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    setSelectedTimeSlots(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMouseDown = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    const newValue = !selectedTimeSlots[key];
    setDragMode(newValue);
    setDragStart({ day, hour });
    setIsDragging(true);
    setSelectedTimeSlots(prev => ({
      ...prev,
      [key]: newValue
    }));
  };

  const handleMouseEnter = (day: string, hour: number) => {
    if (isDragging && dragMode !== null) {
      const key = `${day}-${hour}`;
      setSelectedTimeSlots(prev => ({
        ...prev,
        [key]: dragMode
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
    setDragStart(null);
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    setTimezoneSelected(true);
    toast({
      title: "Timezone updated",
      description: `Your calendar now shows times in ${value}`,
    });
  };

  const applyTimeRange = (range: typeof COMMON_TIME_RANGES[0]) => {
    if (!timezoneSelected) {
      toast({
        title: "Timezone Required",
        description: "Please select a timezone before setting your schedule",
        variant: "destructive",
      });
      return;
    }
    
    if (range.start === -1) {
      // Clear all
      const clearedSlots: { [key: string]: boolean } = {};
      DAYS.forEach(day => {
        for (let hour = 0; hour < 24; hour++) {
          clearedSlots[`${day}-${hour}`] = false;
        }
      });
      setSelectedTimeSlots(clearedSlots);
      return;
    }
    
    const newSlots = { ...selectedTimeSlots };
    
    range.days.forEach(day => {
      for (let hour = range.start; hour < range.end; hour++) {
        newSlots[`${day}-${hour}`] = true;
      }
    });
    
    setSelectedTimeSlots(newSlots);
  };

  return (
    <div className="space-y-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="bg-muted/30 p-4 rounded-md border border-muted">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Time Zone (Required)</Label>
          <Select 
            value={timezone} 
            onValueChange={handleTimezoneChange}
          >
            <SelectTrigger className={`w-full ${!timezoneSelected ? "ring-2 ring-destructive" : ""}`}>
              <SelectValue placeholder="Select your time zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
              <SelectItem value="CST">Central Time (CST/CDT)</SelectItem>
              <SelectItem value="MST">Mountain Time (MST/MDT)</SelectItem>
              <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
              <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
              <SelectItem value="UTC">Universal Coordinated Time (UTC)</SelectItem>
              <SelectItem value="CET">Central European Time (CET)</SelectItem>
              <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
            </SelectContent>
          </Select>
          {!timezoneSelected && (
            <p className="text-xs text-destructive">Please select a time zone before continuing</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Apply Common Work Schedule</Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TIME_RANGES.map((range) => (
            <button
              key={range.name}
              onClick={() => applyTimeRange(range)}
              disabled={!timezoneSelected}
              className={cn(
                "px-3 py-1 text-xs rounded-md",
                timezoneSelected 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Weekly Schedule</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFullDay(!showFullDay)}
            className="text-xs flex items-center gap-1"
          >
            {showFullDay ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show Working Hours
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show Full Day
              </>
            )}
          </Button>
        </div>
        
        <div className="overflow-auto">
          <div className="border rounded-lg min-w-[600px]">
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 text-center font-medium text-sm text-muted-foreground"></div>
              {DAYS.map(day => (
                <div key={day} className="p-2 text-center font-medium text-sm border-l">
                  {day}
                </div>
              ))}
            </div>
            
            <div>
              {HOURS.map((hour, index) => {
                const actualHourIndex = showFullDay ? index : index + 8; // Offset for working hours
                return (
                  <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                    <div className="p-2 text-xs text-right text-muted-foreground border-r">
                      {hour}
                    </div>
                    {DAYS.map(day => {
                      const isSelected = selectedTimeSlots[`${day}-${actualHourIndex}`];
                      return (
                        <div 
                          key={`${day}-${actualHourIndex}`}
                          className={cn(
                            "border-l h-8 cursor-pointer transition-colors",
                            isSelected ? "bg-primary/20 hover:bg-primary/30" : "bg-background hover:bg-secondary/50"
                          )}
                          onMouseDown={() => handleMouseDown(day, actualHourIndex)}
                          onMouseEnter={() => handleMouseEnter(day, actualHourIndex)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Click and drag to select multiple time slots. Selected times indicate your availability.
      </div>
    </div>
  );
};

export default WeeklyCalendar;
