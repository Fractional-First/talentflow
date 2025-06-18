import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useCountries } from "@/queries/useCountries"
import { MapPin, X } from "lucide-react"
import React from "react"
import Select from "react-select"
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

  const getLocationName = (locationId: string) => {
    const location = locationPreferences.find(
      (loc) => loc.place_id === locationId
    )
    return location?.name || locationId
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Location Information</h3>
          <p className="text-sm text-muted-foreground">
            Your current location and work eligibility
          </p>
        </div>
      </div>
      <div className="space-y-4 px-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Current Location</h3>
          <LocationInputWithPopover
            value={currentLocationObj}
            onChange={setCurrentLocation}
            placeholder="Enter your current location"
          />
        </div>

        <div className="py-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-normal">Remote Work</Label>
              <p className="text-sm text-muted-foreground">
                Are you interested in remote work?
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="remote-toggle-step"
                className={`text-sm ${!remotePreference && "font-medium"}`}
              >
                No
              </Label>
              <Switch
                id="remote-toggle-step"
                checked={remotePreference}
                onCheckedChange={setRemotePreference}
              />
              <Label
                htmlFor="remote-toggle-step"
                className={`text-sm ${remotePreference && "font-medium"}`}
              >
                Yes
              </Label>
            </div>
          </div>
        </div>

        <div className="py-2">
          <Label className="text-sm mb-2 block">Legal Work Eligibility</Label>
          <div className="w-full">
            <Select
              isMulti
              isLoading={isLoading}
              options={countries.map((c) => ({
                value: c.alpha2_code,
                label: c.name,
              }))}
              value={countries
                .filter((c) => workEligibility.includes(c.alpha2_code))
                .map((c) => ({ value: c.alpha2_code, label: c.name }))}
              onChange={(opts) =>
                setWorkEligibility(opts.map((opt) => opt.value))
              }
              placeholder="Search and select countries..."
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Preferred Work Locations</h3>
          <LocationInputWithPopover
            value={null}
            onChange={handleAddPreferredLocation}
            placeholder="Add preferred work locations"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {locationPreferences.map((location) => (
              <Badge
                key={location.place_id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {location.name || location.formatted_address}
                <button
                  onClick={() =>
                    handleRemovePreferredLocation(location.place_id)
                  }
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationSection
