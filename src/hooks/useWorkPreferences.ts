
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface WorkPreferences {
  id: string
  user_id: string
  current_location_id: string | null
  timezone_id: string | null
  created_at: string
  updated_at: string
  current_location?: {
    id: string
    name: string
    formatted_address: string | null
  } | null
  timezone?: {
    id: string
    value: string
    text: string
  } | null
}

interface WorkEligibility {
  id: string
  user_id: string
  country_code: string
  created_at: string
  country: {
    name: string
    alpha2_code: string
  }
}

export const useWorkPreferences = () => {
  const queryClient = useQueryClient()

  // Fetch work preferences
  const { data: workPreferences, isLoading: isLoadingWorkPreferences } = useQuery({
    queryKey: ['work-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_preferences')
        .select(`
          *,
          current_location:locations(*),
          timezone:timezones(*)
        `)
        .maybeSingle()

      if (error) throw error
      return data as WorkPreferences | null
    }
  })

  // Fetch work eligibility
  const { data: workEligibility = [], isLoading: isLoadingEligibility } = useQuery({
    queryKey: ['work-eligibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_work_eligibility')
        .select(`
          *,
          country:countries(name, alpha2_code)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as WorkEligibility[]
    }
  })

  // Update work preferences
  const updateWorkPreferencesMutation = useMutation({
    mutationFn: async (preferences: {
      current_location_id?: string | null
      timezone_id?: string | null
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('work_preferences')
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
      queryClient.invalidateQueries({ queryKey: ['work-preferences'] })
    }
  })

  // Add work eligibility
  const addWorkEligibilityMutation = useMutation({
    mutationFn: async (countryCode: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_work_eligibility')
        .insert({
          user_id: user.id,
          country_code: countryCode
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-eligibility'] })
    }
  })

  // Remove work eligibility
  const removeWorkEligibilityMutation = useMutation({
    mutationFn: async (countryCode: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('user_work_eligibility')
        .delete()
        .eq('user_id', user.id)
        .eq('country_code', countryCode)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-eligibility'] })
    }
  })

  return {
    workPreferences,
    workEligibility,
    isLoading: isLoadingWorkPreferences || isLoadingEligibility,
    updateWorkPreferences: updateWorkPreferencesMutation.mutate,
    addWorkEligibility: addWorkEligibilityMutation.mutate,
    removeWorkEligibility: removeWorkEligibilityMutation.mutate,
    isUpdating: updateWorkPreferencesMutation.isPending,
    isAddingEligibility: addWorkEligibilityMutation.isPending,
    isRemovingEligibility: removeWorkEligibilityMutation.isPending
  }
}
