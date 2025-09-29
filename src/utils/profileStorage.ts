// Utility functions for managing profile data in sessionStorage
import { ProfileData } from "@/types/profile"

export interface GeneratedProfile extends ProfileData {
  id: string
  generatedAt: string
  resume?: any
  linkedin?: any
  docs?: any[]
  links?: any[]
}

const STORAGE_KEY = "generatedProfile"

export const profileStorage = {
  // Store profile data in sessionStorage
  set: (profile: GeneratedProfile): void => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.error("Failed to store profile in sessionStorage:", error)
    }
  },

  // Get profile data from sessionStorage
  get: (): GeneratedProfile | null => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Failed to retrieve profile from sessionStorage:", error)
      return null
    }
  },

  // Remove profile data from sessionStorage
  remove: (): void => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to remove profile from sessionStorage:", error)
    }
  },

  // Check if profile exists in sessionStorage
  exists: (): boolean => {
    return profileStorage.get() !== null
  },
}
