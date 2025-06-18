import { DashboardLayout } from "@/components/DashboardLayout"
import { WorkPreferencesConfirmation } from "@/components/work-preferences/WorkPreferencesConfirmation"
import { FlexiblePreferences } from "@/components/work-preferences/FlexiblePreferences"
import { FullTimePreferences } from "@/components/work-preferences/FullTimePreferences"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, Clock } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import { useWorkPreferences } from "@/hooks/useWorkPreferences"
import { useSaveWorkPreferences } from "@/hooks/useSaveWorkPreferences"

const WorkPreferences = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<
    "placement-type" | "confirmation"
  >("placement-type")

  // Unified form state
  const { form, setForm, isLoading, error, setCurrentLocation } =
    useWorkPreferences()
  const { save, isSaving, error: saveError } = useSaveWorkPreferences()

  // UI state for placement type selection
  const [availabilityTypes, setAvailabilityTypes] = useState({
    fullTime: true,
    fractional: true,
  })

  // Handle toggling placement types
  const toggleType = (type: "fullTime" | "fractional") => {
    setAvailabilityTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  // Save/Continue logic
  const handleContinue = async () => {
    const success = await save(form)
    if (success) {
      setCurrentStep("confirmation")
      localStorage.setItem("onboardingComplete", "true")
    }
  }

  const handleGoToDashboard = () => {
    navigate("/dashboard")
  }

  // Onboarding complete state
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  useState(() => {
    const onboardingStatus = localStorage.getItem("onboardingComplete")
    if (onboardingStatus === "true") {
      setOnboardingComplete(true)
    }
  })

  // Render
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-red-600">
          Error loading preferences: {error.message}
        </div>
      </DashboardLayout>
    )
  }

  const hasSelection =
    availabilityTypes.fullTime || availabilityTypes.fractional

  const renderStepContent = () => {
    if (currentStep === "placement-type") {
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
                  onClick={() => toggleType("fullTime")}
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
                        onCheckedChange={() => toggleType("fullTime")}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      40 hours per week, dedicated to one company. Traditional
                      employment with benefits.
                    </p>
                  </div>
                </button>

                <div
                  className={`mt-4 ml-8 border-l-2 border-primary/30 pl-4 ${
                    !availabilityTypes.fullTime ? "hidden" : ""
                  }`}
                >
                  <div className="pt-2 space-y-6">
                    <FullTimePreferences
                      form={form}
                      setForm={setForm}
                      currentLocationObj={form.currentLocationObj}
                      setCurrentLocation={setCurrentLocation}
                    />
                  </div>
                </div>
              </div>

              {/* Flexible Position Card */}
              <div className="w-full">
                <button
                  onClick={() => toggleType("fractional")}
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
                        onCheckedChange={() => toggleType("fractional")}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Part-time commitment, flexible hours. Work with multiple
                      companies simultaneously.
                    </p>
                  </div>
                </button>

                <div
                  className={`mt-4 ml-8 border-l-2 border-primary/30 pl-4 ${
                    !availabilityTypes.fractional ? "hidden" : ""
                  }`}
                >
                  <div className="pt-2 space-y-6">
                    <FlexiblePreferences
                      form={form}
                      setForm={setForm}
                      currentLocationObj={form.currentLocationObj}
                      setCurrentLocation={setCurrentLocation}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!hasSelection || isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Continue"}
                </Button>
                {saveError && (
                  <div className="text-red-600 mt-2">{saveError.message}</div>
                )}
              </div>
            </div>
          </StepCardContent>
        </StepCard>
      )
    }

    return <WorkPreferencesConfirmation onGoToDashboard={handleGoToDashboard} />
  }

  return (
    <DashboardLayout>
      <div className="container max-w-3xl py-8">{renderStepContent()}</div>
    </DashboardLayout>
  )
}

export default WorkPreferences
