import React, { useState, useEffect } from "react"
import { useGooglePlaces } from "../../hooks/useGooglePlaces"
import { Input } from "@/components/ui/input"

interface LocationInputWithPopoverProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const LocationInputWithPopover: React.FC<LocationInputWithPopoverProps> = ({
  value,
  onChange,
  placeholder = "Enter location...",
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [showPopover, setShowPopover] = useState(false)
  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
    placesService,
  } = useGooglePlaces()

  useEffect(() => {
    setInputValue(value)
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
        fields: ["formatted_address"],
      },
      (placeDetails) => {
        if (placeDetails?.formatted_address) {
          onChange(placeDetails.formatted_address)
          setInputValue(placeDetails.formatted_address)
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
