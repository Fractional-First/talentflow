
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import React from "react"
import TimezoneSelector from "./TimezoneSelector"

interface AvailabilitySectionProps {
  availabilityTypes: {
    fullTime: boolean
    fractional: boolean
  }
  timezone: string
  setTimezone: (zone: string) => void
  minHoursPerWeek?: number | null
  maxHoursPerWeek?: number | null
  setHoursPerWeek?: (hours: number) => void
  startDate?: string | null
  setStartDate?: (date: string | null) => void
}

const AvailabilitySection = ({
  availabilityTypes,
  timezone,
  setTimezone,
  minHoursPerWeek = 20,
  maxHoursPerWeek = 20,
  setHoursPerWeek,
  startDate,
  setStartDate,
}: AvailabilitySectionProps) => {
  const showFractionalOptions = availabilityTypes.fractional
  const showFullTimeOptions = availabilityTypes.fullTime

  const [hoursPerWeek, setLocalHoursPerWeek] = React.useState([
    minHoursPerWeek || 20,
  ])

  React.useEffect(() => {
    if (minHoursPerWeek !== null) {
      setLocalHoursPerWeek([minHoursPerWeek])
    }
  }, [minHoursPerWeek])

  const handleHoursChange = (hours: number[]) => {
    setLocalHoursPerWeek(hours)
    if (setHoursPerWeek) {
      setHoursPerWeek(hours[0])
    }
  }

  // Get section title and description based on availability type
  const getSectionInfo = () => {
    if (showFractionalOptions) {
      return {
        title: "Availability & Schedule",
        description: "Define your availability for fractional work"
      }
    } else if (showFullTimeOptions) {
      return {
        title: "Availability & Schedule", 
        description: "Set your working timezone and preferred start date"
      }
    } else {
      return {
        title: "Timezone Preferences",
        description: "Set your working timezone"
      }
    }
  }

  const sectionInfo = getSectionInfo()

  const selectedDate = startDate ? new Date(startDate) : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (setStartDate) {
      setStartDate(date ? date.toISOString().split('T')[0] : null)
    }
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <CalendarIcon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">{sectionInfo.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {sectionInfo.description}
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-4 sm:p-6 space-y-6 w-full overflow-hidden">
        {showFractionalOptions && (
          <div className="space-y-6">
            {/* Hours Per Week */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Hours Per Week</Label>
              <div className="space-y-4">
                <Slider
                  value={hoursPerWeek}
                  onValueChange={handleHoursChange}
                  max={40}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                  <span className="text-muted-foreground">1 hour</span>
                  <div className="bg-primary/10 px-3 py-1 rounded-full text-center">
                    <span className="font-medium text-primary">
                      {hoursPerWeek[0]} {hoursPerWeek[0] === 1 ? 'hour' : 'hours'} per week
                    </span>
                  </div>
                  <span className="text-muted-foreground">40 hours</span>
                </div>
              </div>
            </div>

            <hr className="border-border" />
          </div>
        )}

        {showFullTimeOptions && (
          <div className="space-y-6">
            {/* Preferred Start Date */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Preferred Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        "Select start date"
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <hr className="border-border" />
          </div>
        )}

        {/* Timezone - Always show for both full-time and fractional */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Your Timezone</Label>
          <div className="w-full">
            <TimezoneSelector
              selectedTimezone={timezone}
              onTimezoneChange={setTimezone}
              placeholder="Select your timezone..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvailabilitySection
