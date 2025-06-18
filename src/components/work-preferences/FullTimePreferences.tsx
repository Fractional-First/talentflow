import AvailabilitySection from "@/components/work-preferences/AvailabilitySection"
import CompensationSection from "@/components/work-preferences/CompensationSection"
import LocationSection from "@/components/work-preferences/LocationSection"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"
import IndustryPreferences from "./IndustryPreferences"

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
  const locations = form.fullTime.locations || []
  const industries = form.fullTime.industries || []
  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Full-time position only shows annual salary option */}
      <CompensationSection
        paymentType="annual"
        setPaymentType={() => {}} // Lock to annual
        rateRange={[
          form.fullTime.min_salary || 0,
          form.fullTime.max_salary || 0,
        ]}
        setRateRange={([min, max]) =>
          setForm((prev) => ({
            ...prev,
            fullTime: { ...prev.fullTime, min_salary: min, max_salary: max },
          }))
        }
        showOnly="annual"
      />

      <AvailabilitySection
        availabilityTypes={{ fullTime: true, fractional: false }}
        timezone={form.timezone_id || ""}
        setTimezone={(timezoneId) =>
          setForm((prev) => ({ ...prev, timezone_id: timezoneId }))
        }
      />

      {/* Location Section */}
      <div className="py-4">
        <LocationSection
          currentLocation={form.current_location_id || ""}
          currentLocationObj={form.currentLocationObj}
          setCurrentLocation={setCurrentLocation}
          workEligibility={form.work_eligibility || []}
          setWorkEligibility={(codes) =>
            setForm((prev) => ({ ...prev, work_eligibility: codes }))
          }
          locationPreferences={locations}
          setLocationPreferences={(locs) =>
            setForm((prev) => ({
              ...prev,
              fullTime: { ...prev.fullTime, locations: locs },
            }))
          }
          remotePreference={form.fullTime.remote_ok || false}
          setRemotePreference={(val) =>
            setForm((prev) => ({
              ...prev,
              fullTime: { ...prev.fullTime, remote_ok: val },
            }))
          }
        />
      </div>

      {/* Industry Preferences */}
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
  )
}
