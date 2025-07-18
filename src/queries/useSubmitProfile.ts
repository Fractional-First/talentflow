import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { N8N_DOCUMENTS_WEBHOOK } from "@/components/create-profile/types"
import { ProfileData } from "@/components/create-profile/types"

interface SubmitProfileArgs {
  profile: ProfileData
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

      // Add linkedin and resume files if present
      if (profile.linkedin) {
        formDataToSubmit.append("linkedin", profile.linkedin)
      }
      if (profile.resume) {
        formDataToSubmit.append("resume", profile.resume)
      }

      // Add supporting documents in the format expected by the server
      // Server expects: docs[n][file] and docs[n][title]
      if (profile.docs && profile.docs.length > 0) {
        profile.docs.forEach((doc, index) => {
          formDataToSubmit.append(`docs[${index}][file]`, doc.file)
          formDataToSubmit.append(`docs[${index}][title]`, doc.title)
          // Also add the title as JSON metadata for the processing node
          formDataToSubmit.append(
            `docs[${index}][_meta]`,
            JSON.stringify({
              source: "docs",
              title: doc.title,
            })
          )
        })
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
