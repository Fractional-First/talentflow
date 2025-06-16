
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface Country {
  id: string
  name: string
  alpha2_code: string
  alpha3_code: string
  country_code: number
  iso_3166_2: string | null
  region: string | null
  sub_region: string | null
  intermediate_region: string | null
  region_code: number | null
  sub_region_code: number | null
  intermediate_region_code: number | null
  created_at: string
  updated_at: string
}

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async (): Promise<Country[]> => {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("name")

      if (error) {
        console.error("Error loading countries:", error)
        throw error
      }

      return data || []
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours since countries don't change often
  })
}

export function useCountriesByRegion(region?: string) {
  return useQuery({
    queryKey: ["countries", "by-region", region],
    queryFn: async (): Promise<Country[]> => {
      let query = supabase
        .from("countries")
        .select("*")
        .order("name")

      if (region) {
        query = query.eq("region", region)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error loading countries by region:", error)
        throw error
      }

      return data || []
    },
    enabled: !!region,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("countries")
        .select("region")
        .not("region", "is", null)
        .order("region")

      if (error) {
        console.error("Error loading regions:", error)
        throw error
      }

      // Extract unique regions
      const uniqueRegions = [...new Set(data?.map(item => item.region).filter(Boolean))]
      return uniqueRegions
    },
    staleTime: 24 * 60 * 60 * 1000,
  })
}
