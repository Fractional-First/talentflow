
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
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

export function useProfileSnapshot() {
  const { user } = useAuth()
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
        .select("profile_data, onboarding_status")
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

  // You can add more mutations for specific actions (e.g., updateProfilePicture)

  return {
    profileData: profileResult?.profile_data as ProfileData,
    onboardingStatus: profileResult?.onboarding_status,
    isLoading,
    error,
    saveProfile: saveProfileMutation.mutateAsync,
    saveProfileStatus: saveProfileMutation.status,
    // ...other mutations and helpers
  }
}
