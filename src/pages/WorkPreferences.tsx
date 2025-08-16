
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
          <StepCardHeader className="text-center pb-8">
            <StepCardTitle className="text-2xl">Job Preferences</StepCardTitle>
            <StepCardDescription className="text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Choose how you'd like to work. You may select one or both options to help us tailor job opportunities and compensation structures to your preferences.
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent className="space-y-8">
            {/* Full-time Position Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Employment Options</h2>
              </div>
              
              <div className="space-y-4">
                {/* Full-time Card */}
                <div className="group">
                  <div
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      form.fullTime.open_for_work
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                    onClick={() => toggleType("fullTime")}
                  >
                    {/* Mobile layout - stacked */}
                    <div className="flex flex-col gap-4 md:hidden">
                      <div className="flex items-center justify-center">
                        <div className={`rounded-lg p-3 transition-colors ${
                          form.fullTime.open_for_work ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                        }`}>
                          <Briefcase className={`h-5 w-5 ${
                            form.fullTime.open_for_work ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Full-time Position</h3>
                        <p className="text-body-mobile text-muted-foreground leading-relaxed mb-4">
                          40 hours per week, dedicated to one company. Traditional employment with benefits and long-term commitment.
                        </p>
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={form.fullTime.open_for_work}
                            className="h-5 w-5 cursor-pointer"
                            onCheckedChange={() => toggleType("fullTime")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - horizontal */}
                    <div className="hidden md:flex items-start gap-4">
                      <div className={`rounded-lg p-3 transition-colors ${
                        form.fullTime.open_for_work ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                      }`}>
                        <Briefcase className={`h-5 w-5 ${
                          form.fullTime.open_for_work ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">Full-time Position</h3>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={form.fullTime.open_for_work}
                              className="h-5 w-5 cursor-pointer"
                              onCheckedChange={() => toggleType("fullTime")}
                            />
                          </div>
                        </div>
                        <p className="text-body-desktop text-muted-foreground leading-relaxed">
                          40 hours per week, dedicated to one company. Traditional employment with benefits and long-term commitment.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full-time Preferences */}
                  {form.fullTime.open_for_work && (
                    <div className="mt-6 md:ml-4 md:border-l-2 md:border-primary/20 md:pl-6">
                      <div className="bg-muted/30 rounded-xl p-6">
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

                <Separator className="my-6" />

                {/* Flexible Position Card */}
                <div className="group">
                  <div
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      form.fractional.open_for_work
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/20"
                    }`}
                    onClick={() => toggleType("fractional")}
                  >
                    {/* Mobile layout - stacked */}
                    <div className="flex flex-col gap-4 md:hidden">
                      <div className="flex items-center justify-center">
                        <div className={`rounded-lg p-3 transition-colors ${
                          form.fractional.open_for_work ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                        }`}>
                          <Clock className={`h-5 w-5 ${
                            form.fractional.open_for_work ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Flexible Position</h3>
                        <p className="text-body-mobile text-muted-foreground leading-relaxed mb-4">
                          Part-time commitment with flexible hours. Work with multiple companies simultaneously on project-based engagements.
                        </p>
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={form.fractional.open_for_work}
                            className="h-5 w-5 cursor-pointer"
                            onCheckedChange={() => toggleType("fractional")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - horizontal */}
                    <div className="hidden md:flex items-start gap-4">
                      <div className={`rounded-lg p-3 transition-colors ${
                        form.fractional.open_for_work ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                      }`}>
                        <Clock className={`h-5 w-5 ${
                          form.fractional.open_for_work ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">Flexible Position</h3>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={form.fractional.open_for_work}
                              className="h-5 w-5 cursor-pointer"
                              onCheckedChange={() => toggleType("fractional")}
                            />
                          </div>
                        </div>
                        <p className="text-body-desktop text-muted-foreground leading-relaxed">
                          Part-time commitment with flexible hours. Work with multiple companies simultaneously on project-based engagements.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Flexible Preferences */}
                  {form.fractional.open_for_work && (
                    <div className="mt-6 md:ml-4 md:border-l-2 md:border-primary/20 md:pl-6">
                      <div className="bg-muted/30 rounded-xl p-6">
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
            <div className="pt-8 border-t">
              <Button
                onClick={handleContinue}
                disabled={!hasSelection || isSaving}
                className="w-full h-12 text-base font-medium rounded-full"
                size="lg"
              >
                {isSaving ? "Saving Job Preferences..." : "Continue"}
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
      <div className="container max-w-4xl py-8 px-4">{renderStepContent()}</div>
    </DashboardLayout>
  )
}

export default WorkPreferences
