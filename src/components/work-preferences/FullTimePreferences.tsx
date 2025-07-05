
import AvailabilitySection from "@/components/work-preferences/AvailabilitySection"
import CompensationSection from "@/components/work-preferences/CompensationSection"
import LocationSection from "@/components/work-preferences/LocationSection"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"
import IndustryPreferences from "./IndustryPreferences"
import { Separator } from "@/components/ui/separator"

interface FullTimePreferencesProps {
  form: CombinedWorkPreferencesForm
  setForm: (
    updater: (prev: CombinedWorkPreferencesForm) => CombinedWorkPreferencesForm
  ) => void
  currentLocationObj?: any
  setCurrentLocation: (location: string | { place_id: string } | null) => void
}

export const FullTimePreferences = ({
  form,
  setForm,
  setCurrentLocation,
}: FullTimePreferencesProps) => {
  const industries = form.fullTime.industries || []
  
  return (
    <div className="space-y-8">
      {/* Compensation Section */}
      <div className="space-y-4">
        <CompensationSection
          compensationType="salary"
          setCompensationType={() => {}} // Lock to salary for full-time
          minCompensation={form.fullTime.min_salary || 0}
          maxCompensation={form.fullTime.max_salary || 0}
          setMinCompensation={(min) =>
            setForm((prev) => ({
              ...prev,
              fullTime: { ...prev.fullTime, min_salary: min },
            }))
          }
          setMaxCompensation={(max) =>
            setForm((prev) => ({
              ...prev,
              fullTime: { ...prev.fullTime, max_salary: max },
            }))
          }
          isFullTime={true}
        />
      </div>

      <Separator className="my-6" />

      {/* Availability Section */}
      <div className="space-y-4">
        <AvailabilitySection
          availabilityTypes={{ fullTime: true, fractional: false }}
          timezone={form.timezone_id || ""}
          setTimezone={(timezoneId) =>
            setForm((prev) => ({ ...prev, timezone_id: timezoneId }))
          }
          startDate={form.fullTime.start_date}
          setStartDate={(date) =>
            setForm((prev) => ({
              ...prev,
              fullTime: { ...prev.fullTime, start_date: date },
            }))
          }
        />
      </div>

      <Separator className="my-6" />

      {/* Location Section */}
      <div className="space-y-4">
        <LocationSection
          currentLocationObj={form.currentLocationObj}
          setCurrentLocation={setCurrentLocation}
          selectedLocationIds={form.fullTime.locations?.map(l => l.place_id) || []}
          onLocationChange={(locationIds) => {
            // Convert location IDs back to location objects if needed
            // For now, we'll need to handle this conversion properly
            console.log("Location IDs changed:", locationIds)
          }}
          showWorkLocations={true}
          title="Location Preferences"
          description="Set your location preferences for full-time work"
        />
      </div>

      <Separator className="my-6" />

      {/* Industry Preferences */}
      <div className="space-y-4">
        <IndustryPreferences
          value={industries}
          onChange={(ids) =>
            setForm((prev) => ({
              ...prev,
              fullTime: { ...prev.fullTime, industries: ids },
            }))
          }
        />
      </div>
    </div>
  )
}
