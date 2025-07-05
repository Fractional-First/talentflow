import React, { useState, useEffect } from "react"
import { useGooglePlaces } from "../../queries/useGooglePlaces"
import { Input } from "@/components/ui/input"

// Google Place type (simplified)
export type GooglePlace = {
  place_id: string
  name: string
  formatted_address?: string
  city?: string
  state_province?: string
  country_code?: string
  latitude?: number
  longitude?: number
  place_types?: string[]
}

interface LocationInputWithPopoverProps {
  value: string | GooglePlace
  onChange: (value: string | GooglePlace) => void
  placeholder?: string
}

// Helper functions to extract city, state, country code
function extractCity(components) {
  const cityComp = components?.find((c) => c.types.includes("locality"))
  return cityComp?.long_name || ""
}
function extractState(components) {
  const stateComp = components?.find((c) =>
    c.types.includes("administrative_area_level_1")
  )
  return stateComp?.short_name || ""
}
function extractCountryCode(components) {
  const countryComp = components?.find((c) => c.types.includes("country"))
  return countryComp?.short_name || ""
}

const LocationInputWithPopover: React.FC<LocationInputWithPopoverProps> = ({
  value,
  onChange,
  placeholder = "Enter location...",
}) => {
  const [showPopover, setShowPopover] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
    placesService,
  } = useGooglePlaces()

  // Update input value when value prop changes
  useEffect(() => {
    if (typeof value === "string") {
      setInputValue(value)
    } else if (value) {
      setInputValue(value.formatted_address || value.name || "")
    } else {
      setInputValue("")
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (newValue.trim()) {
      getPlacePredictions({ input: newValue })
      setShowPopover(true)
    } else {
      setShowPopover(false)
    }
  }

  const handlePredictionClick = (prediction: any) => {
    placesService?.getDetails(
      {
        placeId: prediction.place_id,
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "address_components",
          "geometry",
          "types",
        ],
      },
      (placeDetails) => {
        if (placeDetails) {
          const locationObj = {
            place_id: placeDetails.place_id,
            name: placeDetails.name || prediction.description,
            formatted_address: placeDetails.formatted_address,
            city: extractCity(placeDetails.address_components),
            state_province: extractState(placeDetails.address_components),
            country_code: extractCountryCode(placeDetails.address_components),
            latitude: placeDetails.geometry?.location?.lat(),
            longitude: placeDetails.geometry?.location?.lng(),
            place_types: placeDetails.types,
          }
          onChange(locationObj)
          setInputValue("") // Clear the input after selection
        }
        setShowPopover(false)
      }
    )
  }

  return (
    <div style={{ position: "relative" }}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {showPopover &&
        (placePredictions.length > 0 || isPlacePredictionsLoading) && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            {isPlacePredictionsLoading ? (
              <div style={{ padding: "8px" }}>Loading...</div>
            ) : (
              placePredictions.map((prediction) => (
                <div
                  key={prediction.place_id}
                  onClick={() => handlePredictionClick(prediction)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {prediction.description}
                </div>
              ))
            )}
          </div>
        )}
    </div>
  )
}

export default LocationInputWithPopover
