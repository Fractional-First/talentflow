import AvailabilitySection from "@/components/work-preferences/AvailabilitySection"
import CompensationSection from "@/components/work-preferences/CompensationSection"
import LocationSection from "@/components/work-preferences/LocationSection"
import IndustryPreferences from "./IndustryPreferences"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"

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
  const locations = form.fractional.locations || []
  const industries = form.fractional.industries || []
  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Compensation Section */}
      <CompensationSection
        paymentType={
          form.fractional.payment_type === "annual"
            ? "hourly"
            : form.fractional.payment_type || "hourly"
        }
        setPaymentType={(type) =>
          setForm((prev) => ({
            ...prev,
            fractional: { ...prev.fractional, payment_type: type },
          }))
        }
        rateRange={
          form.fractional.payment_type === "daily"
            ? [
                form.fractional.min_daily_rate || 0,
                form.fractional.max_daily_rate || 0,
              ]
            : [
                form.fractional.min_hourly_rate || 0,
                form.fractional.max_hourly_rate || 0,
              ]
        }
        setRateRange={([min, max]) =>
          setForm((prev) => ({
            ...prev,
            fractional: {
              ...prev.fractional,
              ...(prev.fractional.payment_type === "daily"
                ? {
                    min_daily_rate: min,
                    max_daily_rate: max,
                  }
                : {
                    min_hourly_rate: min,
                    max_hourly_rate: max,
                  }),
            },
          }))
        }
        showOnly="hourly-daily"
      />

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

      {/* Location Section */}
      <div className="py-4">
        <LocationSection
          form={form}
          setForm={setForm}
          type="fractional"
          currentLocationObj={form.currentLocationObj}
          setCurrentLocation={setCurrentLocation}
          workEligibility={form.work_eligibility || []}
          setWorkEligibility={(codes) =>
            setForm((prev) => ({ ...prev, work_eligibility: codes }))
          }
          remotePreference={form.fractional.remote_ok || false}
          setRemotePreference={(val) =>
            setForm((prev) => ({
              ...prev,
              fractional: { ...prev.fractional, remote_ok: val },
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
            fractional: { ...prev.fractional, industries: ids },
          }))
        }
      />
    </div>
  )
}
