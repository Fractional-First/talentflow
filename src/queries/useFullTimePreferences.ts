import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface FullTimePreferences {
  id: string
  user_id: string
  min_salary: number | null
  max_salary: number | null
  remote_ok: boolean | null
  start_date: string | null
  created_at: string
  updated_at: string
}

interface FullTimeLocationPreference {
  id: string
  user_id: string
  location_id: string
  created_at: string
  location: {
    id: string
    name: string
    formatted_address: string | null
  }
}

interface FullTimeIndustryPreference {
  id: string
  user_id: string
  industry_id: string
  created_at: string
  industry: {
    id: string
    name: string
    slug: string
  }
}

export const useFullTimePreferences = () => {
  const queryClient = useQueryClient()

  // Fetch full-time preferences
  const {
    data: fullTimePreferences,
    isLoading: isLoadingPreferences,
    error: errorPreferences,
  } = useQuery({
    queryKey: ["full-time-preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("full_time_preferences")
        .select("*")
        .maybeSingle()

      if (error) throw error
      return data as FullTimePreferences | null
    },
  })

  // Fetch location preferences
  const {
    data: locationPreferences = [],
    isLoading: isLoadingLocations,
    error: errorLocations,
  } = useQuery({
    queryKey: ["full-time-location-preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("full_time_location_preferences")
        .select(
          `
          *,
          location:locations(*)
        `
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as FullTimeLocationPreference[]
    },
  })

  // Fetch industry preferences
  const {
    data: industryPreferences = [],
    isLoading: isLoadingIndustries,
    error: errorIndustries,
  } = useQuery({
    queryKey: ["full-time-industry-preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("full_time_industry_preferences")
        .select(
          `
          *,
          industry:industries(*)
        `
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as FullTimeIndustryPreference[]
    },
  })

  // Update full-time preferences
  const updateFullTimePreferencesMutation = useMutation({
    mutationFn: async (preferences: {
      min_salary?: number | null
      max_salary?: number | null
      remote_ok?: boolean | null
      start_date?: string | null
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("full_time_preferences")
        .upsert(
          {
            user_id: user.id,
            ...preferences,
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["full-time-preferences"] })
    },
  })

  // Add location preference
  const addLocationPreferenceMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("full_time_location_preferences")
        .insert({
          user_id: user.id,
          location_id: locationId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["full-time-location-preferences"],
      })
    },
  })

  // Remove location preference
  const removeLocationPreferenceMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("full_time_location_preferences")
        .delete()
        .eq("user_id", user.id)
        .eq("location_id", locationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["full-time-location-preferences"],
      })
    },
  })

  // Add industry preference
  const addIndustryPreferenceMutation = useMutation({
    mutationFn: async (industryId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("full_time_industry_preferences")
        .insert({
          user_id: user.id,
          industry_id: industryId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["full-time-industry-preferences"],
      })
    },
  })

  // Remove industry preference
  const removeIndustryPreferenceMutation = useMutation({
    mutationFn: async (industryId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("full_time_industry_preferences")
        .delete()
        .eq("user_id", user.id)
        .eq("industry_id", industryId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["full-time-industry-preferences"],
      })
    },
  })

  return {
    fullTimePreferences,
    locationPreferences,
    industryPreferences,
    isLoading:
      isLoadingPreferences || isLoadingLocations || isLoadingIndustries,
    errorPreferences,
    errorLocations,
    errorIndustries,
    updateFullTimePreferences: updateFullTimePreferencesMutation.mutate,
    addLocationPreference: addLocationPreferenceMutation.mutate,
    removeLocationPreference: removeLocationPreferenceMutation.mutate,
    addIndustryPreference: addIndustryPreferenceMutation.mutate,
    removeIndustryPreference: removeIndustryPreferenceMutation.mutate,
    isUpdating: updateFullTimePreferencesMutation.isPending,
    isAddingLocation: addLocationPreferenceMutation.isPending,
    isRemovingLocation: removeLocationPreferenceMutation.isPending,
    isAddingIndustry: addIndustryPreferenceMutation.isPending,
    isRemovingIndustry: removeIndustryPreferenceMutation.isPending,
  }
}
