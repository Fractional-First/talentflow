import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileData } from "@/types/profile"

export const usePublicProfile = (slug: string) => {
  return useQuery({
    queryKey: ["public-profile", slug],
    queryFn: async (): Promise<ProfileData | null> => {
      if (!slug) throw new Error("No profile slug provided")

      const { data, error } = await supabase
        .from("profiles")
        .select("profile_data, first_name, last_name")
        .eq("profile_slug", slug)
        .maybeSingle()

      if (error) {
        console.error("Error fetching public profile:", error)
        throw error
      }

      if (!data) {
        return null
      }

      return data.profile_data as ProfileData
    },
    enabled: !!slug,
  })
}