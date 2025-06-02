
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
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile-creation" element={
              <ProtectedRoute requireProfileCreation={false}>
                <ProfileCreation />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile-snapshot" element={
              <ProtectedRoute>
                <ProfileSnapshot />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/branding" element={
              <ProtectedRoute>
                <Branding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/job-matching" element={
              <ProtectedRoute>
                <JobMatching />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/waiting-room" element={
              <ProtectedRoute>
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
