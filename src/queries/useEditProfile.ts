import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "@/queries/auth/useGetUser"
// TODO: Replace with global type if available
// import type { ProfileData } from '@/types/profile';

// Minimal ProfileData type for now
export interface ProfileData {
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
  education?: string[]
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
}

export const useEditProfile = () => {
  const { data: user } = useGetUser()
  const queryClient = useQueryClient()

  // Fetch profile data
  const {
    data: profileResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile-snapshot", user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "profile_data, onboarding_status, profile_slug, profile_version, ispublished, linkedinurl"
        )
        .eq("id", user.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  // Mutation for saving/updating profile data
  const saveProfileMutation = useMutation({
    mutationFn: async (newProfileData: ProfileData) => {
      if (!user?.id) throw new Error("No user ID")
      const { error } = await supabase
        .from("profiles")
        .update({ profile_data: newProfileData as any })
        .eq("id", user.id)
      if (error) throw error
      return newProfileData
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["profile-snapshot", user?.id],
      })
    },
  })

  // Mutation for updating publish status
  const updatePublishStatusMutation = useMutation({
    mutationFn: async (isPublished: boolean) => {
      if (!user?.id) throw new Error("No user ID")
      const { error } = await supabase
        .from("profiles")
        .update({ ispublished: isPublished })
        .eq("id", user.id)
      if (error) throw error
      return isPublished
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["profile-snapshot", user?.id],
      })
    },
  })

  // Mutation for updating LinkedIn URL
  const updateLinkedInUrlMutation = useMutation({
    mutationFn: async (linkedinUrl: string) => {
      if (!user?.id) throw new Error("No user ID")
      const { error } = await supabase
        .from("profiles")
        .update({ linkedinurl: linkedinUrl })
        .eq("id", user.id)
      if (error) throw error
      return linkedinUrl
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["profile-snapshot", user?.id],
      })
    },
  })

  return {
    profileData: profileResult?.profile_data as ProfileData,
    profileVersion: profileResult?.profile_version,
    onboardingStatus: profileResult?.onboarding_status,
    profileSlug: profileResult?.profile_slug,
    isPublished: profileResult?.ispublished,
    linkedinUrl: profileResult?.linkedinurl,
    isLoading,
    error,
    saveProfile: saveProfileMutation.mutateAsync,
    saveProfileStatus: saveProfileMutation.status,
    updatePublishStatus: updatePublishStatusMutation.mutateAsync,
    isUpdatingPublishStatus: updatePublishStatusMutation.isPending,
    updateLinkedInUrl: updateLinkedInUrlMutation.mutateAsync,
    isUpdatingLinkedInUrl: updateLinkedInUrlMutation.isPending,
  }
}
