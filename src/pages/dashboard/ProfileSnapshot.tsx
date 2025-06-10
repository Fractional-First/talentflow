import { DashboardLayout } from "@/components/DashboardLayout"
import { Step } from "@/components/OnboardingProgress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"
import { useProfileSnapshot } from "@/queries/useProfileSnapshot"
import { ArrowLeft, ArrowRight, Edit, Minus, Plus, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { EditableTextSection } from "@/components/EditProfile/EditableTextSection"
import { EditableArraySection } from "@/components/EditProfile/EditableArraySection"
import { PersonasSection } from "@/components/EditProfile/PersonasSection"

interface ProfileData {
  name?: string
  role?: string
  summary?: string
  location?: string
  personas?: Array<{
    title: string
    bullets: string[]
  }>
  meet_them?: string
  sweetspot?: string
  highlights?: string[]
  industries?: string[]
  focus_areas?: string[]
  stage_focus?: string[]
  superpowers?: Array<{
    title: string
    description: string
  }>
  user_manual?: string
  certifications?: string[]
  non_obvious_role?: {
    title: string
    description: string
  }
  functional_skills?: {
    [key: string]: Array<{
      title: string
      description: string
    }>
  }
  personal_interests?: string[]
  geographical_coverage?: string[]
  profilePicture?: string
  engagement_options?: string[]
}

interface EditStates {
  basicInfo: boolean
  description: boolean
  keyRoles: boolean
  focusAreas: boolean
  industries: boolean
  geographicalCoverage: boolean
  stages: boolean
  personalInterests: boolean
  certifications: boolean
  engagementOptions: boolean
  meetIntro: boolean
  personas: boolean
  superpowers: boolean
  sweetSpot: boolean
  userManual: boolean
  functionalSkills: boolean
}

const ProfileSnapshot = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedFunctionalSkill, setExpandedFunctionalSkill] = useState<
    string | null
  >(null)

  // Initialize formData state first
  const [formData, setFormData] = useState<ProfileData>({})

  // Local editing state for personas
  const [personaEditStates, setPersonaEditStates] = useState<{
    [key: number]: {
      title: string
      bulletsText: string
    }
  }>({})

  // Local editing state for superpowers
  const [superpowerEditStates, setSuperpowerEditStates] = useState<{
    [key: number]: {
      title: string
      description: string
    }
  }>({})

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

  // Fetch profile data using the new hook
  const { profileData, isLoading, error } = useProfileSnapshot()

  // Auto-save function
  const autoSave = useCallback(
    async (dataToSave: ProfileData) => {
      if (!user?.id || !dataToSave || Object.keys(dataToSave).length === 0)
        return

      try {
        const { error } = await supabase
          .from("profiles")
          .update({ profile_data: dataToSave as Json })
          .eq("id", user.id)

        if (error) throw error
      } catch (error) {
        console.error("Error auto-saving profile:", error)
        toast({
          title: "Auto-save failed",
          description:
            "Your changes couldn't be saved automatically. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id]
  )

  // Debounced auto-save effect with 1000ms delay
  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0 || !profileData) return

    // Only save if data has changed from original
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(profileData)
    if (!hasChanges) return

    const timeoutId = setTimeout(() => {
      autoSave(formData)
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [formData, autoSave, profileData])

  // Debounced update function for personas
  useEffect(() => {
    const timeouts: { [key: number]: NodeJS.Timeout } = {}

    Object.entries(personaEditStates).forEach(([personaIndex, editState]) => {
      const index = parseInt(personaIndex)

      if (timeouts[index]) {
        clearTimeout(timeouts[index])
      }

      timeouts[index] = setTimeout(() => {
        // Update the main formData with the debounced changes
        const bullets = editState.bulletsText
          .split("\n")
          .map((line) => line.replace(/^•\s*/, "").trim())
          .filter((line) => line.length > 0)

        setFormData((prev) => {
          const updatedPersonas = [...(prev.personas || [])]
          updatedPersonas[index] = {
            ...updatedPersonas[index],
            title: editState.title,
            bullets: bullets,
          }
          return { ...prev, personas: updatedPersonas }
        })
      }, 300) // 300ms debounce delay
    })

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [personaEditStates])

  // Debounced update function for superpowers
  useEffect(() => {
    const timeouts: { [key: number]: NodeJS.Timeout } = {}

    Object.entries(superpowerEditStates).forEach(
      ([superpowerIndex, editState]) => {
        const index = parseInt(superpowerIndex)

        if (timeouts[index]) {
          clearTimeout(timeouts[index])
        }

        timeouts[index] = setTimeout(() => {
          // Update the main formData with the debounced changes
          setFormData((prev) => {
            const updatedSuperpowers = [...(prev.superpowers || [])]
            updatedSuperpowers[index] = {
              title: editState.title,
              description: editState.description,
            }
            return { ...prev, superpowers: updatedSuperpowers }
          })
        }, 300) // 300ms debounce delay
      }
    )

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [superpowerEditStates])

  // Update formData when profileData is loaded
  useEffect(() => {
    if (profileData && typeof profileData === "object") {
      setFormData(profileData)

      // Initialize persona edit states when data is loaded
      if (profileData.personas) {
        const initialEditStates: {
          [key: number]: { title: string; bulletsText: string }
        } = {}
        profileData.personas.forEach((persona, index) => {
          initialEditStates[index] = {
            title: persona.title,
            bulletsText:
              persona.bullets?.map((bullet) => `• ${bullet}`).join("\n") || "",
          }
        })
        setPersonaEditStates(initialEditStates)
      }

      // Initialize superpower edit states when data is loaded
      if (profileData.superpowers) {
        const initialSuperpowerEditStates: {
          [key: number]: { title: string; description: string }
        } = {}
        profileData.superpowers.forEach((superpower, index) => {
          initialSuperpowerEditStates[index] = {
            title: superpower.title,
            description: superpower.description,
          }
        })
        setSuperpowerEditStates(initialSuperpowerEditStates)
      }
    }
  }, [profileData])

  // Helper function to get user initials
  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const steps: Step[] = [
    {
      id: 1,
      name: "Sign Up",
      description: "Create your account",
      status: "completed",
    },
    {
      id: 2,
      name: "Create Profile",
      description: "Enter your information",
      status: "completed",
    },
    {
      id: 3,
      name: "Review Profile",
      description: "Review your profile",
      status: "current",
    },
  ]

  const toggleEdit = (section: keyof EditStates) => {
    setEditStates((prev) => {
      const newState = { ...prev, [section]: !prev[section] }

      // When entering edit mode for personas, sync local state with current data
      if (section === "personas" && newState.personas && formData.personas) {
        const syncedEditStates: {
          [key: number]: { title: string; bulletsText: string }
        } = {}
        formData.personas.forEach((persona, index) => {
          syncedEditStates[index] = {
            title: persona.title,
            bulletsText:
              persona.bullets?.map((bullet) => `• ${bullet}`).join("\n") || "",
          }
        })
        setPersonaEditStates(syncedEditStates)
      }

      // When entering edit mode for superpowers, sync local state with current data
      if (
        section === "superpowers" &&
        newState.superpowers &&
        formData.superpowers
      ) {
        const syncedSuperpowerEditStates: {
          [key: number]: { title: string; description: string }
        } = {}
        formData.superpowers.forEach((superpower, index) => {
          syncedSuperpowerEditStates[index] = {
            title: superpower.title,
            description: superpower.description,
          }
        })
        setSuperpowerEditStates(syncedSuperpowerEditStates)
      }

      return newState
    })
  }

  // Handle persona local state updates
  const handlePersonaLocalUpdate = (
    personaIndex: number,
    field: "title" | "bulletsText",
    value: string
  ) => {
    setPersonaEditStates((prev) => ({
      ...prev,
      [personaIndex]: {
        ...prev[personaIndex],
        [field]: value,
      },
    }))
  }

  // Handle superpower local state updates
  const handleSuperpowerLocalUpdate = (
    superpowerIndex: number,
    field: "title" | "description",
    value: string
  ) => {
    setSuperpowerEditStates((prev) => ({
      ...prev,
      [superpowerIndex]: {
        ...prev[superpowerIndex],
        [field]: value,
      },
    }))
  }

  // Handle persona updates
  const handlePersonaUpdate = (
    personaIndex: number,
    field: "title" | "bullets",
    value: string | string[]
  ) => {
    const updatedPersonas = [...(formData.personas || [])]
    if (field === "title") {
      updatedPersonas[personaIndex] = {
        ...updatedPersonas[personaIndex],
        title: value as string,
      }
    } else {
      updatedPersonas[personaIndex] = {
        ...updatedPersonas[personaIndex],
        bullets: value as string[],
      }
    }
    setFormData((prev) => ({ ...prev, personas: updatedPersonas }))
  }

  const handlePersonaBulletsTextChange = (
    personaIndex: number,
    textValue: string
  ) => {
    // Convert text back to bullets array (split by lines and filter empty)
    const bullets = textValue
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter((line) => line.length > 0)
    handlePersonaUpdate(personaIndex, "bullets", bullets)
  }

  const handleProfilePictureUpdate = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, profilePicture: imageUrl }))
  }

  const handleArrayChange = (
    field: keyof ProfileData,
    index: number,
    value: string
  ) => {
    const currentArray = formData[field] as string[]
    if (!currentArray) return
    const newArray = [...currentArray]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: keyof ProfileData) => {
    const currentArray = (formData[field] as string[]) || []
    setFormData((prev) => ({ ...prev, [field]: [...currentArray, ""] }))
  }

  const removeArrayItem = (field: keyof ProfileData, index: number) => {
    const currentArray = formData[field] as string[]
    if (!currentArray) return
    const newArray = currentArray.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  // Add superpower item
  const addSuperpowerItem = () => {
    const currentSuperpowers = formData.superpowers || []
    const newSuperpower = { title: "", description: "" }
    setFormData((prev) => ({
      ...prev,
      superpowers: [...currentSuperpowers, newSuperpower],
    }))

    // Initialize the edit state for the new superpower
    const newIndex = currentSuperpowers.length
    setSuperpowerEditStates((prev) => ({
      ...prev,
      [newIndex]: { title: "", description: "" },
    }))
  }

  // Remove superpower item
  const removeSuperpowerItem = (index: number) => {
    const currentSuperpowers = formData.superpowers || []
    const newSuperpowers = currentSuperpowers.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, superpowers: newSuperpowers }))

    // Remove from edit state and reindex
    const newEditStates: {
      [key: number]: { title: string; description: string }
    } = {}
    newSuperpowers.forEach((superpower, newIndex) => {
      if (superpowerEditStates[newIndex < index ? newIndex : newIndex + 1]) {
        newEditStates[newIndex] =
          superpowerEditStates[newIndex < index ? newIndex : newIndex + 1]
      } else {
        newEditStates[newIndex] = {
          title: superpower.title,
          description: superpower.description,
        }
      }
    })
    setSuperpowerEditStates(newEditStates)
  }

  const handleContinue = async () => {
    setIsSubmitting(true)

    try {
      // Update onboarding status to completed
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_status: "PROFILE_CONFIRMED" })
        .eq("id", user?.id)

      if (error) throw error

      // Navigate immediately after successful update
      navigate("/dashboard")
    } catch (error) {
      console.error("Error updating onboarding status:", error)
      toast({
        title: "Error",
        description: "Failed to complete onboarding.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFunctionalSkill = (skill: string) => {
    setExpandedFunctionalSkill(expandedFunctionalSkill === skill ? null : skill)
  }

  // Handle input changes for form fields
  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <DashboardLayout steps={steps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center">Loading profile...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    console.error("Profile query error:", error)
    return (
      <DashboardLayout steps={steps} currentStep={3}>
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
      <DashboardLayout steps={steps} currentStep={3}>
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
    <DashboardLayout steps={steps} currentStep={3}>
      <div className="max-w-6xl mx-auto space-y-6 p-6">
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editStates.basicInfo ? (
                      <Input
                        value={formData?.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-2xl font-bold text-center"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">
                        {formData?.name || "Name not available"}
                      </h1>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit("basicInfo")}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                {editStates.basicInfo ? (
                  <>
                    <Input
                      value={formData?.role || ""}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="text-lg text-center"
                    />
                    <Input
                      value={formData?.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="text-sm text-center"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-lg text-gray-700">
                      {formData?.role || "Role not available"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData?.location || "Location not available"}
                    </p>
                  </>
                )}
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
              isEditing={editStates.personas}
              onEditToggle={() => toggleEdit("personas")}
              onPersonasChange={(newArr) =>
                handleInputChange("personas", newArr)
              }
            />

            {/* Superpowers Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Superpowers</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit("superpowers")}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {formData?.superpowers && formData.superpowers.length > 0 ? (
                    formData.superpowers.map((superpower, index) => (
                      <div key={index} className="space-y-2">
                        {editStates.superpowers ? (
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <Input
                                value={
                                  superpowerEditStates[index]?.title ||
                                  superpower.title
                                }
                                onChange={(e) =>
                                  handleSuperpowerLocalUpdate(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="font-medium"
                                placeholder="Superpower title"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSuperpowerItem(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              value={
                                superpowerEditStates[index]?.description ||
                                superpower.description
                              }
                              onChange={(e) =>
                                handleSuperpowerLocalUpdate(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="text-sm"
                              placeholder="Superpower description"
                              rows={3}
                            />
                          </div>
                        ) : (
                          <div>
                            <Label className="font-medium text-gray-900">
                              {superpower.title}
                            </Label>
                            <p className="text-sm text-gray-700">
                              {superpower.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-700">
                      Superpowers not available
                    </div>
                  )}

                  {editStates.superpowers && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSuperpowerItem}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Superpower
                    </Button>
                  )}
                </div>
              </div>
            </div>

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
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Functional Skills</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit("functionalSkills")}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {formData?.functional_skills &&
                Object.keys(formData.functional_skills).length > 0 ? (
                  Object.entries(formData.functional_skills).map(
                    ([categoryName, skills]) => (
                      <div
                        key={categoryName}
                        className="border-b border-gray-200 pb-3"
                      >
                        <button
                          className="flex justify-between items-center w-full text-left"
                          onClick={() => toggleFunctionalSkill(categoryName)}
                        >
                          <span className="font-medium text-gray-900">
                            {categoryName}
                          </span>
                          {expandedFunctionalSkill === categoryName ? (
                            <Minus className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-400" />
                          )}
                        </button>

                        {expandedFunctionalSkill === categoryName && (
                          <div className="mt-3 space-y-3">
                            <div className="space-y-2">
                              {skills?.map((skill, index) => (
                                <div key={index}>
                                  <h5 className="font-medium text-sm">
                                    {skill.title}
                                  </h5>
                                  <p className="text-sm text-gray-700">
                                    {skill.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )
                ) : (
                  <div className="text-sm text-gray-700">
                    Functional skills not available
                  </div>
                )}
              </div>
            </div>

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
