import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "@/queries/auth/useGetUser"
import { useNavigate } from "react-router-dom"

export const useCompleteOnboarding = () => {
  const { data: user } = useGetUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user ID")

      // First, check the current onboarding status
      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("onboarding_status")
        .eq("id", user.id)
        .single()

      if (fetchError) throw fetchError

      // Only update if the status is currently "PROFILE_GENERATED"
      if (currentProfile.onboarding_status !== "PROFILE_GENERATED") {
        return true // Already completed or in different state
      }

      // Update to "PROFILE_CONFIRMED" only if currently "PROFILE_GENERATED"
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_status: "PROFILE_CONFIRMED" })
        .eq("id", user.id)
        .eq("onboarding_status", "PROFILE_GENERATED")

      if (error) throw error
      return true
    },
    onSuccess: async () => {
      // Invalidate the profile query so ProtectedRoute and others refetch
      await queryClient.invalidateQueries({
        queryKey: ["profile", user?.id],
      })
      // Navigate after invalidation
      navigate("/dashboard")
    },
  })
}
