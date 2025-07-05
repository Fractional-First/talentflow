
import { useState, useEffect } from "react"
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService"
import type { GooglePlace } from "@/components/work-preferences/LocationAutocomplete"

export const useGooglePlaces = (searchQuery: string) => {
  const [searchResults, setSearchResults] = useState<GooglePlace[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    debounce: 300,
  })

  useEffect(() => {
    if (searchQuery && searchQuery.length > 2) {
      setIsLoading(true)
      getPlacePredictions({ input: searchQuery })
    } else {
      setSearchResults([])
      setIsLoading(false)
    }
  }, [searchQuery, getPlacePredictions])

  useEffect(() => {
    if (placePredictions && placePredictions.length > 0) {
      const results: GooglePlace[] = placePredictions.map((prediction) => ({
        place_id: prediction.place_id,
        name: prediction.structured_formatting.main_text,
        formatted_address: prediction.description,
        city: null,
        state_province: null,
        country_code: null,
        latitude: null,
        longitude: null,
        place_types: prediction.types,
      }))
      setSearchResults(results)
      setIsLoading(false)
    }
  }, [placePredictions])

  return {
    data: searchResults,
    isLoading: isLoading || isPlacePredictionsLoading,
    placesService,
    getPlacePredictions,
  }
}
