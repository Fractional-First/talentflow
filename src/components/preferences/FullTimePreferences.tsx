
import AvailabilitySection from "@/components/job-matching/AvailabilitySection"
import CompensationSection from "@/components/job-matching/CompensationSection"
import LocationSection from "@/components/job-matching/LocationSection"
import IndustryPreferences from "./IndustryPreferences"
import React from "react"
import { Separator } from "@/components/ui/separator"

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
    <div className="space-y-8">
      {/* Compensation Section */}
      <div className="bg-white rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Compensation</h3>
          <p className="text-sm text-muted-foreground mt-1">Set your salary expectations for full-time roles</p>
        </div>
        <div className="p-6">
          <CompensationSection
            paymentType="annual"
            setPaymentType={() => {}} // Lock to annual
            rateRange={annualRange}
            setRateRange={setAnnualRange}
            showOnly="annual"
          />
        </div>
      </div>

      {/* Availability & Schedule Section */}
      <div className="bg-white rounded-xl border border-border/50 shadow-soft overflow-hidden">
        <div className="bg-muted/20 px-6 py-4 border-b border-border/30">
          <h3 className="text-lg font-semibold text-foreground">Availability & Schedule</h3>
          <p className="text-sm text-muted-foreground mt-1">Define your preferred working hours and timezone</p>
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
