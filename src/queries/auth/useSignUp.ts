import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { profileStorage } from "@/utils/profileStorage"

export function useSignUp() {
  const [loading, setLoading] = useState(false)

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { first_name: firstName, last_name: lastName },
        },
      })

      if (error) throw error

      // If user was created and we have generated profile data, submit via N8N
      if (data.user) {
        const generatedProfile = profileStorage.get()

        if (generatedProfile) {
          try {
            // Submit the generated profile data using the N8N workflow
            const response = await fetch(
              "https://webhook-processor-production-1757.up.railway.app/webhook/submit-profile",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  uuid: data.user.id, // User's UUID
                  profile: generatedProfile, // Entire generated profile data
                }),
              }
            )

            if (response.ok) {
              // Clear the temp data since it's now in the database
              profileStorage.remove()
            } else {
              console.error(
                "Failed to submit profile via N8N:",
                response.status
              )
              // Don't throw - user is still created, they can create profile manually
            }
          } catch (error) {
            console.error("Error submitting profile via N8N:", error)
            // Don't throw - user is still created, they can create profile manually
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return { signUp, loading }
}
