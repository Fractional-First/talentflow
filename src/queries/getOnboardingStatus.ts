import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "./auth/useGetUser"

export function useGetOnboardingStatus() {
  const { data: user, isLoading: userLoading, error: userError } = useGetUser()

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_status")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          return null
        }

        return data
      } catch (error) {
        console.error("Error in profile query:", error)
        return null
      }
    },
    enabled: !!user?.id && !userLoading,
  })

  return {
    user,
    onboardingStatus: profileData?.onboarding_status,
    isLoading: userLoading || profileLoading,
    error: userError || profileError,
  }
}
