import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import type { Session, User } from "@supabase/supabase-js"
import { useQueryClient } from "@tanstack/react-query"

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Clean up auth state in storage
  const cleanupAuthState = () => {
    // Optionally, clean up sessionStorage if you have a specific reason
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        sessionStorage.removeItem(key)
      }
    })
  }

  // Function to redirect user based on onboarding status
  const redirectBasedOnStatus = async (user: User) => {
    try {
      // Update onboarding status to EMAIL_CONFIRMED if email is confirmed but status is still SIGNED_UP
      if (user.email_confirmed_at) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_status")
          .eq("id", user.id)
          .single()
        let updatedStatus = profile?.onboarding_status
        if (profile?.onboarding_status === "SIGNED_UP") {
          await supabase
            .from("profiles")
            .update({ onboarding_status: "EMAIL_CONFIRMED" })
            .eq("id", user.id)
          updatedStatus = "EMAIL_CONFIRMED"
          // Invalidate the profile query so all consumers refetch
          queryClient.invalidateQueries({
            queryKey: ["profile", user.id],
          })
        }
        const currentStatus = updatedStatus
        // Redirect based on onboarding status
        switch (currentStatus) {
          case "EMAIL_CONFIRMED":
            navigate("/create-profile")
            break
          case "PROFILE_GENERATED":
            navigate("/edit-profile")
            break
          case "PROFILE_CONFIRMED":
            navigate("/dashboard")
            break
          default:
            navigate("/create-profile")
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      navigate("/create-profile")
    }
  }

  useEffect(() => {
    // Set up auth state listener ONCE
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state change:", event, newSession?.user?.email)
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      // Handle post-verification sign-in
      if (event === "SIGNED_IN" && newSession?.user && !isInitialLoad) {
        await redirectBasedOnStatus(newSession.user)
        toast.success("Successfully signed in")
      } else if (event === "SIGNED_OUT") {
        // Only show sign out toast if it's not part of initial load
        if (!isInitialLoad) {
          toast.info("Signed out")
        }
      }
    })
    // Cleanup on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setLoading(false)
        throw error
      }

      // Don't set loading to false here - let the auth state change handle it
      // Navigation will be handled by the auth state change listener
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message || "Error signing in")
      console.error("Sign in error:", error)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setLoading(true)

      // Clean up existing state
      cleanupAuthState()

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/create-profile`,
          data: {
            first_name: firstName || "",
            last_name: lastName || "",
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      // If data.user exists but no session, it means confirmation email was sent
      if (data.user && !data.session) {
        // Navigate to check email page only if signup was successful
        navigate(`/check-email?email=${encodeURIComponent(email)}`)
        return {}
      }

      // If we get here with a session, user was created and logged in immediately
      return {}
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { error: error.message || "Error signing up" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)

      // Clean up auth state
      cleanupAuthState()

      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: "global" })
      if (error) throw error

      // Use React Router navigation instead of window.location
      navigate("/", { replace: true })
    } catch (error: any) {
      toast.error(error.message || "Error signing out")
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

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
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
