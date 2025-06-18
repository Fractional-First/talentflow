import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface LocationData {
  place_id: string
  name: string
  formatted_address: string
  city?: string
  state_province?: string
  country_code?: string
  latitude?: number
  longitude?: number
  place_types?: string[]
}

interface UserLocationPreference {
  id: string
  location_id: string
  preference_type: "current" | "preferred_work"
  location: {
    id: string
    place_id: string
    name: string
    formatted_address: string
    city?: string
    state_province?: string
    country_code?: string
    latitude?: number
    longitude?: number
    place_types?: string[]
  }
}

export const useLocationPreferences = () => {
  const queryClient = useQueryClient()

  // Fetch user's location preferences
  const {
    data: locationPreferences = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-location-preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_location_preferences")
        .select(
          `
          *,
          location:locations(*)
        `
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as UserLocationPreference[]
    },
  })

  // Save location to database and create user preference
  const saveLocationMutation = useMutation({
    mutationFn: async ({
      locationData,
      preferenceType,
    }: {
      locationData: LocationData
      preferenceType: "current" | "preferred_work"
    }) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // First, upsert the location
      const { data: location, error: locationError } = await supabase
        .from("locations")
        .upsert(
          {
            place_id: locationData.place_id,
            name: locationData.name,
            formatted_address: locationData.formatted_address,
            city: locationData.city,
            state_province: locationData.state_province,
            country_code: locationData.country_code,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            place_types: locationData.place_types,
          },
          {
            onConflict: "place_id",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single()

      if (locationError) throw locationError

      // Then create/update the user preference
      const { data: preference, error: preferenceError } = await supabase
        .from("user_location_preferences")
        .upsert(
          {
            user_id: user.id,
            location_id: location.id,
            preference_type: preferenceType,
          },
          {
            onConflict: "user_id,location_id,preference_type",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single()

      if (preferenceError) throw preferenceError

      return { location, preference }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-location-preferences"] })
    },
  })

  // Remove location preference
  const removeLocationMutation = useMutation({
    mutationFn: async (preferenceId: string) => {
      const { error } = await supabase
        .from("user_location_preferences")
        .delete()
        .eq("id", preferenceId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-location-preferences"] })
    },
  })

  // Helper functions to get specific types of preferences
  const getCurrentLocation = () => {
    return locationPreferences.find(
      (pref) => pref.preference_type === "current"
    )?.location
  }

  const getPreferredWorkLocations = () => {
    return locationPreferences
      .filter((pref) => pref.preference_type === "preferred_work")
      .map((pref) => pref.location)
  }

  return {
    locationPreferences,
    isLoading,
    error,
    saveLocation: saveLocationMutation.mutate,
    removeLocation: removeLocationMutation.mutate,
    getCurrentLocation,
    getPreferredWorkLocations,
    isSaving: saveLocationMutation.isPending,
    isRemoving: removeLocationMutation.isPending,
  }
}
