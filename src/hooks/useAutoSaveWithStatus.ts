
import { useCallback, useEffect, useState, useRef } from "react"
import type { ProfileData } from "@/types/profile"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"

interface AutoSaveStatus {
  status: "idle" | "saving" | "saved" | "error"
  lastSavedTime?: Date
}

export function useAutoSaveWithStatus({
  user,
  formData,
  profileData,
  toast,
}: {
  user: { id: string } | null | undefined
  formData: ProfileData
  profileData: ProfileData | null | undefined
  toast: (opts: {
    title: string
    description: string
    variant: "default" | "destructive"
  }) => void
}) {
  const [saveStatus, setSaveStatus] = useState<AutoSaveStatus>({
    status: "idle"
  })
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const savingDelayTimeoutRef = useRef<NodeJS.Timeout>()
  const isInitialLoadRef = useRef(true)
  const lastSavedDataRef = useRef<string>("")

  const autoSave = useCallback(
    async (dataToSave: ProfileData) => {
      if (!user?.id || !dataToSave || Object.keys(dataToSave).length === 0)
        return

      // Check if data actually changed from last saved version
      const currentDataString = JSON.stringify(dataToSave)
      if (currentDataString === lastSavedDataRef.current) {
        return
      }

      setSaveStatus({ status: "saving" })
      
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ profile_data: dataToSave as Json })
          .eq("id", user.id)
        
        if (error) throw error
        
        // Update the last saved data reference
        lastSavedDataRef.current = currentDataString
        
        // Short delay before showing "saved" status to avoid flickering
        savingDelayTimeoutRef.current = setTimeout(() => {
          setSaveStatus({
            status: "saved",
            lastSavedTime: new Date()
          })
        }, 500)
        
      } catch (error) {
        console.error("Error auto-saving profile:", error)
        setSaveStatus({ status: "error" })
        toast({
          title: "Auto-save failed",
          description:
            "Your changes couldn't be saved automatically. Please try again.",
          variant: "destructive",
        })
      }
    },
    [user?.id, toast]
  )

  const retrySave = useCallback(() => {
    if (formData && Object.keys(formData).length > 0) {
      autoSave(formData)
    }
  }, [formData, autoSave])

  useEffect(() => {
    // Clear any existing timeouts
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    if (savingDelayTimeoutRef.current) {
      clearTimeout(savingDelayTimeoutRef.current)
    }

    if (!formData || Object.keys(formData).length === 0 || !profileData) return
    
    // Skip auto-save on initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false
      lastSavedDataRef.current = JSON.stringify(profileData)
      return
    }
    
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(profileData)
    if (!hasChanges) return
    
    // 1 second debounce - only start saving after user stops typing
    debounceTimeoutRef.current = setTimeout(() => {
      autoSave(formData)
    }, 1000)
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (savingDelayTimeoutRef.current) {
        clearTimeout(savingDelayTimeoutRef.current)
      }
    }
  }, [formData, autoSave, profileData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (savingDelayTimeoutRef.current) {
        clearTimeout(savingDelayTimeoutRef.current)
      }
    }
  }, [])

  return {
    saveStatus,
    retrySave
  }
}
