
import { useState, useEffect } from "react"
import { MapPin, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useGooglePlaces } from "@/queries/useGooglePlaces"
import { supabase } from "@/integrations/supabase/client"

export interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string | null
  city: string | null
  state_province: string | null
  country_code: string | null
  latitude: number | null
  longitude: number | null
  place_types: string[]
}

interface LocationInputWithPopoverProps {
  value: GooglePlace | null
  onChange: (location: GooglePlace | string | null) => void
  placeholder?: string
  showRemoteOption?: boolean
}

const LocationInputWithPopover = ({
  value,
  onChange,
  placeholder = "Search for a location",
  showRemoteOption = false,
}: LocationInputWithPopoverProps) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { placePredictions, isPlacePredictionsLoading } = useGooglePlaces()

  const handleLocationSelect = async (prediction: any) => {
    try {
      // First, save the location to our database
      const { data: locationData, error } = await supabase
        .from("locations")
        .insert({
          place_id: prediction.place_id,
          name: prediction.structured_formatting?.main_text || prediction.description,
          formatted_address: prediction.description,
          place_types: prediction.types || [],
        })
        .select()
        .single()

      if (error && error.code !== "23505") {
        // 23505 is unique constraint violation, which is fine - location already exists
        console.error("Error saving location:", error)
        return
      }

      // If it's a new location, use the returned data; otherwise fetch existing
      let finalLocationData = locationData
      if (error?.code === "23505") {
        const { data: existingLocation } = await supabase
          .from("locations")
          .select("*")
          .eq("place_id", prediction.place_id)
          .single()
        finalLocationData = existingLocation
      }

      const location: GooglePlace = {
        place_id: prediction.place_id,
        name: prediction.structured_formatting?.main_text || prediction.description,
        formatted_address: prediction.description,
        city: finalLocationData?.city || null,
        state_province: finalLocationData?.state_province || null,
        country_code: finalLocationData?.country_code || null,
        latitude: finalLocationData?.latitude || null,
        longitude: finalLocationData?.longitude || null,
        place_types: prediction.types || [],
      }

      onChange(location)
      setOpen(false)
      setSearchQuery("")
    } catch (error) {
      console.error("Error handling location selection:", error)
    }
  }

  const handleRemoteSelect = () => {
    onChange("Remote")
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start text-left font-normal"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {value?.name || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-60 overflow-y-auto">
            {/* Remote option */}
            {showRemoteOption && (
              <div
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted rounded text-sm"
                onClick={handleRemoteSelect}
              >
                <Wifi className="h-4 w-4 text-primary" />
                <span>Remote</span>
              </div>
            )}
            
            {/* Location predictions */}
            {isPlacePredictionsLoading ? (
              <div className="p-2 text-sm text-muted-foreground">Searching...</div>
            ) : placePredictions.length === 0 && searchQuery ? (
              <div className="p-2 text-sm text-muted-foreground">No locations found.</div>
            ) : searchQuery === "" && !showRemoteOption ? (
              <div className="p-2 text-sm text-muted-foreground">Start typing to search locations...</div>
            ) : (
              placePredictions.map((prediction) => (
                <div
                  key={prediction.place_id}
                  className="flex items-start gap-2 p-2 cursor-pointer hover:bg-muted rounded text-sm"
                  onClick={() => handleLocationSelect(prediction)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">
                      {prediction.structured_formatting?.main_text || prediction.description}
                    </div>
                    {prediction.structured_formatting?.secondary_text && (
                      <div className="text-xs text-muted-foreground">
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default LocationInputWithPopover
