import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileData } from "@/types/profile"

export const usePublicProfile = (slug: string) => {
  return useQuery({
    queryKey: ["public-profile", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No profile slug provided")

      const { data, error } = await supabase
        .from("profiles")
        .select("profile_data")
        .eq("profile_slug", slug)
        .single()

      if (error) {
        console.error("Error loading public profile:", error)
        throw error
      }

      return data?.profile_data as ProfileData | null
    },
    enabled: !!slug,
  })
}