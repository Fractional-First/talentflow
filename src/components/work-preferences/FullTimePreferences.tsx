import AvailabilitySection from "@/components/work-preferences/AvailabilitySection"
import CompensationSection from "@/components/work-preferences/CompensationSection"
import LocationSection from "@/components/work-preferences/LocationSection"
import IndustryPreferences from "./IndustryPreferences"

interface FullTimePreferencesProps {
  rateRange: number[]
  setRateRange: (range: number[]) => void
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

export const FullTimePreferences = ({
  rateRange,
  setRateRange,
  startDate,
  setStartDate,
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
}: FullTimePreferencesProps) => {
  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Full-time position only shows annual salary option */}
      <CompensationSection
        paymentType="annual"
        setPaymentType={() => {}} // Lock to annual
        rateRange={rateRange}
        setRateRange={setRateRange}
        showOnly="annual"
      />

      <AvailabilitySection
        availabilityTypes={{ fullTime: true, fractional: false }}
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
