
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { cleanupAuthState } from "@/utils/authUtils"

export function useSignOut() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signOut = async () => {
    setLoading(true)
    try {
      // Clean up auth state first
      cleanupAuthState()

      // Clear all queries
      queryClient.clear()

      // Attempt global sign out
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' })
        if (error) console.error('Sign out error:', error)
      } catch (error) {
        console.error('Sign out error:', error)
      }

      // Force page reload to ensure clean state
      window.location.href = '/login'
    } catch (error) {
      console.error('Sign out error:', error)
      // Force reload even if there's an error
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  return { signOut, loading }
}
