import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { N8N_DOCUMENTS_WEBHOOK } from "@/components/create-profile/types"

interface SubmitProfileArgs {
  profile: {
    linkedin?: File
    resume?: File
    // Add other fields if needed
  }
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useSubmitProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ profile }: SubmitProfileArgs) => {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      const formDataToSubmit = new FormData()
      formDataToSubmit.append("userId", user.id)
      if (profile.linkedin) {
        formDataToSubmit.append("linkedin", profile.linkedin)
      }
      if (profile.resume) {
        formDataToSubmit.append("resume", profile.resume)
      }

      const response = await fetch(N8N_DOCUMENTS_WEBHOOK, {
        method: "POST",
        body: formDataToSubmit,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Server error: ${response.status} ${response.statusText}. ${errorText}`
        )
      }

      const responseData = await response.json()
      if (responseData.error || responseData.status === "error") {
        throw new Error(
          responseData.message ||
            "Server reported an error processing your profile"
        )
      }

      // Invalidate React Query cache for profile data to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] })
      return responseData
    },
  })

  return mutation
}
