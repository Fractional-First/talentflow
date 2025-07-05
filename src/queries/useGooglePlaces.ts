import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService"

export const useGooglePlaces = () => {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    debounce: 300,
  })


  return {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  }
}
