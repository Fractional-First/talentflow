
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
  const industries = form.fullTime.industries || []
  
  return (
    <div className="space-y-8">
      {/* Compensation Section */}
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

      {/* Availability Section */}
      <AvailabilitySection
        availabilityTypes={{ fullTime: true, fractional: false }}
        timezone={form.timezone_id || ""}
        setTimezone={(timezoneId) =>
          setForm((prev) => ({ ...prev, timezone_id: timezoneId }))
        }
      />

      {/* Location Section */}
      <LocationSection
        form={form}
        setForm={setForm}
        type="fullTime"
        currentLocationObj={form.currentLocationObj}
        setCurrentLocation={setCurrentLocation}
        workEligibility={form.work_eligibility || []}
        setWorkEligibility={(codes) =>
          setForm((prev) => ({ ...prev, work_eligibility: codes }))
        }
        remotePreference={form.fullTime.remote_ok || false}
        setRemotePreference={(val) =>
          setForm((prev) => ({
            ...prev,
            fullTime: { ...prev.fullTime, remote_ok: val },
          }))
        }
      />

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
