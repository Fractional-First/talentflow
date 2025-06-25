
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "lucide-react"
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
}

const AvailabilitySection = ({
  availabilityTypes,
  timezone,
  setTimezone,
  minHoursPerWeek = 20,
  maxHoursPerWeek = 20,
  setHoursPerWeek,
}: AvailabilitySectionProps) => {
  const showFractionalOptions = availabilityTypes.fractional

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-[#449889]" />
        <h3 className="text-lg font-semibold text-foreground">
          Availability & Schedule
        </h3>
      </div>
      <p className="text-sm text-muted-foreground pl-8">
        Define your availability for {showFractionalOptions ? "flexible" : "full-time"} work
      </p>

      <div className="pl-8 space-y-6">
        {showFractionalOptions && (
          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">Hours Per Week</Label>
            <div className="space-y-4">
              <Slider
                value={hoursPerWeek}
                onValueChange={handleHoursChange}
                max={40}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">5 hours</span>
                <div className="bg-[#449889]/10 px-3 py-1 rounded-md">
                  <span className="font-medium text-[#449889]">
                    {hoursPerWeek[0]} hours per week
                  </span>
                </div>
                <span className="text-muted-foreground">40 hours</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-base font-medium text-foreground">Your Timezone</Label>
          <TimezoneSelector
            selectedTimezone={timezone}
            onTimezoneChange={setTimezone}
            placeholder="Select your timezone..."
          />
          <p className="text-xs text-muted-foreground">
            9 AM - 6 PM Eastern, 7 AM - 4 PM Central, 6 AM - 3 PM Pacific
          </p>
        </div>
      </div>
    </div>
  )
}

export default AvailabilitySection
