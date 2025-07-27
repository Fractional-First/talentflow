
import { supabase } from "@/integrations/supabase/client"

export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token')
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key)
    }
  })
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key)
    }
  })
}

export const resetUserState = async () => {
  try {
    // Clean up auth state first
    cleanupAuthState()
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' })
    } catch (err) {
      console.log('Sign out attempt failed, continuing with cleanup')
    }
    
    // Force page reload for a clean state
    window.location.href = '/login'
  } catch (error) {
    console.error('Error resetting user state:', error)
    // Force reload even if there's an error
    window.location.href = '/login'
  }
}
