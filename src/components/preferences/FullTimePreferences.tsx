
import AvailabilitySection from "@/components/job-matching/AvailabilitySection"
import CompensationSection from "@/components/job-matching/CompensationSection"
import LocationSection from "@/components/job-matching/LocationSection"
import IndustryPreferences from "./IndustryPreferences"
import React from "react"

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
  // Separate state for annual salary range with appropriate default values
  const [annualRange, setAnnualRange] = React.useState([75000, 150000])

  // Add missing state variables needed by AvailabilitySection
  const [endDate, setEndDate] = React.useState("")
  const [selectedDays, setSelectedDays] = React.useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  })
  const [timePreference, setTimePreference] = React.useState("business-hours")

  const availabilityTypes = { fullTime: true, fractional: false }
  const setAvailabilityTypes = () => {} // Not used in this context

  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Full-time position only shows annual salary option */}
      <CompensationSection
        paymentType="annual"
        setPaymentType={() => {}} // Lock to annual
        rateRange={annualRange}
        setRateRange={setAnnualRange}
        showOnly="annual"
      />

      <AvailabilitySection
        availabilityTypes={availabilityTypes}
        setAvailabilityTypes={setAvailabilityTypes}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        timePreference={timePreference}
        setTimePreference={setTimePreference}
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
