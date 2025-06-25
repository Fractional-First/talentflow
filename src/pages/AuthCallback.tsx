import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

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

            await supabase
              .from("profiles")
              .update({ onboarding_status: "EMAIL_CONFIRMED" })
              .eq("id", profile.user.id)
            queryClient.invalidateQueries({
              queryKey: ["user", profile.user.id],
            })

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
