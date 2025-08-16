
import { useState } from "react"
import { Check, ChevronsUpDown, MapPin, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useGooglePlaces } from "@/queries/useGooglePlaces"
import type { GooglePlace } from "./LocationAutocomplete"

interface LocationSelectProps {
  selectedLocations: GooglePlace[]
  onLocationsChange: (locations: GooglePlace[]) => void
  placeholder?: string
}

const LocationSelect = ({
  selectedLocations,
  onLocationsChange,
  placeholder = "Search for locations",
}: LocationSelectProps) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { placePredictions, isPlacePredictionsLoading } = useGooglePlaces()

  const handleLocationToggle = (location: GooglePlace) => {
    const isSelected = selectedLocations.some(
      (selected) => selected.place_id === location.place_id
    )

    if (isSelected) {
      onLocationsChange(
        selectedLocations.filter(
          (selected) => selected.place_id !== location.place_id
        )
      )
    } else {
      onLocationsChange([...selectedLocations, location])
    }
  }

  const removeLocation = (placeId: string) => {
    onLocationsChange(
      selectedLocations.filter((location) => location.place_id !== placeId)
    )
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-body-mobile md:text-body-desktop pr-2"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {selectedLocations.length > 0
                  ? `${selectedLocations.length} locations selected`
                  : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search locations..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isPlacePredictionsLoading ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : placePredictions.length === 0 && searchQuery ? (
                <CommandEmpty>No locations found.</CommandEmpty>
              ) : searchQuery === "" ? (
                <CommandEmpty>Start typing to search locations...</CommandEmpty>
              ) : (
                <CommandGroup>
                  {placePredictions.map((prediction) => {
                    const location: GooglePlace = {
                      place_id: prediction.place_id,
                      name: prediction.structured_formatting?.main_text || prediction.description,
                      formatted_address: prediction.description,
                      city: null,
                      state_province: null,
                      country_code: null,
                      latitude: null,
                      longitude: null,
                      place_types: prediction.types || []
                    }
                    
                    const isSelected = selectedLocations.some(
                      (selected) => selected.place_id === location.place_id
                    )
                    
                    return (
                      <CommandItem
                        key={location.place_id}
                        value={location.name}
                        onSelect={() => handleLocationToggle(location)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="truncate">{location.name}</span>
                          {location.formatted_address && (
                            <span className="text-xs text-muted-foreground truncate">
                              {location.formatted_address}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Locations Pills */}
      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLocations.map((location) => (
            <Badge
              key={location.place_id}
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full hover:bg-primary/15 max-w-full"
            >
              <span className="truncate">{location.name}</span>
              <button
                onClick={() => removeLocation(location.place_id)}
                className="ml-2 hover:text-primary/80 shrink-0"
                type="button"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationSelect
