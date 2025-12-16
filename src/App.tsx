import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import CheckEmail from "./pages/CheckEmail"
import ChangePassword from "./pages/ChangePassword"
import ForgotPassword from "./pages/ForgotPassword"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import ResetPassword from "./pages/ResetPassword"
import SignUp from "./pages/SignUp"
import Branding from "./pages/dashboard/Branding"
import Dashboard from "./pages/dashboard/Dashboard"
import ExecutiveCoaching from "./pages/dashboard/ExecutiveCoaching"
import TeamCoaching from "./pages/dashboard/TeamCoaching"
import ProfileCreation from "./pages/CreateProfile"
import ProfileSnapshot from "./pages/EditProfile"
import PublicProfile from "./pages/PublicProfile"
import WaitingRoom from "./pages/dashboard/WaitingRoom"
import WorkPreferences from "./pages/WorkPreferences"
import AuthCallback from "./pages/AuthCallback"
import Settings from "./pages/Settings"
import Agreements from "./pages/Agreements"
import IdentityVerification from "./pages/IdentityVerification"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import ProfileGenerator from "./pages/ProfileGenerator"
import ProfileGeneratorCreate from "./pages/ProfileGeneratorCreate"
import ProfileGeneratorPreview from "./pages/ProfileGeneratorPreview"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />

            {/* Change password route - for users with SET_PASSWORD status */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedStatuses={["SET_PASSWORD"]}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            {/* Public profile route - no auth required */}
            <Route path="/profile/:slug" element={<PublicProfile />} />
            <Route path="/profile/preview/:uuid" element={<PublicProfile />} />

            {/* Profile Generator routes - no auth required */}
            <Route path="/profile-generator" element={<ProfileGenerator />} />
            <Route
              path="/profile-generator/create"
              element={<ProfileGeneratorCreate />}
            />
            <Route
              path="/profile-generator/preview"
              element={<ProfileGeneratorPreview />}
            />

            {/* Identity verification - shown after email confirmation */}
            <Route
              path="/identity-verification"
              element={
                <ProtectedRoute allowedStatuses={["EMAIL_CONFIRMED"]}>
                  <IdentityVerification />
                </ProtectedRoute>
              }
            />

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
              path="/dashboard/executive-coaching"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <ExecutiveCoaching />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/team-coaching"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <TeamCoaching />
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
              path="/agreements"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <Agreements />
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
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  allowedStatuses={["PROFILE_CONFIRMED", "PREFERENCES_SET"]}
                >
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
