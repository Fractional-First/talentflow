import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function useCompleteOnboarding() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user ID")
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_status: "PROFILE_CONFIRMED" })
        .eq("id", user.id)
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
