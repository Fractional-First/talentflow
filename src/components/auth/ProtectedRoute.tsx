import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useGetOnboardingStatus } from "../../queries/getOnboardingStatus"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedStatuses?: string[]
}

export const ProtectedRoute = ({
  children,
  allowedStatuses,
}: ProtectedRouteProps) => {
  const { user, onboardingStatus, isLoading } = useGetOnboardingStatus()
  const [isProvisioning, setIsProvisioning] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Auto-provision a profiles row for users who signed up via the client portal.
  // Those users exist in auth.users but have no profiles row — detect this and
  // create one so they can proceed through candidate onboarding.
  useEffect(() => {
    if (!user || isLoading || onboardingStatus || isProvisioning) return

    setIsProvisioning(true)
    ;(async () => {
      try {
        const { data: slug } = await supabase.rpc("generate_unique_profile_slug", {
          p_user_id: user.id,
          p_first_name: user.user_metadata?.first_name ?? null,
          p_last_name: user.user_metadata?.last_name ?? null,
        })

        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email ?? null,
          onboarding_status: "EMAIL_CONFIRMED",
          profile_slug: slug ?? user.id.slice(0, 8),
        })

        await queryClient.invalidateQueries({ queryKey: ["profile", user.id] })
        navigate("/create-profile", { replace: true })
      } catch (err) {
        console.error("Failed to provision candidate profile:", err)
      } finally {
        setIsProvisioning(false)
      }
    })()
  }, [user?.id, isLoading, onboardingStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || isProvisioning) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user && searchParams.get("email") === null) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // User exists but no profiles row — show spinner while useEffect provisions it
  // This covers users who signed up via the client portal (no candidate profiles row yet)
  if (user && !onboardingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // If user doesn't have email confirmed, they should only see check-email page
  if (location.pathname !== "/check-email" && !user?.email_confirmed_at) {
    return <Navigate to="/check-email" replace />
  }

  // If allowedStatuses is provided, check if current status is allowed
  if (
    allowedStatuses &&
    onboardingStatus &&
    !allowedStatuses.includes(onboardingStatus)
  ) {
    // Redirect based on current onboarding status
    switch (onboardingStatus) {
      case "SIGNED_UP":
        return <Navigate to="/check-email" replace />
      case "EMAIL_CONFIRMED":
        return <Navigate to="/create-profile" replace />
      case "SET_PASSWORD":
        return <Navigate to="/change-password" replace />
      case "PROFILE_GENERATED":
        return <Navigate to="/edit-profile" replace />
      case "PROFILE_CONFIRMED":
      case "PREFERENCES_SET":
        return <Navigate to="/dashboard" replace />
      default:
        return <Navigate to="/create-profile" replace />
    }
  }

  return <>{children}</>
}
