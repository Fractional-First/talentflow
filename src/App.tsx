import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
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
import AuthCallback from "./pages/AuthCallback"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
