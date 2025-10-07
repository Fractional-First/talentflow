import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { profileStorage } from "@/utils/profileStorage"

const AuthCallback = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const processAuth = async () => {
      const hash = window.location.hash
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1))
        const access_token = params.get("access_token")
        const refresh_token = params.get("refresh_token")
        if (access_token && refresh_token) {
          try {
            const { data: profile } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            })

            // Check if user has profile data (generated profile)
            const { data: profileData } = await supabase
              .from("profiles")
              .select("onboarding_status, profile_data")
              .eq("id", profile.user.id)
              .single()

            // If profile_data exists and is not empty, set status to PROFILE_GENERATED
            if (
              profileData?.profile_data &&
              Object.keys(profileData.profile_data).length > 0
            ) {
              console.log(
                "User has generated profile data, setting status to PROFILE_GENERATED"
              )
              await supabase
                .from("profiles")
                .update({ onboarding_status: "PROFILE_GENERATED" })
                .eq("id", profile.user.id)

              queryClient.invalidateQueries({
                queryKey: ["user", profile.user.id],
              })

              toast.success("Welcome back! Your profile is ready.")
              navigate("/edit-profile")
              return
            } else {
              // No profile data, set to EMAIL_CONFIRMED as normal
              await supabase
                .from("profiles")
                .update({ onboarding_status: "EMAIL_CONFIRMED" })
                .eq("id", profile.user.id)

              queryClient.invalidateQueries({
                queryKey: ["user", profile.user.id],
              })
            }

            // Check if this is a LinkedIn signup with generated profile data
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
                      uuid: profile.user.id, // User's UUID
                      profile: generatedProfile, // Entire generated profile data
                    }),
                  }
                )

                if (response.ok) {
                  // Update onboarding status to PROFILE_GENERATED
                  await supabase
                    .from("profiles")
                    .update({ onboarding_status: "PROFILE_GENERATED" })
                    .eq("id", profile.user.id)

                  // Clear localStorage after successful submission
                  profileStorage.remove()
                  toast.success(
                    "Profile created successfully from your generated data!"
                  )
                  navigate("/edit-profile")
                  return
                } else {
                  const errorText = await response.text()
                  console.error(
                    "Profile submission failed:",
                    response.status,
                    errorText
                  )
                  toast.error(
                    "Failed to save generated profile. Please try again."
                  )
                }
              } catch (error) {
                console.error("Error submitting generated profile:", error)
                toast.error(
                  "Profile generated but couldn't be saved. Please try creating your profile again."
                )
              }
            }

            navigate("/create-profile")
          } catch (error) {
            console.log("error", error)
            toast.error("Authentication failed. Please try logging in.")
            navigate("/login")
          }
        } else {
          navigate("/login")
        }
      } else {
        navigate("/login")
      }
    }
    processAuth()
  }, [navigate, queryClient])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default AuthCallback
