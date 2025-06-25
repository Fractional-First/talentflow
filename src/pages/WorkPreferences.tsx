
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
  const { form, setForm, isLoading, error, setCurrentLocation, initialized } =
    useWorkPreferences()
  const { save, isSaving, error: saveError } = useSaveWorkPreferences()

  // Handle toggling placement types
  const toggleType = (type: "fullTime" | "fractional") => {
    setForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        open_for_work: !prev[type].open_for_work,
      },
    }))
  }

  // Save/Continue logic
  const handleContinue = async () => {
    const success = await save(form)
    if (success) {
      setCurrentStep("confirmation")
    }
  }

  const handleGoToDashboard = () => {
    navigate("/dashboard")
  }

  // Render
  if (isLoading || !initialized) {
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
    form.fullTime.open_for_work || form.fractional.open_for_work

  const renderStepContent = () => {
    if (currentStep === "placement-type") {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Select Your Preferred Placement Type
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose how you'd like to work. You may select one or both options. This will help us tailor job opportunities 
              and compensation structures to your preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Full-time Position Card */}
            <div 
              className={`relative border-2 rounded-xl transition-all duration-200 ${
                form.fullTime.open_for_work
                  ? "border-[#449889] bg-[#449889]/5"
                  : "border-border hover:border-[#449889]/50"
              }`}
            >
              <div className="flex items-start gap-4 p-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  form.fullTime.open_for_work ? "bg-[#449889]/15" : "bg-muted"
                }`}>
                  <Briefcase className={`h-5 w-5 ${
                    form.fullTime.open_for_work ? "text-[#449889]" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">Full-time Position</h3>
                    <Checkbox
                      checked={form.fullTime.open_for_work}
                      onCheckedChange={() => toggleType("fullTime")}
                      className="h-5 w-5"
                    />
                  </div>
                  <p className="text-muted-foreground text-base mb-4">
                    40 hours per week, dedicated to one company. Traditional employment with benefits 
                    and long-term commitment.
                  </p>
                </div>
              </div>

              {/* Full-time Preferences */}
              {form.fullTime.open_for_work && (
                <div className="border-t bg-background/50 p-6">
                  <FullTimePreferences
                    form={form}
                    setForm={setForm}
                    currentLocationObj={form.currentLocationObj}
                    setCurrentLocation={setCurrentLocation}
                  />
                </div>
              )}
            </div>

            {/* Flexible Position Card */}
            <div 
              className={`relative border-2 rounded-xl transition-all duration-200 ${
                form.fractional.open_for_work
                  ? "border-[#449889] bg-[#449889]/5"
                  : "border-border hover:border-[#449889]/50"
              }`}
            >
              <div className="flex items-start gap-4 p-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  form.fractional.open_for_work ? "bg-[#449889]/15" : "bg-muted"
                }`}>
                  <Clock className={`h-5 w-5 ${
                    form.fractional.open_for_work ? "text-[#449889]" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">Flexible Position</h3>
                    <Checkbox
                      checked={form.fractional.open_for_work}
                      onCheckedChange={() => toggleType("fractional")}
                      className="h-5 w-5"
                    />
                  </div>
                  <p className="text-muted-foreground text-base mb-4">
                    Part-time commitment with flexible hours. Work with multiple companies simultaneously 
                    on project-based engagements.
                  </p>
                </div>
              </div>

              {/* Flexible Preferences */}
              {form.fractional.open_for_work && (
                <div className="border-t bg-background/50 p-6">
                  <FlexiblePreferences
                    form={form}
                    setForm={setForm}
                    currentLocationObj={form.currentLocationObj}
                    setCurrentLocation={setCurrentLocation}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!hasSelection || isSaving}
              className="w-full max-w-md h-12 text-base font-medium bg-[#449889] hover:bg-[#449889]/90"
              size="lg"
            >
              {isSaving ? "Saving Preferences..." : "Continue Setup"}
            </Button>
            {saveError && (
              <div className="text-red-600 text-sm mt-3 text-center">
                {saveError.message}
              </div>
            )}
          </div>
        </div>
      )
    }

    return <WorkPreferencesConfirmation onGoToDashboard={handleGoToDashboard} />
  }

  return (
    <DashboardLayout>
      <div className="container max-w-6xl py-8 px-4">{renderStepContent()}</div>
    </DashboardLayout>
  )
}

export default WorkPreferences
