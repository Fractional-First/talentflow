
import React from "react"
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
}: FlexiblePreferencesProps) => {
  // Separate rate ranges for different compensation types
  const [hourlyRange, setHourlyRange] = React.useState([75, 150])
  const [dailyRange, setDailyRange] = React.useState([500, 1000])

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

  const availabilityTypes = { fullTime: false, fractional: true }
  const setAvailabilityTypes = () => {} // Not used in this context

  // Get the appropriate range based on payment type
  const getCurrentRange = () => {
    switch (paymentType) {
      case "hourly":
        return hourlyRange
      case "daily":
        return dailyRange
      default:
        return hourlyRange
    }
  }

  // Set the appropriate range based on payment type
  const setCurrentRange = (range: number[]) => {
    switch (paymentType) {
      case "hourly":
        setHourlyRange(range)
        break
      case "daily":
        setDailyRange(range)
        break
    }
  }

  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Flexible position only shows hourly and daily rate options */}
      <CompensationSection
        paymentType={paymentType === "annual" ? "hourly" : paymentType}
        setPaymentType={setPaymentType}
        rateRange={getCurrentRange()}
        setRateRange={setCurrentRange}
        showOnly="hourly-daily"
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
