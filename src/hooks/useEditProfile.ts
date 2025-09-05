import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { useGetUser } from "@/queries/auth/useGetUser"
import { useCompleteOnboarding } from "@/queries/useCompleteOnboarding"
import { usePersonaEditState } from "@/queries/usePersonaEditState"
import { useProfileForm } from "@/queries/useProfileForm"
import { useEditProfile as useEditProfileQuery } from "@/queries/useEditProfile"
import { useAutoSaveWithStatus } from "@/hooks/useAutoSaveWithStatus"
import { useSuperpowerEditState } from "@/hooks/useSuperpowerEditState"
import { useClickOutside } from "@/hooks/useClickOutside"
import type { EditStates, ProfileData } from "@/types/profile"

export const useEditProfile = () => {
  const navigate = useNavigate()
  const { data: user } = useGetUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch profile data using the query hook
  const {
    profileData,
    isLoading,
    error,
    onboardingStatus,
    profileSlug,
    isPublished,
    linkedinUrl,
    updatePublishStatus,
    isUpdatingPublishStatus,
  } = useEditProfileQuery()

  // Initialize formData state
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
  } = usePersonaEditState({
    personas: formData.personas || [],
    setFormData,
  })

  const { syncSuperpowerEditStates } = useSuperpowerEditState({
    superpowers: formData.superpowers || [],
    setFormData,
  })

  // Auto-save functionality
  const { saveStatus, retrySave } = useAutoSaveWithStatus({
    user,
    formData,
    profileData,
    toast: (opts) => toast(opts),
  })

  // Edit states management
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
    meetIntro: false,
    personas: false,
    superpowers: false,
    sweetSpot: false,
    userManual: false,
    functionalSkills: false,
  })

  // Toggle edit function
  const toggleEdit = (section: keyof EditStates) => {
    setEditStates((prev) => {
      // If already editing this section, turn it off
      if (prev[section]) {
        return {
          ...prev,
          [section]: false,
        }
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

  // Click outside handler
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

  // Complete onboarding mutation
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle profile picture update
  const handleProfilePictureUpdate = (imageUrl: string) => {
    handleInputChange("profilePicture", imageUrl)
  }

  // Generate public profile URL
  const publicProfileUrl = profileSlug
    ? `${window.location.origin}/profile/${profileSlug}`
    : ""

  // Handle publish toggle
  const handlePublishToggle = async () => {
    try {
      const newPublishStatus = !isPublished
      await updatePublishStatus(newPublishStatus)

      toast({
        title: newPublishStatus
          ? "Your profile is now live."
          : "Your profile is now private.",
        description: newPublishStatus
          ? "View your public profile at: " + publicProfileUrl
          : "Your profile is no longer publicly accessible.",
      })
    } catch (error) {
      toast({
        title: "Failed to update profile status",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return {
    // Data
    user,
    profileData,
    formData,
    isLoading,
    error,
    isSubmitting,

    // State
    editStates,
    personasActiveTab,
    personaEditStates,
    saveStatus,
    mainContentRef,
    onboardingStatus,

    // Publishing
    profileSlug,
    isPublished,
    linkedinUrl,
    publicProfileUrl,
    updatePublishStatus,
    isUpdatingPublishStatus,
    handlePublishToggle,

    // Handlers
    setFormData,
    setPersonasActiveTab,
    toggleEdit,
    handleContinue,
    handleInputChange,
    handleProfilePictureUpdate,
    retrySave,

    // Persona handlers
    handlePersonaLocalUpdate,
    handleAddPersona,
    handleRemovePersona,
    syncPersonaEditStates,

    // Navigation
    navigate,
  }
}
