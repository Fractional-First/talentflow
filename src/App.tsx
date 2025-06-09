
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import CheckEmail from "./pages/CheckEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfileCreation from "./pages/dashboard/ProfileCreation";
import ProfileSnapshot from "./pages/dashboard/ProfileSnapshot";
import Branding from "./pages/dashboard/Branding";
import JobMatching from "./pages/dashboard/JobMatching";
import WaitingRoom from "./pages/dashboard/WaitingRoom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Check email - for users with SIGNED_UP status */}
            <Route path="/check-email" element={
              <ProtectedRoute allowedStatuses={['SIGNED_UP']}>
                <CheckEmail />
              </ProtectedRoute>
            } />
            
            {/* Profile creation - for users with EMAIL_CONFIRMED status */}
            <Route path="/dashboard/profile-creation" element={
              <ProtectedRoute allowedStatuses={['EMAIL_CONFIRMED']}>
                <ProfileCreation />
              </ProtectedRoute>
            } />
            
            {/* Profile snapshot - for users with PROFILE_GENERATED status */}
            <Route path="/dashboard/profile-snapshot" element={
              <ProtectedRoute allowedStatuses={['PROFILE_GENERATED']}>
                <ProfileSnapshot />
              </ProtectedRoute>
            } />
            
            {/* Dashboard and other routes - for users with PROFILE_CONFIRMED status */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedStatuses={['PROFILE_CONFIRMED']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/branding" element={
              <ProtectedRoute allowedStatuses={['PROFILE_CONFIRMED']}>
                <Branding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/job-matching" element={
              <ProtectedRoute allowedStatuses={['PROFILE_CONFIRMED']}>
                <JobMatching />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/waiting-room" element={
              <ProtectedRoute allowedStatuses={['PROFILE_CONFIRMED']}>
                <WaitingRoom />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
