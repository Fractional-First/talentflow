
import React from "react"
import AvailabilitySection from "@/components/job-matching/AvailabilitySection"
import CompensationSection from "@/components/job-matching/CompensationSection"
import LocationSection from "@/components/job-matching/LocationSection"
import IndustryPreferences from "./IndustryPreferences"
import { Separator } from "@/components/ui/separator"

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
    <div className="space-y-8">
      {/* Compensation Section */}
      <div className="bg-white rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Compensation</h3>
          <p className="text-sm text-muted-foreground mt-1">Set your hourly or daily rate expectations for flexible work</p>
        </div>
        <div className="p-6">
          <CompensationSection
            paymentType={paymentType === "annual" ? "hourly" : paymentType}
            setPaymentType={setPaymentType}
            rateRange={getCurrentRange()}
            setRateRange={setCurrentRange}
            showOnly="hourly-daily"
          />
        </div>
      </div>

      {/* Availability & Schedule Section */}
      <div className="bg-white rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Availability & Schedule</h3>
          <p className="text-sm text-muted-foreground mt-1">Define your flexible working hours and commitment level</p>
        </div>
        <div className="p-6">
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
        </div>
      </div>

      {/* Location & Remote Work Section */}
      <div className="bg-white rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Location & Remote Work</h3>
          <p className="text-sm text-muted-foreground mt-1">Configure your location preferences and remote work options</p>
        </div>
        <div className="p-6">
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
      </div>

      {/* Industry Preferences Section */}
      <div className="bg-white rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Industry Preferences</h3>
          <p className="text-sm text-muted-foreground mt-1">Select the industries you're most interested in working with</p>
        </div>
        <div className="p-6">
          <IndustryPreferences
            value={industryPreferences}
            onChange={setIndustryPreferences}
          />
        </div>
      </div>
    </div>
  )
}
