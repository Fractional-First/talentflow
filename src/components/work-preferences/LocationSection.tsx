
import { Label } from "@/components/ui/label"
import LocationAutocomplete from "./LocationAutocomplete"
import LocationSelect from "./LocationSelect"
import { MapPin } from "lucide-react"

interface LocationSectionProps {
  currentLocationObj: any
  setCurrentLocation: (location: any) => void
  selectedLocationIds?: string[]
  onLocationChange: (locations: string[]) => void
  showWorkLocations?: boolean
  title?: string
  description?: string
}

const LocationSection = ({
  currentLocationObj,
  setCurrentLocation,
  selectedLocationIds = [],
  onLocationChange,
  showWorkLocations = false,
  title = "Location Preferences",
  description = "Set your location preferences",
}: LocationSectionProps) => {
  // Convert selectedLocationIds to GooglePlace objects for LocationSelect
  const selectedLocations = selectedLocationIds.map(id => ({
    place_id: id,
    name: id, // This will need to be properly resolved from location data
    formatted_address: id,
    city: null,
    state_province: null,
    country_code: null,
    latitude: null,
    longitude: null,
    place_types: []
  }))

  const handleLocationSelectChange = (locations: any[]) => {
    const locationIds = locations.map(loc => loc.place_id)
    onLocationChange(locationIds)
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 space-y-6">
        {/* Current Location */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground">Current Location</Label>
          <LocationAutocomplete
            selectedLocation={currentLocationObj}
            onLocationChange={setCurrentLocation}
            placeholder="Search for your current location..."
          />
        </div>

        {showWorkLocations && (
          <>
            <hr className="border-border" />
            
            {/* Work Locations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-foreground">Preferred Work Locations</Label>
              <LocationSelect
                selectedLocations={selectedLocations}
                onLocationsChange={handleLocationSelectChange}
                placeholder="Search and select work locations..."
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LocationSection
