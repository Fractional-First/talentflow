
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
import { Separator } from "@/components/ui/separator"
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
        <StepCard>
          <StepCardHeader className="text-center pb-6 md:pb-8">
            <StepCardTitle className="text-2xl">Work Preferences</StepCardTitle>
            <StepCardDescription className="text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Choose how you'd like to work. You may select one or both options to help us tailor job opportunities and compensation structures to your preferences.
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent className="space-y-6 md:space-y-8">
            {/* Full-time Position Section */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Employment Options</h2>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {/* Full-time Card */}
                <div className="group">
                  <button
                    onClick={() => toggleType("fullTime")}
                    className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all duration-200 ${
                      form.fullTime.open_for_work
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                      <div className={`rounded-lg p-3 transition-colors self-center md:self-start ${
                        form.fullTime.open_for_work ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                      }`}>
                        <Briefcase className={`h-5 w-5 ${
                          form.fullTime.open_for_work ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3 className="text-lg font-semibold">Full-time Position</h3>
                            <Checkbox
                              checked={form.fullTime.open_for_work}
                              className="h-5 w-5 self-center md:self-auto hidden md:block"
                              onCheckedChange={() => toggleType("fullTime")}
                            />
                          </div>
                          <p className="text-body-mobile md:text-body-desktop text-muted-foreground leading-relaxed">
                            40 hours per week, dedicated to one company. Traditional employment with benefits and long-term commitment.
                          </p>
                          <Checkbox
                            checked={form.fullTime.open_for_work}
                            className="h-5 w-5 self-center mt-2 md:hidden"
                            onCheckedChange={() => toggleType("fullTime")}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Full-time Preferences */}
                  {form.fullTime.open_for_work && (
                    <div className="mt-4 md:mt-6 ml-0 md:ml-4 border-l-0 md:border-l-2 border-primary/20 pl-0 md:pl-6">
                      <div className="bg-muted/30 rounded-xl p-4 md:p-6">
                        <FullTimePreferences
                          form={form}
                          setForm={setForm}
                          currentLocationObj={form.currentLocationObj}
                          setCurrentLocation={setCurrentLocation}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-4 md:my-6" />

                {/* Flexible Position Card */}
                <div className="group">
                  <button
                    onClick={() => toggleType("fractional")}
                    className={`w-full p-4 md:p-6 rounded-xl border-2 transition-all duration-200 ${
                      form.fractional.open_for_work
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                      <div className={`rounded-lg p-3 transition-colors self-center md:self-start ${
                        form.fractional.open_for_work ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                      }`}>
                        <Clock className={`h-5 w-5 ${
                          form.fractional.open_for_work ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3 className="text-lg font-semibold">Flexible Position</h3>
                            <Checkbox
                              checked={form.fractional.open_for_work}
                              className="h-5 w-5 self-center md:self-auto hidden md:block"
                              onCheckedChange={() => toggleType("fractional")}
                            />
                          </div>
                          <p className="text-body-mobile md:text-body-desktop text-muted-foreground leading-relaxed">
                            Part-time commitment with flexible hours. Work with multiple companies simultaneously on project-based engagements.
                          </p>
                          <Checkbox
                            checked={form.fractional.open_for_work}
                            className="h-5 w-5 self-center mt-2 md:hidden"
                            onCheckedChange={() => toggleType("fractional")}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Flexible Preferences */}
                  {form.fractional.open_for_work && (
                    <div className="mt-4 md:mt-6 ml-0 md:ml-4 border-l-0 md:border-l-2 border-primary/20 pl-0 md:pl-6">
                      <div className="bg-muted/30 rounded-xl p-4 md:p-6">
                        <FlexiblePreferences
                          form={form}
                          setForm={setForm}
                          currentLocationObj={form.currentLocationObj}
                          setCurrentLocation={setCurrentLocation}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 md:pt-8 border-t">
              <Button
                onClick={handleContinue}
                disabled={!hasSelection || isSaving}
                className="w-full h-12 text-base font-medium rounded-full"
                size="lg"
              >
                {isSaving ? "Saving Preferences..." : "Continue"}
              </Button>
              {saveError && (
                <div className="text-red-600 text-sm mt-3 text-center">
                  {saveError.message}
                </div>
              )}
            </div>
          </StepCardContent>
        </StepCard>
      )
    }

    return <WorkPreferencesConfirmation onGoToDashboard={handleGoToDashboard} />
  }

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-6 md:py-8 px-2 md:px-4">{renderStepContent()}</div>
    </DashboardLayout>
  )
}

export default WorkPreferences
