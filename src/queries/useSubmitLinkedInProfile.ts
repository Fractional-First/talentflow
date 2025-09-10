import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { N8N_LINKEDIN_WEBHOOK } from "@/components/create-profile/types"

interface SubmitLinkedInProfileArgs {
  linkedinUrl: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useSubmitLinkedInProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ linkedinUrl }: SubmitLinkedInProfileArgs) => {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      const response = await fetch(N8N_LINKEDIN_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          linkedinUrl: linkedinUrl,
        }),
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
            "Server reported an error processing your LinkedIn profile"
        )
      }

      // Invalidate React Query cache for profile data to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] })
      return responseData
    },
  })

  return mutation
}
