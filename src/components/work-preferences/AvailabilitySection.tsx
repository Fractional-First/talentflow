
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
        description: "Set your working timezone and availability"
      }
    } else {
      return {
        title: "Timezone Preferences",
        description: "Set your working timezone"
      }
    }
  }

  const sectionInfo = getSectionInfo()

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{sectionInfo.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {sectionInfo.description}
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 space-y-6">
        {showFractionalOptions && (
          <div className="space-y-6">
            {/* Hours Per Week */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Hours Per Week</Label>
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
                  <div className="bg-primary/10 px-3 py-1 rounded-md">
                    <span className="font-medium text-primary">
                      {hoursPerWeek[0]} hours per week
                    </span>
                  </div>
                  <span className="text-muted-foreground">40 hours</span>
                </div>
              </div>
            </div>

            <hr className="border-border" />
          </div>
        )}

        {/* Timezone - Always show for both full-time and fractional */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Your Timezone</Label>
          <TimezoneSelector
            selectedTimezone={timezone}
            onTimezoneChange={setTimezone}
            placeholder="Select your timezone..."
          />
        </div>
      </div>
    </div>
  )
}

export default AvailabilitySection
