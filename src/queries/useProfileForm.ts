import { useCallback, useEffect, useState } from "react"
import type { ProfileData } from "@/types/profile"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"

export function useProfileForm({
  user,
  profileData,
  toast,
}: {
  user: { id: string } | null | undefined
  profileData: ProfileData | null | undefined
  toast: (opts: { title: string; description: string; variant: string }) => void
}): [ProfileData, React.Dispatch<React.SetStateAction<ProfileData>>] {
  const [formData, setFormData] = useState<ProfileData>({})

  // Initialize formData when profileData is loaded
  useEffect(() => {
    if (profileData && typeof profileData === "object") {
      setFormData(profileData)
    }
  }, [profileData])

  // Debounced auto-save effect with 1000ms delay
  const autoSave = useCallback(
    async (dataToSave: ProfileData) => {
      if (!user?.id || !dataToSave || Object.keys(dataToSave).length === 0)
        return
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ profile_data: dataToSave as Json })
          .eq("id", user.id)
        if (error) throw error
      } catch (error) {
        console.error("Error auto-saving profile:", error)
        toast({
          title: "Auto-save failed",
          description:
            "Your changes couldn't be saved automatically. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, toast]
  )

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0 || !profileData) return
    // Only save if data has changed from original
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(profileData)
    if (!hasChanges) return
    const timeoutId = setTimeout(() => {
      autoSave(formData)
    }, 1000) // 1 second debounce
    return () => clearTimeout(timeoutId)
  }, [formData, autoSave, profileData])

  return [formData, setFormData]
}
