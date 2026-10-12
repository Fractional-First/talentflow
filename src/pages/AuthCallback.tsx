import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { profileStorage } from "@/utils/profileStorage"
import {
  AUTH_ERROR_CODE,
  OAUTH_ERROR,
  type AuthRedirectParam,
} from "@/integrations/supabase/authRedirect"
import {
  raiseOnboardingStatus,
  routeForOnboardingStatus,
} from "@/utils/onboardingStatus"

// Landing for email-verification links, Google sign-in and LinkedIn sign-up,
// new and returning users alike.
const AuthCallback = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const processAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const queryParams = new URLSearchParams(window.location.search)

      const hashParam = (name: AuthRedirectParam) => hashParams.get(name)
      const errorParam = (name: AuthRedirectParam) =>
        hashParams.get(name) ?? queryParams.get(name)

      // An expired or already-used email link also arrives as error=access_denied;
      // only error_code tells it apart from a cancel.
      const authError = errorParam("error")
      if (authError) {
        const errorCode = errorParam("error_code")
        console.error(
          "Sign-in failed:",
          authError,
          errorCode,
          errorParam("error_description")
        )
        toast.error(
          errorCode === AUTH_ERROR_CODE.otpExpired
            ? "This link has expired or was already used. Please log in."
            : authError === OAUTH_ERROR.accessDenied
              ? "Sign-in was cancelled."
              : "Sign-in failed. Please try again."
        )
        navigate("/login", { replace: true })
        return
      }

      const access_token = hashParam("access_token")
      const refresh_token = hashParam("refresh_token")
      if (!access_token || !refresh_token) {
        navigate("/login")
        return
      }

      try {
        const { data: profile } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
        const userId = profile.user.id

        // Not awaited: the send-welcome-email function decides whether this
        // person gets it (newly verified, once), and a failure must never hold
        // up onboarding. invoke() resolves with { error } rather than rejecting.
        supabase.functions.invoke("send-welcome-email").then(({ error }) => {
          if (error) console.error("Welcome email failed:", error)
        })

        const { data: profileData } = await supabase
          .from("profiles")
          .select("onboarding_status, profile_data")
          .eq("id", userId)
          .single()

        const hasProfileData =
          !!profileData?.profile_data &&
          Object.keys(profileData.profile_data).length > 0

        // Landing here proves the email, and saved profile data means a profile
        // was generated. Neither may move a returning user backwards.
        let status = raiseOnboardingStatus(
          profileData?.onboarding_status,
          hasProfileData ? "PROFILE_GENERATED" : "EMAIL_CONFIRMED"
        )

        // A profile generated before sign-up waits in sessionStorage, so it is
        // only found when the callback opens in the tab that generated it.
        const generatedProfile = hasProfileData ? null : profileStorage.get()
        if (generatedProfile) {
          try {
            const response = await fetch(
              "https://webhook-processor-production-1757.up.railway.app/webhook/submit-profile",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  uuid: userId,
                  profile: generatedProfile,
                }),
              }
            )

            if (response.ok) {
              status = raiseOnboardingStatus(status, "PROFILE_GENERATED")
              profileStorage.remove()
              toast.success(
                "Profile created successfully from your generated data!"
              )
            } else {
              const errorText = await response.text()
              console.error(
                "Profile submission failed:",
                response.status,
                errorText
              )
              toast.error("Failed to save generated profile. Please try again.")
            }
          } catch (error) {
            console.error("Error submitting generated profile:", error)
            toast.error(
              "Profile generated but couldn't be saved. Please try creating your profile again."
            )
          }
        } else if (hasProfileData && status === "PROFILE_GENERATED") {
          toast.success("Welcome back! Your profile is ready.")
        }

        if (status !== profileData?.onboarding_status) {
          await supabase
            .from("profiles")
            .update({ onboarding_status: status })
            .eq("id", userId)
        }

        queryClient.invalidateQueries({ queryKey: ["profile", userId] })
        navigate(routeForOnboardingStatus(status), { replace: true })
      } catch (error) {
        console.log("error", error)
        toast.error("Authentication failed. Please try logging in.")
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
