
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCountries } from "@/queries/useCountries"
import { MapPin, Globe, Check, ChevronsUpDown } from "lucide-react"
import React, { useState } from "react"
import LocationInputWithPopover, { GooglePlace } from "./LocationAutocomplete"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"
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
import { cn } from "@/lib/utils"
import { useGooglePlaces } from "@/queries/useGooglePlaces"

interface LocationSectionProps {
  form: CombinedWorkPreferencesForm
  setForm: (
    updater: (prev: CombinedWorkPreferencesForm) => CombinedWorkPreferencesForm
  ) => void
  currentLocationObj: any | null
  setCurrentLocation: (location: string | { place_id: string } | null) => void
  type: "fullTime" | "fractional"
  workEligibility: string[]
  setWorkEligibility: (eligibility: string[]) => void
  remotePreference: boolean
  setRemotePreference: (preference: boolean) => void
}

export function LocationSection({
  form,
  setForm,
  currentLocationObj,
  setCurrentLocation,
  type,
  workEligibility,
  setWorkEligibility,
  remotePreference,
  setRemotePreference,
}: LocationSectionProps) {
  const locationPreferences =
    type === "fullTime" ? form.fullTime.locations : form.fractional.locations

  const { data: countries = [], isLoading } = useCountries()
  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearchValue, setCountrySearchValue] = useState("")
  const [locationOpen, setLocationOpen] = useState(false)
  const [locationSearchValue, setLocationSearchValue] = useState("")
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGooglePlaces()

  // Filter countries based on search input
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchValue.toLowerCase())
  )

  // Handle location search
  React.useEffect(() => {
    if (locationSearchValue.trim() && locationSearchValue.toLowerCase() !== "remote") {
      getPlacePredictions({ input: locationSearchValue })
    }
  }, [locationSearchValue, getPlacePredictions])

  const handleAddPreferredLocation = (location: string | GooglePlace) => {
    if (typeof location === "string") {
      // Handle "Remote" selection
      if (location === "Remote") {
        const remoteLocation: GooglePlace = {
          place_id: "remote",
          name: "Remote",
          formatted_address: "Remote Work",
          city: null,
          state_province: null,
          country_code: null,
          latitude: null,
          longitude: null,
          place_types: ["remote"]
        }
        if (!locationPreferences.some((loc) => loc.place_id === "remote")) {
          setForm((prev) => ({
            ...prev,
            [type]: {
              ...prev[type],
              locations: [...locationPreferences, remoteLocation],
            },
          }))
        }
      }
      return
    }
    
    if (!locationPreferences.some((loc) => loc.place_id === location.place_id)) {
      setForm((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          locations: [...locationPreferences, location],
        },
      }))
    }
  }

  const handleRemovePreferredLocation = (placeId: string) => {
    setForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        locations: locationPreferences.filter(
          (loc) => loc.place_id !== placeId
        ),
      },
    }))
  }

  const handleCountryToggle = (country: any) => {
    const isSelected = workEligibility.includes(country.alpha2_code)
    if (isSelected) {
      setWorkEligibility(workEligibility.filter((code) => code !== country.alpha2_code))
    } else {
      setWorkEligibility([...workEligibility, country.alpha2_code])
    }
  }

  const handleLocationToggle = (location: GooglePlace | string) => {
    if (typeof location === "string") {
      handleAddPreferredLocation(location)
    } else {
      const isSelected = locationPreferences.some((loc) => loc.place_id === location.place_id)
      if (isSelected) {
        handleRemovePreferredLocation(location.place_id)
      } else {
        handleAddPreferredLocation(location)
      }
    }
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Location & Remote Work</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set your location preferences and remote work availability
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 space-y-6">
        {/* Current Location */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Current Location</Label>
          <LocationInputWithPopover
            value={currentLocationObj}
            onChange={setCurrentLocation}
            placeholder="Enter your current location"
          />
        </div>

        <hr className="border-border" />

        {/* Remote Work Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Remote Work</Label>
              <p className="text-sm text-muted-foreground">
                Are you interested in remote work opportunities?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="remote-toggle"
                className={`text-sm transition-colors ${!remotePreference ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                No
              </Label>
              <Switch
                id="remote-toggle"
                checked={remotePreference}
                onCheckedChange={setRemotePreference}
              />
              <Label
                htmlFor="remote-toggle"
                className={`text-sm transition-colors ${remotePreference ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                Yes
              </Label>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Work Eligibility */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Legal Work Eligibility</Label>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countryOpen}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {workEligibility.length > 0
                    ? `${workEligibility.length} countries selected`
                    : "Select countries where you can legally work"}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search countries..."
                  value={countrySearchValue}
                  onValueChange={setCountrySearchValue}
                />
                <CommandList>
                  {isLoading ? (
                    <CommandEmpty>Loading countries...</CommandEmpty>
                  ) : filteredCountries.length === 0 ? (
                    <CommandEmpty>No countries found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {filteredCountries.map((country) => {
                        const isSelected = workEligibility.includes(country.alpha2_code)
                        return (
                          <CommandItem
                            key={country.alpha2_code}
                            value={country.name}
                            onSelect={() => handleCountryToggle(country)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.name}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Selected countries display */}
          {workEligibility.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {workEligibility.map((countryCode) => {
                const country = countries.find((c) => c.alpha2_code === countryCode)
                return (
                  <Badge
                    key={countryCode}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full hover:bg-primary/15"
                  >
                    {country?.name}
                    <button
                      onClick={() => setWorkEligibility(workEligibility.filter((code) => code !== countryCode))}
                      className="ml-2 hover:text-primary/80"
                      type="button"
                    >
                      ×
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        <hr className="border-border" />

        {/* Preferred Locations */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Preferred Work Locations</Label>
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationOpen}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {locationPreferences.length > 0
                    ? `${locationPreferences.length} locations selected`
                    : "Select preferred work locations"}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search locations..."
                  value={locationSearchValue}
                  onValueChange={setLocationSearchValue}
                />
                <CommandList>
                  {isPlacePredictionsLoading ? (
                    <CommandEmpty>Searching...</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {/* Remote option */}
                      {locationSearchValue.toLowerCase().includes("remote") || locationSearchValue === "" ? (
                        <CommandItem
                          key="remote"
                          value="Remote"
                          onSelect={() => handleLocationToggle("Remote")}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              locationPreferences.some((loc) => loc.place_id === "remote") ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Remote
                        </CommandItem>
                      ) : null}
                      
                      {/* Google Places results */}
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
                        
                        const isSelected = locationPreferences.some((loc) => loc.place_id === location.place_id)
                        
                        return (
                          <CommandItem
                            key={location.place_id}
                            value={location.name}
                            onSelect={() => handleLocationToggle(location)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{location.name}</span>
                              {location.formatted_address && (
                                <span className="text-xs text-muted-foreground">
                                  {location.formatted_address}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        )
                      })}
                      
                      {placePredictions.length === 0 && locationSearchValue && !locationSearchValue.toLowerCase().includes("remote") && (
                        <CommandEmpty>No locations found.</CommandEmpty>
                      )}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Selected locations display */}
          {locationPreferences.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {locationPreferences.map((location) => (
                <Badge
                  key={location.place_id}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full hover:bg-primary/15"
                >
                  {location.name || location.formatted_address}
                  <button
                    onClick={() => handleRemovePreferredLocation(location.place_id)}
                    className="ml-2 hover:text-primary/80"
                    type="button"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocationSection
