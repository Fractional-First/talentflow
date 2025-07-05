
import AvailabilitySection from "@/components/work-preferences/AvailabilitySection"
import CompensationSection from "@/components/work-preferences/CompensationSection"
import LocationSection from "@/components/work-preferences/LocationSection"
import IndustryPreferences from "./IndustryPreferences"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"
import { Separator } from "@/components/ui/separator"

interface FlexiblePreferencesProps {
  form: CombinedWorkPreferencesForm
  setForm: (
    updater: (prev: CombinedWorkPreferencesForm) => CombinedWorkPreferencesForm
  ) => void
  currentLocationObj?: any
  setCurrentLocation: (location: string | { place_id: string } | null) => void
}

export const FlexiblePreferences = ({
  form,
  setForm,
  setCurrentLocation,
}: FlexiblePreferencesProps) => {
  const industries = form.fractional.industries || []
  
  return (
    <div className="space-y-8">
      {/* Compensation Section */}
      <div className="space-y-4">
        <CompensationSection
          compensationType={
            form.fractional.payment_type === "annual"
              ? "hourly"
              : (form.fractional.payment_type as "hourly" | "daily") || "hourly"
          }
          setCompensationType={(type) =>
            setForm((prev) => ({
              ...prev,
              fractional: { ...prev.fractional, payment_type: type },
            }))
          }
          minCompensation={
            form.fractional.payment_type === "daily"
              ? form.fractional.min_daily_rate || 0
              : form.fractional.min_hourly_rate || 0
          }
          maxCompensation={
            form.fractional.payment_type === "daily"
              ? form.fractional.max_daily_rate || 0
              : form.fractional.max_hourly_rate || 0
          }
          setMinCompensation={(min) =>
            setForm((prev) => ({
              ...prev,
              fractional: {
                ...prev.fractional,
                ...(prev.fractional.payment_type === "daily"
                  ? { min_daily_rate: min }
                  : { min_hourly_rate: min }),
              },
            }))
          }
          setMaxCompensation={(max) =>
            setForm((prev) => ({
              ...prev,
              fractional: {
                ...prev.fractional,
                ...(prev.fractional.payment_type === "daily"
                  ? { max_daily_rate: max }
                  : { max_hourly_rate: max }),
              },
            }))
          }
          isFullTime={false}
        />
      </div>

      <Separator className="my-6" />

      {/* Availability Section */}
      <div className="space-y-4">
        <AvailabilitySection
          availabilityTypes={{ fullTime: false, fractional: true }}
          timezone={form.timezone_id || ""}
          setTimezone={(timezoneId) =>
            setForm((prev) => ({ ...prev, timezone_id: timezoneId }))
          }
          minHoursPerWeek={form.fractional.min_hours_per_week}
          maxHoursPerWeek={form.fractional.max_hours_per_week}
          setHoursPerWeek={(hours) =>
            setForm((prev) => ({
              ...prev,
              fractional: {
                ...prev.fractional,
                min_hours_per_week: hours,
                max_hours_per_week: hours,
              },
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
          selectedLocationIds={form.fractional.locations?.map(l => l.place_id) || []}
          onLocationChange={(locationIds) => {
            // Convert location IDs back to location objects if needed
            // For now, we'll need to handle this conversion properly
            console.log("Location IDs changed:", locationIds)
          }}
          showWorkLocations={true}
          title="Location Preferences"
          description="Set your location preferences for flexible work"
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
              fractional: { ...prev.fractional, industries: ids },
            }))
          }
        />
      </div>
    </div>
  )
}
