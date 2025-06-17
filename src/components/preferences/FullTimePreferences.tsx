
import AvailabilitySection from "@/components/job-matching/AvailabilitySection"
import CompensationSection from "@/components/job-matching/CompensationSection"
import LocationSection from "@/components/job-matching/LocationSection"
import IndustryPreferences from "./IndustryPreferences"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
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
      <Card className="border-0 shadow-soft">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Compensation Expectations
            </h3>
            <p className="text-sm text-muted-foreground">
              Set your preferred annual compensation range for full-time positions
            </p>
          </div>
          <CompensationSection
            paymentType="annual"
            setPaymentType={() => {}} // Lock to annual
            rateRange={annualRange}
            setRateRange={setAnnualRange}
            showOnly="annual"
          />
        </CardContent>
      </Card>

      {/* Availability Section */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Availability & Schedule
            </h3>
            <p className="text-sm text-muted-foreground">
              Define when you're available to start and your timezone preferences
            </p>
          </div>
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
        </CardContent>
      </Card>

      {/* Location Preferences Section */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Location & Remote Work
            </h3>
            <p className="text-sm text-muted-foreground">
              Specify your location preferences and remote work options
            </p>
          </div>
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
        </CardContent>
      </Card>

      {/* Industry Preferences Section */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Industry Preferences
            </h3>
            <p className="text-sm text-muted-foreground">
              Select the industries where you'd like to find opportunities
            </p>
          </div>
          <IndustryPreferences
            value={industryPreferences}
            onChange={setIndustryPreferences}
          />
        </CardContent>
      </Card>
    </div>
  )
}
