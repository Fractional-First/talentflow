import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import CheckEmail from "./pages/CheckEmail"
import ForgotPassword from "./pages/ForgotPassword"
import Index from "./pages/Index"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import ResetPassword from "./pages/ResetPassword"
import SignUp from "./pages/SignUp"
import Branding from "./pages/dashboard/Branding"
import Dashboard from "./pages/dashboard/Dashboard"
import ProfileCreation from "./pages/CreateProfile"
import ProfileSnapshot from "./pages/EditProfile"
import WaitingRoom from "./pages/dashboard/WaitingRoom"
import WorkPreferences from "./pages/WorkPreferences"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

const queryClient = new QueryClient()

function AuthHashHandler() {
  const navigate = useNavigate()
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")
      if (access_token && refresh_token) {
        supabase.auth
          .setSession({
            access_token,
            refresh_token,
          })
          .then(({ error }) => {
            if (error) {
              toast.error(
                "Failed to log in automatically. Please log in manually."
              )
              window.location.hash = ""
              navigate("/login")
            } else {
              toast.success("Email confirmed! You are now logged in.")
              window.location.hash = ""
              navigate("/create-profile")
            }
          })
      }
    }
  }, [navigate])
  return null
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthHashHandler />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Check email - for users with SIGNED_UP status */}
            <Route path="/check-email" element={<CheckEmail />} />

            {/* Profile creation - for users with EMAIL_CONFIRMED, PROFILE_GENERATED, or PROFILE_CONFIRMED status */}
            <Route
              path="/create-profile"
              element={
                <ProtectedRoute
                  allowedStatuses={[
                    "EMAIL_CONFIRMED",
                    "PROFILE_GENERATED",
                    "PROFILE_CONFIRMED",
                    "PREFERENCES_SET",
                  ]}
                >
                  <ProfileCreation />
                </ProtectedRoute>
              }
            />

            {/* Profile snapshot - for users with PROFILE_GENERATED or PROFILE_CONFIRMED status */}
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute
                  allowedStatuses={[
                    "PROFILE_GENERATED",
                    "PROFILE_CONFIRMED",
                    "PREFERENCES_SET",
                  ]}
                >
                  <ProfileSnapshot />
                </ProtectedRoute>
              }
            />

            {/* Dashboard and other routes - for users with PROFILE_CONFIRMED status */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/branding"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <Branding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-preferences"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <WorkPreferences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/waiting-room"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <WaitingRoom />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
