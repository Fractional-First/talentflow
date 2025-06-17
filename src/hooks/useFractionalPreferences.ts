
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface FractionalPreferences {
  id: string
  user_id: string
  min_hourly_rate: number | null
  max_hourly_rate: number | null
  min_daily_rate: number | null
  max_daily_rate: number | null
  min_hours_per_week: number | null
  max_hours_per_week: number | null
  remote_ok: boolean | null
  payment_type: string | null
  start_date: string | null
  created_at: string
  updated_at: string
}

interface FractionalLocationPreference {
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

interface FractionalIndustryPreference {
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

export const useFractionalPreferences = () => {
  const queryClient = useQueryClient()

  // Fetch fractional preferences
  const { data: fractionalPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['fractional-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fractional_preferences')
        .select('*')
        .maybeSingle()

      if (error) throw error
      return data as FractionalPreferences | null
    }
  })

  // Fetch location preferences
  const { data: locationPreferences = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['fractional-location-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fractional_location_preferences')
        .select(`
          *,
          location:locations(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FractionalLocationPreference[]
    }
  })

  // Fetch industry preferences
  const { data: industryPreferences = [], isLoading: isLoadingIndustries } = useQuery({
    queryKey: ['fractional-industry-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fractional_industry_preferences')
        .select(`
          *,
          industry:industries(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FractionalIndustryPreference[]
    }
  })

  // Update fractional preferences
  const updateFractionalPreferencesMutation = useMutation({
    mutationFn: async (preferences: {
      min_hourly_rate?: number | null
      max_hourly_rate?: number | null
      min_daily_rate?: number | null
      max_daily_rate?: number | null
      min_hours_per_week?: number | null
      max_hours_per_week?: number | null
      remote_ok?: boolean | null
      payment_type?: string | null
      start_date?: string | null
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('fractional_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fractional-preferences'] })
    }
  })

  // Add location preference
  const addLocationPreferenceMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('fractional_location_preferences')
        .insert({
          user_id: user.id,
          location_id: locationId
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fractional-location-preferences'] })
    }
  })

  // Remove location preference
  const removeLocationPreferenceMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('fractional_location_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('location_id', locationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fractional-location-preferences'] })
    }
  })

  // Add industry preference
  const addIndustryPreferenceMutation = useMutation({
    mutationFn: async (industryId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('fractional_industry_preferences')
        .insert({
          user_id: user.id,
          industry_id: industryId
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fractional-industry-preferences'] })
    }
  })

  // Remove industry preference
  const removeIndustryPreferenceMutation = useMutation({
    mutationFn: async (industryId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('fractional_industry_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('industry_id', industryId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fractional-industry-preferences'] })
    }
  })

  return {
    fractionalPreferences,
    locationPreferences,
    industryPreferences,
    isLoading: isLoadingPreferences || isLoadingLocations || isLoadingIndustries,
    updateFractionalPreferences: updateFractionalPreferencesMutation.mutate,
    addLocationPreference: addLocationPreferenceMutation.mutate,
    removeLocationPreference: removeLocationPreferenceMutation.mutate,
    addIndustryPreference: addIndustryPreferenceMutation.mutate,
    removeIndustryPreference: removeIndustryPreferenceMutation.mutate,
    isUpdating: updateFractionalPreferencesMutation.isPending,
    isAddingLocation: addLocationPreferenceMutation.isPending,
    isRemovingLocation: removeLocationPreferenceMutation.isPending,
    isAddingIndustry: addIndustryPreferenceMutation.isPending,
    isRemovingIndustry: removeIndustryPreferenceMutation.isPending
  }
}
