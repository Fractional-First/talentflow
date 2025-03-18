
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfileCreation from "./pages/dashboard/ProfileCreation";
import ProfileSnapshot from "./pages/dashboard/ProfileSnapshot";
import Agreement from "./pages/dashboard/Agreement";
import Branding from "./pages/dashboard/Branding";
import JobMatching from "./pages/dashboard/JobMatching";
import WaitingRoom from "./pages/dashboard/WaitingRoom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile-creation" element={<ProfileCreation />} />
          <Route path="/dashboard/profile-snapshot" element={<ProfileSnapshot />} />
          <Route path="/dashboard/agreement" element={<Agreement />} />
          <Route path="/dashboard/branding" element={<Branding />} />
          <Route path="/dashboard/job-matching" element={<JobMatching />} />
          <Route path="/dashboard/waiting-room" element={<WaitingRoom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
