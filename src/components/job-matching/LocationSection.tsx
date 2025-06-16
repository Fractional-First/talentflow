import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCountries } from "@/hooks/useCountries"
import { MapPin } from "lucide-react"
import { useState } from "react"
import { CountrySelector } from "./CountrySelector"

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
  locationPreferences,
  setLocationPreferences,
  remotePreference,
  setRemotePreference,
}: LocationSectionProps) => {
  const [newLocation, setNewLocation] = useState("")
  const [openLocationDialog, setOpenLocationDialog] = useState(false)
  const { data: countries = [], isLoading } = useCountries()

  const clearWorkEligibility = () => {
    setWorkEligibility([])
  }

  const handleAddLocation = () => {
    if (
      newLocation.trim() &&
      !locationPreferences.includes(newLocation.trim())
    ) {
      setLocationPreferences([...locationPreferences, newLocation.trim()])
      setNewLocation("")
      setOpenLocationDialog(false)
    }
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
      <div className="space-y-2 px-4">
        <div>
          <Label htmlFor="current-location" className="text-sm">
            Current Location
          </Label>
          <Input
            id="current-location"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="py-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-normal">
                Remote Work
              </Label>
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
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Legal Work Eligibility</Label>
            {workEligibility.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearWorkEligibility}>
                Clear all
              </Button>
            )}
          </div>
          <div className="w-full max-w-xl">
            <CountrySelector
              selectedCountries={workEligibility}
              onCountriesChange={setWorkEligibility}
              placeholder="Select countries where you can legally work..."
              maxSelections={50}
            />
          </div>
        </div>
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Preferred Work Locations</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {locationPreferences.map((location) => (
              <Badge key={location} variant="outline">
                {location}
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setLocationPreferences((prev) =>
                      prev.filter((l) => l !== location)
                    )
                  }
                >
                  ×
                </button>
              </Badge>
            ))}
            <Dialog
              open={openLocationDialog}
              onOpenChange={setOpenLocationDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  + Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Preferred Work Location</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Enter city or region"
                    onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
                  />
                  <Button onClick={handleAddLocation}>Add</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationSection
