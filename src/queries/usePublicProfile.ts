
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileData } from "@/types/profile"

type PublicProfileParams = 
  | { slug: string; id?: never }
  | { id: string; slug?: never }

export const usePublicProfile = (params: PublicProfileParams) => {
  return useQuery({
    queryKey: params.slug 
      ? ["public-profile", params.slug] 
      : ["public-profile-preview", params.id],
    queryFn: async (): Promise<ProfileData | null> => {
      if (params.slug) {
        const { data, error } = await supabase
          .rpc("get_public_profile", { profile_slug_param: params.slug })

        if (error) {
          console.error("Error fetching public profile by slug:", error)
          throw error
        }

        if (!data || data.length === 0) {
          return null
        }

        const profileData = data[0]
        return profileData.profile_data as ProfileData
      } else if (params.id) {
        const { data, error } = await supabase
          .rpc("get_public_profile_by_id", { profile_id_param: params.id })

        if (error) {
          console.error("Error fetching public profile by id:", error)
          throw error
        }

        if (!data || data.length === 0) {
          return null
        }

        const profileData = data[0]
        return profileData.profile_data as ProfileData
      } else {
        throw new Error("Either slug or id must be provided")
      }
    },
    enabled: !!(params.slug || params.id),
  })
}
