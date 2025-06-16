
import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTimezones } from '@/hooks/useTimezones';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  placeholder?: string;
}

const TimezoneSelector = ({
  selectedTimezone,
  onTimezoneChange,
  placeholder = "Select timezone..."
}: TimezoneSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: timezones, isLoading } = useTimezones();

  const selectedTimezoneData = useMemo(() => {
    return timezones?.find(tz => tz.value === selectedTimezone);
  }, [timezones, selectedTimezone]);

  const filteredTimezones = useMemo(() => {
    if (!timezones) return [];
    
    // Group by major regions for better UX
    const grouped = timezones.reduce((acc, timezone) => {
      const offset = timezone.utc_offset;
      const key = `UTC${offset >= 0 ? '+' : ''}${offset}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(timezone);
      return acc;
    }, {} as Record<string, typeof timezones>);

    return Object.entries(grouped).map(([key, zones]) => ({
      group: key,
      timezones: zones
    }));
  }, [timezones]);

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        Loading timezones...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTimezoneData ? selectedTimezoneData.text : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder="Search timezones..." />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            {filteredTimezones.map(({ group, timezones: groupTimezones }) => (
              <CommandGroup key={group} heading={group}>
                {groupTimezones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={`${timezone.text} ${timezone.value} ${timezone.abbr}`}
                    onSelect={() => {
                      onTimezoneChange(timezone.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTimezone === timezone.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{timezone.text}</span>
                      <span className="text-xs text-muted-foreground">
                        {timezone.abbr} • {timezone.value}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TimezoneSelector;
