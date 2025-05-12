
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface WeeklyCalendarProps {
  selectedTimeSlots: { [key: string]: boolean };
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  timezone: string;
  setTimezone: (zone: string) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour}${ampm}`;
});

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

  const applyTimeRange = (range: typeof COMMON_TIME_RANGES[0]) => {
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
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Time Zone</Label>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time zone" />
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
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Apply Common Work Schedule</Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TIME_RANGES.map((range) => (
            <button
              key={range.name}
              onClick={() => applyTimeRange(range)}
              className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              {range.name}
            </button>
          ))}
        </div>
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
            {HOURS.map((hour, index) => (
              <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                <div className="p-2 text-xs text-right text-muted-foreground border-r">
                  {hour}
                </div>
                {DAYS.map(day => {
                  const isSelected = selectedTimeSlots[`${day}-${index}`];
                  return (
                    <div 
                      key={`${day}-${index}`}
                      className={cn(
                        "border-l h-8 cursor-pointer transition-colors",
                        isSelected ? "bg-primary/20 hover:bg-primary/30" : "bg-background hover:bg-secondary/50"
                      )}
                      onMouseDown={() => handleMouseDown(day, index)}
                      onMouseEnter={() => handleMouseEnter(day, index)}
                    />
                  );
                })}
              </div>
            ))}
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
