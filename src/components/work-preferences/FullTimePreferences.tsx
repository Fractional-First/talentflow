
import AvailabilitySection from "@/components/work-preferences/AvailabilitySection"
import CompensationSection from "@/components/work-preferences/CompensationSection"
import LocationSection from "@/components/work-preferences/LocationSection"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"
import IndustryPreferences from "./IndustryPreferences"
import { ProfileCommitmentsSection } from "./ProfileCommitmentsSection"
import { Separator } from "@/components/ui/separator"

interface FullTimePreferencesProps {
  form: CombinedWorkPreferencesForm
  setForm: (
    updater: (prev: CombinedWorkPreferencesForm) => CombinedWorkPreferencesForm
  ) => void
  currentLocationObj?: any
  setCurrentLocation: (location: string | { place_id: string } | null) => void
  keepProfileUpdated: boolean
  setKeepProfileUpdated: (value: boolean) => void
  workAuthorizationConfirmed: boolean
  setWorkAuthorizationConfirmed: (value: boolean) => void
}

export const FullTimePreferences = ({
  form,
  setForm,
  setCurrentLocation,
  keepProfileUpdated,
  setKeepProfileUpdated,
  workAuthorizationConfirmed,
  setWorkAuthorizationConfirmed,
}: FullTimePreferencesProps) => {
  const industries = form.fullTime.industries || []
  
  return (
    <div className="space-y-8">
      {/* Compensation Section */}
      <div className="space-y-4">
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

      <Separator className="my-6" />

      {/* Profile Commitments */}
      <div className="space-y-4">
        <ProfileCommitmentsSection
          keepProfileUpdated={keepProfileUpdated}
          setKeepProfileUpdated={setKeepProfileUpdated}
          workAuthorizationConfirmed={workAuthorizationConfirmed}
          setWorkAuthorizationConfirmed={setWorkAuthorizationConfirmed}
        />
      </div>
    </div>
  )
}
