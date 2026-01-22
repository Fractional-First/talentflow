import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { N8N_LINKEDIN_WEBHOOK } from "@/components/create-profile/types"
import { ProfileData } from "@/components/create-profile/types"

interface SubmitLinkedInProfileArgs {
  linkedinUrl: string
  profile: ProfileData
  webhookUrl?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useSubmitLinkedInProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      linkedinUrl,
      profile,
      webhookUrl,
    }: SubmitLinkedInProfileArgs) => {
      const formDataToSubmit = new FormData()

      // Get the current user - required for profile creation
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error(
          "Your session has expired. Please log in again to create your profile."
        )
      }

      formDataToSubmit.append("userId", user.id)
      formDataToSubmit.append("linkedinUrl", linkedinUrl)

      // Add resume file if present
      if (profile.resume) {
        formDataToSubmit.append("resume", profile.resume)
      }

      // Add supporting documents in the format expected by the server
      // Server expects: docs[n][file] and docs[n][title]
      if (profile.docs && profile.docs.length > 0) {
        profile.docs.forEach((doc, index) => {
          formDataToSubmit.append(`docs[${index}][file]`, doc.file)
          formDataToSubmit.append(`docs[${index}][title]`, doc.title)
          formDataToSubmit.append(
            `docs[${index}][description]`,
            doc.description
          )
        })
      }

      // Add supporting links
      if (profile.links && profile.links.length > 0) {
        formDataToSubmit.append("links", JSON.stringify(profile.links))
      }

      const response = await fetch(webhookUrl || N8N_LINKEDIN_WEBHOOK, {
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
            "Server reported an error processing your LinkedIn profile"
        )
      }

      // Invalidate React Query cache for profile data to ensure fresh data (only for authenticated users)
      if (user) {
        await queryClient.invalidateQueries({ queryKey: ["profile", user.id] })
      }
      return responseData
    },
  })

  return mutation
}
