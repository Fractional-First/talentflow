import { DashboardLayout } from "@/components/DashboardLayout"
import { JobMatchingConfirmation } from "@/components/job-matching/JobMatchingConfirmation"
import { FlexiblePreferences } from "@/components/preferences/FlexiblePreferences"
import { FullTimePreferences } from "@/components/preferences/FullTimePreferences"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, Clock, Home } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const JobMatching = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<
    "placement-type" | "confirmation"
  >("placement-type")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Updated placement type state to handle multiple selections
  const [availabilityTypes, setAvailabilityTypes] = useState({
    fullTime: false,
    fractional: false,
  })

  const [rateRange, setRateRange] = useState([75000, 100000])
  const [paymentType, setPaymentType] = useState("annual")
  const [remotePreference, setRemotePreference] = useState(true)
  const [currentLocation, setCurrentLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [timezone, setTimezone] = useState("Eastern Standard Time")
  const [locationPreferences, setLocationPreferences] = useState<string[]>([])
  // Updated to store country codes (alpha2) instead of country names
  const [workEligibility, setWorkEligibility] = useState<string[]>([])
  // Updated to store industry IDs instead of industry names - starting empty
  const [industryPreferences, setIndustryPreferences] = useState<string[]>([])

  const handleContinue = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setCurrentStep("confirmation")
      // Mark onboarding as complete when reaching confirmation
      localStorage.setItem("onboardingComplete", "true")
    }, 1000)
  }

  const handleGoToDashboard = () => {
    navigate("/dashboard")
  }

  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useState(() => {
    const onboardingStatus = localStorage.getItem("onboardingComplete")
    if (onboardingStatus === "true") {
      setOnboardingComplete(true)
    }
  })

  // Handle selection of placement types and update the backward compatibility variable
  const handleSelectTypes = (types: {
    fullTime: boolean
    fractional: boolean
  }) => {
    setAvailabilityTypes(types)
  }

  const renderStepContent = () => {
    if (currentStep === "placement-type") {
      const toggleType = (type: "fullTime" | "fractional") => {
        handleSelectTypes({
          ...availabilityTypes,
          [type]: !availabilityTypes[type],
        })
      }

      const hasSelection =
        availabilityTypes.fullTime || availabilityTypes.fractional

      // Set appropriate payment type when selecting position type
      const handleFullTimeToggle = () => {
        if (!availabilityTypes.fullTime) {
          setPaymentType("annual") // Force annual salary for full-time
        }
        toggleType("fullTime")
      }

      const handleFlexibleToggle = () => {
        if (!availabilityTypes.fractional) {
          setPaymentType("hourly") // Default to hourly for flexible positions
        }
        toggleType("fractional")
      }

      return (
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Select Your Preferred Placement Type</StepCardTitle>
            <StepCardDescription>
              Choose how you'd like to work. You may select one or both options.
              This will help us tailor job opportunities and compensation
              structures to your preferences.
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <div className="space-y-6">
              {/* Full-time Position Card */}
              <div className="w-full">
                <button
                  onClick={handleFullTimeToggle}
                  className={`w-full p-6 rounded-lg border-2 transition-all flex items-start ${
                    availabilityTypes.fullTime
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`rounded-full p-2 mr-4 ${
                      availabilityTypes.fullTime ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <Briefcase
                      className={`h-6 w-6 ${
                        availabilityTypes.fullTime
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-grow text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Full-time Position</h4>
                      <Checkbox
                        checked={availabilityTypes.fullTime}
                        className="ml-2"
                        onCheckedChange={handleFullTimeToggle}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      40 hours per week, dedicated to one company. Traditional
                      employment with benefits.
                    </p>
                  </div>
                </button>

                {availabilityTypes.fullTime && (
                  <div className="mt-4 ml-8 border-l-2 border-primary/30 pl-4">
                    <div className="pt-2 space-y-6">
                      <FullTimePreferences
                        rateRange={rateRange}
                        setRateRange={setRateRange}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        timezone={timezone}
                        setTimezone={setTimezone}
                        remotePreference={remotePreference}
                        setRemotePreference={setRemotePreference}
                        industryPreferences={industryPreferences}
                        setIndustryPreferences={setIndustryPreferences}
                        currentLocation={currentLocation}
                        setCurrentLocation={setCurrentLocation}
                        locationPreferences={locationPreferences}
                        setLocationPreferences={setLocationPreferences}
                        workEligibility={workEligibility}
                        setWorkEligibility={setWorkEligibility}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Flexible Position Card */}
              <div className="w-full">
                <button
                  onClick={handleFlexibleToggle}
                  className={`w-full p-6 rounded-lg border-2 transition-all flex items-start ${
                    availabilityTypes.fractional
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`rounded-full p-2 mr-4 ${
                      availabilityTypes.fractional
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    <Clock
                      className={`h-6 w-6 ${
                        availabilityTypes.fractional
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-grow text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Flexible Position</h4>
                      <Checkbox
                        checked={availabilityTypes.fractional}
                        className="ml-2"
                        onCheckedChange={handleFlexibleToggle}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Part-time commitment, flexible hours. Work with multiple
                      companies simultaneously.
                    </p>
                  </div>
                </button>

                {availabilityTypes.fractional && (
                  <div className="mt-4 ml-8 border-l-2 border-primary/30 pl-4">
                    <div className="pt-2 space-y-6">
                      <FlexiblePreferences
                        rateRange={rateRange}
                        setRateRange={setRateRange}
                        paymentType={paymentType}
                        setPaymentType={setPaymentType}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        timezone={timezone}
                        setTimezone={setTimezone}
                        remotePreference={remotePreference}
                        setRemotePreference={setRemotePreference}
                        industryPreferences={industryPreferences}
                        setIndustryPreferences={setIndustryPreferences}
                        currentLocation={currentLocation}
                        setCurrentLocation={setCurrentLocation}
                        locationPreferences={locationPreferences}
                        setLocationPreferences={setLocationPreferences}
                        workEligibility={workEligibility}
                        setWorkEligibility={setWorkEligibility}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!hasSelection || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : "Complete Setup"}
                </Button>
              </div>
            </div>
          </StepCardContent>
        </StepCard>
      )
    }

    if (currentStep === "confirmation") {
      return <JobMatchingConfirmation onGoToDashboard={handleGoToDashboard} />
    }
  }

  return (
    <DashboardLayout sidebar={false} className="space-y-6">
      <div className="space-y-6">
        {onboardingComplete && currentStep !== "confirmation" && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        )}

        {renderStepContent()}
      </div>
    </DashboardLayout>
  )
}

export default JobMatching
