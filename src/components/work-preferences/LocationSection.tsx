import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCountries } from "@/queries/useCountries"
import { Badge, MapPin } from "lucide-react"
import React from "react"
import Select from "react-select"
import LocationInputWithPopover from "./LocationAutocomplete"

interface LocationSectionProps {
  currentLocation: string
  setCurrentLocation: (location: string) => void
  workEligibility: string[]
  setWorkEligibility: React.Dispatch<React.SetStateAction<string[]>>
  locationPreferences: string[]
  setLocationPreferences: React.Dispatch<React.SetStateAction<string[]>>
  remotePreference: boolean
  setRemotePreference: (preference: boolean) => void
}

const LocationSection = ({
  currentLocation,
  setCurrentLocation,
  workEligibility,
  setWorkEligibility,
  locationPreferences: legacyLocationPreferences,
  setLocationPreferences: setLegacyLocationPreferences,
  remotePreference,
  setRemotePreference,
}: LocationSectionProps) => {
  const { data: countries = [], isLoading } = useCountries()

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
          <label className="text-sm mb-2 block">Current Location</label>
          <LocationInputWithPopover
            value={currentLocation}
            onChange={setCurrentLocation}
            placeholder={"Search for your current location..."}
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

        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Preferred Work Locations</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* {preferredWorkLocations.map((location) => (
              <Badge key={location.id} variant="outline">
                {location.name}
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemovePreferredLocation(location.name)}
                >
                  ×
                </button>
              </Badge>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationSection
