
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedStatuses?: string[];
}

export const ProtectedRoute = ({ children, allowedStatuses }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Query to check onboarding status
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_status')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have email confirmed, they should only see check-email page
  if (!user.email_confirmed_at && location.pathname !== '/check-email') {
    return <Navigate to="/check-email" replace />;
  }

  const currentStatus = profileData?.onboarding_status;

  // If no profile data, something went wrong - send to profile creation
  if (!currentStatus) {
    return <Navigate to="/dashboard/profile-creation" replace />;
  }

  // If allowedStatuses is provided, check if current status is allowed
  if (allowedStatuses && !allowedStatuses.includes(currentStatus)) {
    // Redirect based on current onboarding status
    switch (currentStatus) {
      case 'SIGNED_UP':
        return <Navigate to="/check-email" replace />;
      case 'EMAIL_CONFIRMED':
        return <Navigate to="/dashboard/profile-creation" replace />;
      case 'PROFILE_GENERATED':
        return <Navigate to="/dashboard/profile-snapshot" replace />;
      case 'PROFILE_CONFIRMED':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/dashboard/profile-creation" replace />;
    }
  }

  return <>{children}</>;
};
