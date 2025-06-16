import { initialSteps } from "@/components/dashboard/OnboardingSteps"
import { DashboardLayout } from "@/components/DashboardLayout"
import { BasicInfoSection } from "@/components/EditProfile/BasicInfoSection"
import { EditableArraySection } from "@/components/EditProfile/EditableArraySection"
import { EditableTextSection } from "@/components/EditProfile/EditableTextSection"
import { FunctionalSkillsSection } from "@/components/EditProfile/FunctionalSkillsSection"
import { PersonasSection } from "@/components/EditProfile/PersonasSection"
import { SuperpowersSection } from "@/components/EditProfile/SuperpowersSection"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useClickOutside } from "@/hooks/useClickOutside"
import { usePersonaEditState } from "@/hooks/usePersonaEditState"
import { useProfileForm } from "@/hooks/useProfileForm"
import { useSuperpowerEditState } from "@/hooks/useSuperpowerEditState"
import { supabase } from "@/integrations/supabase/client"
import { getUserInitials } from "@/lib/utils"
import { useProfileSnapshot } from "@/queries/useProfileSnapshot"
import type { EditStates, ProfileData } from "@/types/profile"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCompleteOnboarding } from "@/queries/useCompleteOnboarding"

const ProfileSnapshot = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch profile data using the new hook
  const { profileData, isLoading, error } = useProfileSnapshot()

  // Initialize formData state first
  const [formData, setFormData] = useProfileForm({
    user,
    profileData,
    toast: (opts: {
      title: string
      description: string
      variant: "default" | "destructive"
    }) => {
      toast(opts)
    },
  })

  // Add activeTab state for personas
  const [personasActiveTab, setPersonasActiveTab] = useState("0")

  const {
    personaEditStates,
    handlePersonaLocalUpdate,
    handleAddPersona,
    handleRemovePersona,
    syncPersonaEditStates,
  } = usePersonaEditState({ personas: formData.personas || [], setFormData })

  const { syncSuperpowerEditStates } = useSuperpowerEditState({
    superpowers: formData.superpowers || [],
    setFormData,
  })

  useAutoSave({ user, formData, profileData, toast: (opts) => toast(opts) })

  // Restore toggleEdit function
  const toggleEdit = (section: keyof EditStates) => {
    setEditStates((prev) => {
      // If already editing this section, turn it off
      if (prev[section]) {
        return { ...prev, [section]: false }
      }
      // Otherwise, set only this section to true, all others to false
      const newState: EditStates = Object.keys(prev).reduce((acc, key) => {
        acc[key as keyof EditStates] = false
        return acc
      }, {} as EditStates)
      newState[section] = true

      // When entering edit mode for personas, sync local state with current data
      if (section === "personas" && formData.personas) {
        syncPersonaEditStates(formData.personas)
      }
      // When entering edit mode for superpowers, sync local state with current data
      if (section === "superpowers" && formData.superpowers) {
        syncSuperpowerEditStates(formData.superpowers)
      }
      return newState
    })
  }

  const [editStates, setEditStates] = useState<EditStates>({
    basicInfo: false,
    description: false,
    keyRoles: false,
    focusAreas: false,
    industries: false,
    geographicalCoverage: false,
    stages: false,
    personalInterests: false,
    certifications: false,
    engagementOptions: false,
    meetIntro: false,
    personas: false,
    superpowers: false,
    sweetSpot: false,
    userManual: false,
    functionalSkills: false,
  })

  const mainContentRef = useRef<HTMLDivElement>(null)

  useClickOutside(mainContentRef, () => {
    setEditStates((prev) => {
      if (Object.values(prev).some((v) => v)) {
        const closed: EditStates = Object.keys(prev).reduce((acc, key) => {
          acc[key as keyof EditStates] = false
          return acc
        }, {} as EditStates)
        return closed
      }
      return prev
    })
  })

  const completeOnboardingMutation = useCompleteOnboarding()

  const handleContinue = async () => {
    setIsSubmitting(true)
    completeOnboardingMutation.mutate(undefined, {
      onError: (error) => {
        console.error("Error updating onboarding status:", error)
        toast({
          title: "Error",
          description: "Failed to complete onboarding.",
          variant: "destructive",
        })
      },
      onSettled: () => {
        setIsSubmitting(false)
      },
    })
  }

  // Handle input changes for form fields
  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <DashboardLayout steps={initialSteps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center">Loading profile...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    console.error("Profile query error:", error)
    return (
      <DashboardLayout steps={initialSteps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center text-red-600">
            <p>Error loading profile. Please try again.</p>
            <p className="text-sm mt-2">Error: {error.message}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Check if we have meaningful profile data
  if (!profileData || !formData.name) {
    return (
      <DashboardLayout steps={initialSteps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center">
            <p>No profile data found.</p>
            <p className="text-sm text-gray-600 mt-2">
              Please complete your profile creation first.
            </p>
            <Button
              onClick={() => navigate("/dashboard/profile-creation")}
              className="mt-4"
            >
              Go to Profile Creation
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout steps={initialSteps} currentStep={3}>
      <div ref={mainContentRef} className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="relative mb-4 inline-block">
                <Avatar className="h-32 w-32 shadow-lg border-4 border-white">
                  <AvatarImage src={formData?.profilePicture} />
                  <AvatarFallback className="text-2xl bg-[#449889] text-white">
                    {getUserInitials(formData?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <BasicInfoSection
                  name={formData?.name || ""}
                  role={formData?.role || ""}
                  location={formData?.location || ""}
                  isEditing={editStates.basicInfo}
                  onEditToggle={() => toggleEdit("basicInfo")}
                  onChange={(field, value) => handleInputChange(field, value)}
                />
              </div>
            </div>

            {/* Description */}
            <EditableTextSection
              title="Description"
              value={formData?.summary || ""}
              onChange={(value) => handleInputChange("summary", value)}
              isEditing={editStates.description}
              onEditToggle={() => toggleEdit("description")}
              placeholder="Description not available"
              className="bg-white"
              headerClassName=""
              labelClassName="text-base font-semibold"
            />

            {/* Key Roles */}
            <EditableArraySection
              title="Key Roles"
              items={formData.highlights || []}
              isEditing={editStates.keyRoles}
              onEditToggle={() => toggleEdit("keyRoles")}
              onChange={(newArr) => handleInputChange("highlights", newArr)}
              placeholder="Key role"
              addLabel="Add Role"
              displayType="bullets"
            />

            {/* Focus Areas */}
            <EditableArraySection
              title="Focus Areas"
              items={formData.focus_areas || []}
              isEditing={editStates.focusAreas}
              onEditToggle={() => toggleEdit("focusAreas")}
              onChange={(newArr) => handleInputChange("focus_areas", newArr)}
              placeholder="Focus area"
              addLabel="Add Area"
            />

            {/* Industries */}
            <EditableArraySection
              title="Industries"
              items={formData.industries || []}
              isEditing={editStates.industries}
              onEditToggle={() => toggleEdit("industries")}
              onChange={(newArr) => handleInputChange("industries", newArr)}
              placeholder="Industry"
              addLabel="Add Industry"
            />

            {/* Geographical Coverage */}
            <EditableArraySection
              title="Geographical Coverage"
              items={formData.geographical_coverage || []}
              isEditing={editStates.geographicalCoverage}
              onEditToggle={() => toggleEdit("geographicalCoverage")}
              onChange={(newArr) =>
                handleInputChange("geographical_coverage", newArr)
              }
              placeholder="Region"
              addLabel="Add Region"
            />

            {/* Stage */}
            <EditableArraySection
              title="Stage"
              items={formData.stage_focus || []}
              isEditing={editStates.stages}
              onEditToggle={() => toggleEdit("stages")}
              onChange={(newArr) => handleInputChange("stage_focus", newArr)}
              placeholder="Stage"
              addLabel="Add Stage"
            />

            {/* Personal Interests */}
            <EditableArraySection
              title="Personal Interests"
              items={formData.personal_interests || []}
              isEditing={editStates.personalInterests}
              onEditToggle={() => toggleEdit("personalInterests")}
              onChange={(newArr) =>
                handleInputChange("personal_interests", newArr)
              }
              placeholder="Interest"
              addLabel="Add Interest"
            />

            {/* Certifications */}
            <EditableArraySection
              title="Certifications"
              items={formData.certifications || []}
              isEditing={editStates.certifications}
              onEditToggle={() => toggleEdit("certifications")}
              onChange={(newArr) => handleInputChange("certifications", newArr)}
              placeholder="Certification"
              addLabel="Add Certification"
            />

            {/* Engagement Options */}
            <EditableArraySection
              title="Engagement Options"
              items={formData.engagement_options || []}
              isEditing={editStates.engagementOptions}
              onEditToggle={() => toggleEdit("engagementOptions")}
              onChange={(newArr) =>
                handleInputChange("engagement_options", newArr)
              }
              placeholder="Engagement option"
              addLabel="Add Option"
            />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Section */}
            <EditableTextSection
              title={`Meet ${formData?.name?.split(" ")[0] || "Professional"}`}
              value={formData?.meet_them || ""}
              onChange={(value) => handleInputChange("meet_them", value)}
              isEditing={editStates.meetIntro}
              onEditToggle={() => toggleEdit("meetIntro")}
              placeholder="Introduction not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
            />

            {/* Personas Section */}
            <PersonasSection
              personas={formData.personas || []}
              personaEditStates={personaEditStates}
              isEditing={editStates.personas}
              onEditToggle={() => toggleEdit("personas")}
              onPersonaLocalUpdate={handlePersonaLocalUpdate}
              onAddPersona={handleAddPersona}
              onRemovePersona={handleRemovePersona}
              activeTab={personasActiveTab}
              onActiveTabChange={setPersonasActiveTab}
            />

            {/* Superpowers Section */}
            <SuperpowersSection
              superpowers={formData.superpowers || []}
              isEditing={editStates.superpowers}
              onEditToggle={() => toggleEdit("superpowers")}
              onSuperpowersChange={(newArr) =>
                handleInputChange("superpowers", newArr)
              }
            />

            {/* Sweet Spot Section */}
            <EditableTextSection
              title="Sweet Spot"
              value={formData?.sweetspot || ""}
              onChange={(value) => handleInputChange("sweetspot", value)}
              isEditing={editStates.sweetSpot}
              onEditToggle={() => toggleEdit("sweetSpot")}
              placeholder="Sweet spot not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
            />

            {/* Functional Skills */}
            <FunctionalSkillsSection
              functionalSkills={formData.functional_skills || {}}
              isEditing={editStates.functionalSkills}
              onEditToggle={() => toggleEdit("functionalSkills")}
              onFunctionalSkillsChange={(skills) =>
                handleInputChange("functional_skills", skills)
              }
            />

            {/* User Manual */}
            <EditableTextSection
              title={`${
                formData?.name?.split(" ")[0] || "Professional"
              }'s User Manual`}
              value={formData?.user_manual || ""}
              onChange={(value) => handleInputChange("user_manual", value)}
              isEditing={editStates.userManual}
              onEditToggle={() => toggleEdit("userManual")}
              placeholder="User manual not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/profile-creation")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>

          <Button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSubmitting ? "Processing..." : "Complete & Go to Dashboard"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProfileSnapshot
