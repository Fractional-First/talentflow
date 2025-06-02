
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  // Clean up auth state in storage
  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle post-verification sign-in
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Check if user has completed profile creation
          if (newSession.user.email_confirmed_at && !isInitialLoad) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('profile_created')
                .eq('id', newSession.user.id)
                .single();
              
              if (profile && !profile.profile_created) {
                // User needs to complete profile creation
                console.log('Redirecting to profile creation');
                navigate('/dashboard/profile-creation');
              } else {
                // User has completed profile, go to dashboard
                console.log('Redirecting to dashboard');
                navigate('/dashboard');
              }
            } catch (error) {
              console.error('Error checking profile status:', error);
              // Fallback to profile creation if we can't check
              navigate('/dashboard/profile-creation');
            }
            
            toast.success('Successfully signed in');
          }
        } else if (event === 'SIGNED_OUT' && !isSigningIn && !isSigningOut) {
          // Only show sign out toast if it's not part of a controlled sign-in/out process
          toast.info('Signed out');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error fetching auth session:', error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [isSigningIn, isSigningOut, navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setIsSigningIn(true);
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.error('Error during global sign out:', err);
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Navigation will be handled by the auth state change listener
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
      setIsSigningIn(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean up existing state
      cleanupAuthState();

      console.log('Redirecting to:', `${window.location.origin}/dashboard/profile-creation`);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/profile-creation`
        }
      });
      
      if (error) {
        // Check if it's a "user already exists" error
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return { error: 'An account with this email already exists. Please try signing in instead.' };
        }
        return { error: error.message };
      }
      
      // Navigate to check email page only if signup was successful
      navigate(`/check-email?email=${encodeURIComponent(email)}`);
      return {};
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message || 'Error signing up' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setIsSigningOut(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Use React Router navigation instead of window.location
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
      setIsSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
