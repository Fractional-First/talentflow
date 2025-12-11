import { Navigate, useLocation, useSearchParams } from "react-router-dom"
import { useGetOnboardingStatus } from "../../queries/getOnboardingStatus"
import { Spinner } from "@/components/ui/spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedStatuses?: string[]
}

const getIdentityVerified = () => {
  try {
    const stored = localStorage.getItem('agreement_status');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.identity?.verified === true;
    }
  } catch {
    return false;
  }
  return false;
};

export const ProtectedRoute = ({
  children,
  allowedStatuses,
}: ProtectedRouteProps) => {
  const { user, onboardingStatus, isLoading } = useGetOnboardingStatus()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  if (isLoading) {
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
        if (!getIdentityVerified()) {
          return <Navigate to="/identity-verification" replace />
        }
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

  // If no onboarding status (user logged out or not authenticated), redirect to login
  if (allowedStatuses && !onboardingStatus) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
