import AvailabilitySection from "@/components/job-matching/AvailabilitySection"
import CompensationSection from "@/components/job-matching/CompensationSection"
import LocationSection from "@/components/job-matching/LocationSection"
import IndustryPreferences from "./IndustryPreferences"

interface FlexiblePreferencesProps {
  rateRange: number[]
  setRateRange: (range: number[]) => void
  paymentType: string
  setPaymentType: (type: string) => void
  startDate: string
  setStartDate: (date: string) => void
  timezone: string
  setTimezone: (zone: string) => void
  remotePreference: boolean
  setRemotePreference: (preference: boolean) => void
  industryPreferences: string[]
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>
  currentLocation: string
  setCurrentLocation: (location: string) => void
  locationPreferences: string[]
  setLocationPreferences: React.Dispatch<React.SetStateAction<string[]>>
  workEligibility: string[]
  setWorkEligibility: React.Dispatch<React.SetStateAction<string[]>>
}

export const FlexiblePreferences = ({
  rateRange,
  setRateRange,
  paymentType,
  setPaymentType,
  timezone,
  setTimezone,
  remotePreference,
  setRemotePreference,
  industryPreferences,
  setIndustryPreferences,
  currentLocation,
  setCurrentLocation,
  locationPreferences,
  setLocationPreferences,
  workEligibility,
  setWorkEligibility,
}: FlexiblePreferencesProps) => {
  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Flexible position only shows hourly and daily rate options */}
      <CompensationSection
        paymentType={paymentType === "annual" ? "hourly" : paymentType}
        setPaymentType={setPaymentType}
        rateRange={rateRange}
        setRateRange={setRateRange}
        showOnly="hourly-daily"
      />

      <AvailabilitySection
        availabilityTypes={{ fullTime: false, fractional: true }}
        timezone={timezone}
        setTimezone={setTimezone}
      />

      {/* Location Section */}
      <div className="py-4">
        <LocationSection
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          workEligibility={workEligibility}
          setWorkEligibility={setWorkEligibility}
          locationPreferences={locationPreferences}
          setLocationPreferences={setLocationPreferences}
          remotePreference={remotePreference}
          setRemotePreference={setRemotePreference}
        />
      </div>

      {/* Industry Preferences */}
      <IndustryPreferences
        value={industryPreferences}
        onChange={setIndustryPreferences}
      />
    </div>
  )
}
