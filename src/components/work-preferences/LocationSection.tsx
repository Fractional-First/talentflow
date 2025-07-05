
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useCountries } from "@/queries/useCountries"
import { MapPin, X, Globe, ChevronDown } from "lucide-react"
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LocationInputWithPopover, { GooglePlace } from "./LocationAutocomplete"
import { CombinedWorkPreferencesForm } from "@/hooks/useWorkPreferences"

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

  const handleAddPreferredLocation = (location: string | GooglePlace) => {
    if (typeof location === "string") return
    if (
      !locationPreferences.some((loc) => loc.place_id === location.place_id)
    ) {
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

  const handleEligibilityToggle = (countryCode: string) => {
    if (workEligibility.includes(countryCode)) {
      setWorkEligibility(workEligibility.filter((code) => code !== countryCode))
    } else {
      setWorkEligibility([...workEligibility, countryCode])
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
          <Label className="text-base font-medium">Current Location</Label>
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
              <Label className="text-base font-medium">Remote Work</Label>
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
          <Label className="text-base font-medium">Legal Work Eligibility</Label>
          <Select
            value=""
            onValueChange={handleEligibilityToggle}
          >
            <SelectTrigger className="w-full text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue placeholder="Search and select countries..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.alpha2_code} value={country.alpha2_code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Selected countries display */}
          {workEligibility.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {workEligibility.map((countryCode) => {
                const country = countries.find((c) => c.alpha2_code === countryCode)
                return (
                  <Badge
                    key={countryCode}
                    variant="secondary"
                    className="flex items-center gap-2 py-1 px-3"
                  >
                    <span className="text-sm">{country?.name}</span>
                    <button
                      onClick={() => handleEligibilityToggle(countryCode)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
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
          <Label className="text-base font-medium">Preferred Work Locations</Label>
          <LocationInputWithPopover
            value={null}
            onChange={handleAddPreferredLocation}
            placeholder="Add preferred work locations"
          />
          {locationPreferences.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {locationPreferences.map((location) => (
                <Badge
                  key={location.place_id}
                  variant="secondary"
                  className="flex items-center gap-2 py-1 px-3"
                >
                  <span className="text-sm">{location.name || location.formatted_address}</span>
                  <button
                    onClick={() =>
                      handleRemovePreferredLocation(location.place_id)
                    }
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
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
