import { useFullTimePreferences } from "@/queries/useFullTimePreferences"
import { useFractionalPreferences } from "@/queries/useFractionalPreferences"
import { useWorkPreferences as useWorkPrefsQuery } from "@/queries/useWorkPreferences"
import { CombinedWorkPreferencesForm } from "./useWorkPreferences"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import type { GooglePlace } from "@/components/work-preferences/LocationAutocomplete"

function diffIds(current: string[], desired: string[]) {
  const toAdd = desired.filter((id) => !current.includes(id))
  const toRemove = current.filter((id) => !desired.includes(id))
  return { toAdd, toRemove }
}

async function upsertLocationAndGetId(place: GooglePlace): Promise<string> {
  // First check if the location already exists
  const { data: existingLocation, error: selectError } = await supabase
    .from("locations")
    .select("id")
    .eq("place_id", place.place_id)
    .single()

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    throw selectError
  }

  // If location exists, return its ID
  if (existingLocation) {
    return existingLocation.id
  }

  // If location doesn't exist, insert it
  const { data, error } = await supabase
    .from("locations")
    .insert({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      city: place.city,
      state_province: place.state_province,
      country_code: place.country_code,
      latitude: place.latitude,
      longitude: place.longitude,
      place_types: place.place_types,
    })
    .select("id")
    .single()

  if (error) throw error
  return data.id
}

export function useSaveWorkPreferences() {
  const fullTime = useFullTimePreferences()
  const fractional = useFractionalPreferences()
  const work = useWorkPrefsQuery()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  const save = async (form: CombinedWorkPreferencesForm) => {
    setIsSaving(true)
    setError(null)
    try {
      // --- LOCATION UUID HANDLING ---
      let current_location_id: string | null = null
      const locObj = form.currentLocationObj
      if (locObj && typeof locObj === "object" && "place_id" in locObj) {
        // Upsert and get UUID
        current_location_id = await upsertLocationAndGetId(
          locObj as GooglePlace
        )
      } else if (typeof form.current_location_id === "string") {
        // Already a UUID
        current_location_id = form.current_location_id
      } else {
        current_location_id = null
      }

      // Save full-time preferences
      await fullTime.updateFullTimePreferences({
        min_salary: form.fullTime.min_salary,
        max_salary: form.fullTime.max_salary,
        remote_ok: form.fullTime.remote_ok,
        start_date: form.fullTime.start_date,
      })

      // Save fractional preferences
      await fractional.updateFractionalPreferences({
        min_hourly_rate: form.fractional.min_hourly_rate,
        max_hourly_rate: form.fractional.max_hourly_rate,
        min_daily_rate: form.fractional.min_daily_rate,
        max_daily_rate: form.fractional.max_daily_rate,
        min_hours_per_week: form.fractional.min_hours_per_week,
        max_hours_per_week: form.fractional.max_hours_per_week,
        remote_ok: form.fractional.remote_ok,
        payment_type: form.fractional.payment_type,
        start_date: form.fractional.start_date,
      })

      // Save general work preferences
      await work.updateWorkPreferences({
        current_location_id: current_location_id || null,
        timezone_id: form.timezone_id,
      })

      // Save work eligibility (countries)
      const currentEligibility = (work.workEligibility || []).map(
        (e) => e.country_code
      )
      const { toAdd: eligibilityToAdd, toRemove: eligibilityToRemove } =
        diffIds(currentEligibility, form.work_eligibility || [])
      for (const code of eligibilityToAdd) {
        await work.addWorkEligibility(code)
      }
      for (const code of eligibilityToRemove) {
        await work.removeWorkEligibility(code)
      }

      // Save full-time locations
      const currentFTLocations = (fullTime.locationPreferences || []).map(
        (lp) => lp.location_id
      )
      const ftLocationIds = await Promise.all(
        form.fullTime.locations.map((loc) => upsertLocationAndGetId(loc))
      )
      const { toAdd: ftLocToAdd, toRemove: ftLocToRemove } = diffIds(
        currentFTLocations,
        ftLocationIds
      )
      for (const id of ftLocToAdd) {
        await fullTime.addLocationPreference(id)
      }
      for (const id of ftLocToRemove) {
        await fullTime.removeLocationPreference(id)
      }

      // Save fractional locations
      const currentFracLocations = (fractional.locationPreferences || []).map(
        (lp) => lp.location_id
      )
      const fracLocationIds = await Promise.all(
        form.fractional.locations.map((loc) => upsertLocationAndGetId(loc))
      )
      const { toAdd: fracLocToAdd, toRemove: fracLocToRemove } = diffIds(
        currentFracLocations,
        fracLocationIds
      )
      for (const id of fracLocToAdd) {
        await fractional.addLocationPreference(id)
      }
      for (const id of fracLocToRemove) {
        await fractional.removeLocationPreference(id)
      }

      // Save full-time industries
      const currentFTIndustries = (fullTime.industryPreferences || []).map(
        (ip) => ip.industry_id
      )
      const { toAdd: ftIndToAdd, toRemove: ftIndToRemove } = diffIds(
        currentFTIndustries,
        form.fullTime.industries || []
      )
      for (const id of ftIndToAdd) {
        await fullTime.addIndustryPreference(id)
      }
      for (const id of ftIndToRemove) {
        await fullTime.removeIndustryPreference(id)
      }

      // Save fractional industries
      const currentFracIndustries = (fractional.industryPreferences || []).map(
        (ip) => ip.industry_id
      )
      const { toAdd: fracIndToAdd, toRemove: fracIndToRemove } = diffIds(
        currentFracIndustries,
        form.fractional.industries || []
      )
      for (const id of fracIndToAdd) {
        await fractional.addIndustryPreference(id)
      }
      for (const id of fracIndToRemove) {
        await fractional.removeIndustryPreference(id)
      }

      setIsSaving(false)
      // Invalidate all relevant queries so UI is always up-to-date
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["work-preferences"] }),
        queryClient.invalidateQueries({ queryKey: ["work-eligibility"] }),
        queryClient.invalidateQueries({ queryKey: ["full-time-preferences"] }),
        queryClient.invalidateQueries({
          queryKey: ["full-time-location-preferences"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["full-time-industry-preferences"],
        }),
        queryClient.invalidateQueries({ queryKey: ["fractional-preferences"] }),
        queryClient.invalidateQueries({
          queryKey: ["fractional-location-preferences"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["fractional-industry-preferences"],
        }),
      ])
      return true
    } catch (err: any) {
      setError(err)
      setIsSaving(false)
      return false
    }
  }

  return { save, isSaving, error }
}
