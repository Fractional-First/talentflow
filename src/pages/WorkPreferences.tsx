
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import { initialSteps } from "@/components/dashboard/OnboardingSteps"
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSaveWorkPreferences } from "@/hooks/useSaveWorkPreferences"
import { useWorkPreferences, CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { FlexiblePreferences } from "@/components/work-preferences/FlexiblePreferences"
import { FullTimePreferences } from "@/components/work-preferences/FullTimePreferences"
import { WorkPreferencesSection } from "@/components/work-preferences/WorkPreferencesSection"

const WorkPreferences = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("flexible")
  
  const {
    form,
    setForm,
    currentLocationObj,
    setCurrentLocation,
    isLoading: loadingPreferences
  } = useWorkPreferences()

  const { mutate: savePreferences, isPending: savingPreferences } = useSaveWorkPreferences()

  // Set default availability type based on active tab
  useEffect(() => {
    if (activeTab === "flexible") {
      setForm(prev => ({
        ...prev,
        availability_type: "fractional"
      }))
    } else if (activeTab === "fulltime") {
      setForm(prev => ({
        ...prev,
        availability_type: "full_time"
      }))
    }
  }, [activeTab, setForm])

  const handleSave = () => {
    const finalForm = {
      ...form,
      availability_type: activeTab === "flexible" ? "fractional" as const : "full_time" as const
    }

    savePreferences(finalForm, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your work preferences have been saved successfully.",
        })
        navigate("/dashboard")
      },
      onError: (error) => {
        console.error("Error saving preferences:", error)
        toast({
          title: "Error",
          description: "There was an error saving your preferences. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  if (loadingPreferences) {
    return (
      <DashboardLayout steps={initialSteps} currentStep={3}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div>Loading preferences...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout steps={initialSteps} currentStep={3}>
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 mx-auto">
        <StepCard className="w-full max-w-4xl mx-auto">
          <StepCardHeader>
            <StepCardTitle>Work Preferences</StepCardTitle>
            <StepCardDescription>
              Tell us about your ideal work arrangements and preferences
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="flexible">Fractional/Consulting</TabsTrigger>
                <TabsTrigger value="fulltime">Full-Time</TabsTrigger>
              </TabsList>

              <div className="w-full overflow-hidden">
                <TabsContent value="flexible" className="mt-0">
                  <div className="space-y-6 w-full">
                    <FlexiblePreferences
                      form={form}
                      setForm={setForm}
                      currentLocationObj={currentLocationObj}
                      setCurrentLocation={setCurrentLocation}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="fulltime" className="mt-0">
                  <div className="space-y-6 w-full">
                    <FullTimePreferences
                      form={form}
                      setForm={setForm}
                      currentLocationObj={currentLocationObj}
                      setCurrentLocation={setCurrentLocation}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="mt-8 w-full">
              <WorkPreferencesSection
                form={form}
                setForm={setForm}
              />
            </div>
          </StepCardContent>

          <StepCardFooter className="flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/edit-profile")}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>

            <Button
              onClick={handleSave}
              disabled={savingPreferences}
              style={{ backgroundColor: '#449889' }}
              className="hover:opacity-90 text-white w-full sm:w-auto order-1 sm:order-2"
            >
              {savingPreferences ? "Saving..." : "Complete Setup"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  )
}

export default WorkPreferences
