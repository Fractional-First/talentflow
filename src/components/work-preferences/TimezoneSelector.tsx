
import { useTimezones } from "@/queries/useTimezones"
import { useState } from "react"
import { Check, ChevronDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimezoneSelectorProps {
  selectedTimezone: string
  onTimezoneChange: (timezone: string) => void
  placeholder?: string
}

const TimezoneSelector = ({
  selectedTimezone,
  onTimezoneChange,
  placeholder = "Select timezone...",
}: TimezoneSelectorProps) => {
  const [open, setOpen] = useState(false)
  const { data: timezones = [], isLoading } = useTimezones()

  const selectedTimezoneData = timezones.find((tz) => tz.id === selectedTimezone)

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between text-sm h-10">
        <div className="flex items-center gap-2 flex-1 truncate">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="truncate">Loading timezones...</span>
        </div>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm h-10"
        >
          <div className="flex items-center gap-2 flex-1 truncate">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {selectedTimezoneData ? selectedTimezoneData.text : placeholder}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search timezones..." />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup>
              {timezones.map((timezone) => (
                <CommandItem
                  key={timezone.id}
                  value={`${timezone.text} ${timezone.value}`}
                  onSelect={() => {
                    onTimezoneChange(timezone.id)
                    setOpen(false)
                  }}
                  className="truncate"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      selectedTimezone === timezone.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="truncate">{timezone.text}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TimezoneSelector
