import { useFullTimePreferences } from "@/queries/useFullTimePreferences"
import { useFractionalPreferences } from "@/queries/useFractionalPreferences"
import { useLocationPreferences } from "@/queries/useLocationPreferences"
import { useWorkPreferences as useWorkPrefsQuery } from "@/queries/useWorkPreferences"
import { useEffect, useState } from "react"
import type { GooglePlace } from "@/components/work-preferences/LocationAutocomplete"
import { supabase } from "@/integrations/supabase/client"

export interface CombinedWorkPreferencesForm {
  // Full-time
  fullTime: {
    min_salary: number | null
    max_salary: number | null
    remote_ok: boolean | null
    start_date: string | null
    locations: GooglePlace[]
    industries: string[]
    open_for_work: boolean
  }
  // Fractional
  fractional: {
    min_hourly_rate: number | null
    max_hourly_rate: number | null
    min_daily_rate: number | null
    max_daily_rate: number | null
    min_hours_per_week: number | null
    max_hours_per_week: number | null
    remote_ok: boolean | null
    payment_type: string | null
    start_date: string | null
    locations: GooglePlace[]
    industries: string[]
    open_for_work: boolean
  }
  // General
  current_location_id: string | null // UUID or Google Place ID
  currentLocationObj: any | null // Google Place object or null
  timezone_id: string | null
  work_eligibility: string[] // country codes
}

const defaultForm: CombinedWorkPreferencesForm = {
  fullTime: {
    min_salary: null,
    max_salary: null,
    remote_ok: null,
    start_date: null,
    locations: [],
    industries: [],
    open_for_work: false,
  },
  fractional: {
    min_hourly_rate: null,
    max_hourly_rate: null,
    min_daily_rate: null,
    max_daily_rate: null,
    min_hours_per_week: null,
    max_hours_per_week: null,
    remote_ok: null,
    payment_type: null,
    start_date: null,
    locations: [],
    industries: [],
    open_for_work: false,
  },
  current_location_id: null,
  currentLocationObj: null,
  timezone_id: null,
  work_eligibility: [],
}

async function fetchLocationDetails(
  locationIds: string[]
): Promise<GooglePlace[]> {
  if (!locationIds.length) return []

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .in("id", locationIds)

  if (error) throw error
  return data as GooglePlace[]
}

export function useWorkPreferences() {
  const fullTime = useFullTimePreferences()
  const fractional = useFractionalPreferences()
  const locations = useLocationPreferences()
  const work = useWorkPrefsQuery()

  const [form, setForm] = useState<CombinedWorkPreferencesForm>(defaultForm)
  const [initialized, setInitialized] = useState(false)

  const isLoading =
    fullTime.isLoading ||
    fractional.isLoading ||
    locations.isLoading ||
    work.isLoading

  useEffect(() => {
    async function initializeForm() {
      if (!isLoading && !initialized) {
        // Fetch location details for both full-time and fractional preferences
        const ftLocationIds =
          fullTime.locationPreferences?.map((lp) => lp.location_id) || []
        const fracLocationIds =
          fractional.locationPreferences?.map((lp) => lp.location_id) || []

        const [ftLocations, fracLocations] = await Promise.all([
          fetchLocationDetails(ftLocationIds),
          fetchLocationDetails(fracLocationIds),
        ])

        setForm({
          fullTime: {
            min_salary: fullTime.fullTimePreferences?.min_salary ?? null,
            max_salary: fullTime.fullTimePreferences?.max_salary ?? null,
            remote_ok: fullTime.fullTimePreferences?.remote_ok ?? null,
            start_date: fullTime.fullTimePreferences?.start_date ?? null,
            locations: ftLocations,
            industries:
              fullTime.industryPreferences?.map((i) => i.industry_id) ?? [],
            open_for_work: fullTime.fullTimePreferences?.open_for_work ?? false,
          },
          fractional: {
            min_hourly_rate:
              fractional.fractionalPreferences?.min_hourly_rate ?? null,
            max_hourly_rate:
              fractional.fractionalPreferences?.max_hourly_rate ?? null,
            min_daily_rate:
              fractional.fractionalPreferences?.min_daily_rate ?? null,
            max_daily_rate:
              fractional.fractionalPreferences?.max_daily_rate ?? null,
            min_hours_per_week:
              fractional.fractionalPreferences?.min_hours_per_week ?? null,
            max_hours_per_week:
              fractional.fractionalPreferences?.max_hours_per_week ?? null,
            remote_ok: fractional.fractionalPreferences?.remote_ok ?? null,
            payment_type:
              fractional.fractionalPreferences?.payment_type ?? null,
            start_date: fractional.fractionalPreferences?.start_date ?? null,
            locations: fracLocations,
            industries:
              fractional.industryPreferences?.map((i) => i.industry_id) ?? [],
            open_for_work:
              fractional.fractionalPreferences?.open_for_work ?? false,
          },
          current_location_id:
            work.workPreferences?.current_location_id ?? null,
          currentLocationObj: work.workPreferences?.current_location ?? null,
          timezone_id: work.workPreferences?.timezone_id ?? null,
          work_eligibility:
            work.workEligibility?.map((e) => e.country_code) ?? [],
        })
        setInitialized(true)
      }
    }

    initializeForm()
  }, [isLoading, initialized, fullTime, fractional, locations, work])

  // Helper to update both current_location_id and currentLocationObj
  function setCurrentLocation(location: string | { place_id: string } | null) {
    if (!location) {
      setForm((prev) => ({
        ...prev,
        current_location_id: null,
        currentLocationObj: null,
      }))
    } else if (typeof location === "string") {
      setForm((prev) => ({
        ...prev,
        current_location_id: location,
        currentLocationObj: null,
      }))
    } else if (typeof location === "object" && "place_id" in location) {
      setForm((prev) => ({
        ...prev,
        current_location_id: location.place_id,
        currentLocationObj: location,
      }))
    }
  }

  return {
    form,
    setForm,
    setCurrentLocation,
    isLoading,
    initialized,
    error:
      fullTime.errorPreferences ||
      fullTime.errorLocations ||
      fullTime.errorIndustries ||
      fractional.errorPreferences ||
      fractional.errorLocations ||
      fractional.errorIndustries ||
      locations.error ||
      work.errorWorkPreferences ||
      work.errorEligibility,
  }
}
