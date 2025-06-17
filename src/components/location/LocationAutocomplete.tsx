
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Loader2 } from 'lucide-react'
import { useGooglePlaces } from '@/hooks/useGooglePlaces'
import { cn } from '@/lib/utils'

interface LocationData {
  place_id: string
  name: string
  formatted_address: string
  city?: string
  state_province?: string
  country_code?: string
  latitude?: number
  longitude?: number
  place_types?: string[]
}

interface LocationAutocompleteProps {
  value: string
  onLocationSelect: (location: LocationData) => void
  placeholder?: string
  label?: string
  className?: string
}

export const LocationAutocomplete = ({
  value,
  onLocationSelect,
  placeholder = "Search for a location...",
  label,
  className
}: LocationAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { predictions, isLoading, searchPlaces, getPlaceDetails } = useGooglePlaces()

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlaces(inputValue)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [inputValue, searchPlaces])

  useEffect(() => {
    setIsOpen(predictions.length > 0 && inputValue.length >= 3)
  }, [predictions, inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setSelectedIndex(-1)
  }

  const handlePlaceSelect = async (placeId: string, description: string) => {
    setInputValue(description)
    setIsOpen(false)
    
    const placeDetails = await getPlaceDetails(placeId)
    if (placeDetails) {
      // Extract location data from place details
      const locationData: LocationData = {
        place_id: placeDetails.place_id,
        name: description,
        formatted_address: placeDetails.formatted_address,
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        place_types: placeDetails.types,
        // Extract city, state, country from address components
        city: placeDetails.address_components.find(c => 
          c.types.includes('locality') || c.types.includes('administrative_area_level_2')
        )?.long_name,
        state_province: placeDetails.address_components.find(c => 
          c.types.includes('administrative_area_level_1')
        )?.long_name,
        country_code: placeDetails.address_components.find(c => 
          c.types.includes('country')
        )?.short_name
      }
      
      onLocationSelect(locationData)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          const selected = predictions[selectedIndex]
          handlePlaceSelect(selected.place_id, selected.description)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label htmlFor="location-input" className="text-sm mb-2 block">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          id="location-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0",
                selectedIndex === index && "bg-muted"
              )}
              onClick={() => handlePlaceSelect(prediction.place_id, prediction.description)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
