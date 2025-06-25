import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { ProfileData } from "@/types/profile"

export type ProfileSummary = {
  name: string
  title: string
  company: string
  location: string
  about: string
  skills: string[]
}

export function useProfileData() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["profile-data", user?.id],
    queryFn: async (): Promise<ProfileSummary> => {
      if (!user?.id) throw new Error("No user ID")

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("profile_data, profile_version")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error loading profile data:", error)
        throw error
      }

      if (!profileData?.profile_data) {
        return {
          name: "User",
          title: "Professional",
          company: "Company",
          location: "Location",
          about: "Professional summary not provided.",
          skills: [],
        }
      }

      const data = profileData.profile_data as ProfileData
      return {
        name: data.name || "User",
        title: data.role || "Professional",
        company: "Company",
        location: data.location || "Location",
        about: data.summary || "Professional summary not provided.",
        skills: data.focus_areas || [],
      }
    },
    enabled: !!user?.id,
  })
}
