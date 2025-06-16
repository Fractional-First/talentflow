import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export function useCompleteOnboarding() {
  const { user } = useAuth()

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
  })
}
