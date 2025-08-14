import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileData } from "@/types/profile"

export const usePublicProfile = (slug: string) => {
  return useQuery({
    queryKey: ["public-profile", slug],
    queryFn: async (): Promise<ProfileData | null> => {
      if (!slug) throw new Error("No profile slug provided")

      const { data, error } = await supabase
        .rpc("get_public_profile", { profile_slug_param: slug })

      if (error) {
        console.error("Error fetching public profile:", error)
        throw error
      }

      if (!data || data.length === 0) {
        return null
      }

      const profileData = data[0]
      return profileData.profile_data as ProfileData
    },
    enabled: !!slug,
  })
}