
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Spinner } from "@/components/ui/spinner";

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const CheckEmail = lazy(() => import('./pages/CheckEmail'));
const CreateProfile = lazy(() => import('./pages/CreateProfile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const WorkPreferences = lazy(() => import('./pages/WorkPreferences'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Agreement = lazy(() => import('./pages/dashboard/Agreement'));
const WaitingRoom = lazy(() => import('./pages/dashboard/WaitingRoom'));
const Branding = lazy(() => import('./pages/dashboard/Branding'));
const ExecutiveCoaching = lazy(() => import('./pages/dashboard/ExecutiveCoaching'));
const TeamCoaching = lazy(() => import('./pages/dashboard/TeamCoaching'));
const Settings = lazy(() => import('./pages/Settings'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route path="/create-profile" element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/work-preferences" element={
              <ProtectedRoute>
                <WorkPreferences />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/agreement" element={
              <ProtectedRoute>
                <Agreement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/waiting-room" element={
              <ProtectedRoute>
                <WaitingRoom />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/branding" element={
              <ProtectedRoute>
                <Branding />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/branding/executive-coaching" element={
              <ProtectedRoute>
                <ExecutiveCoaching />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/branding/team-coaching" element={
              <ProtectedRoute>
                <TeamCoaching />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
