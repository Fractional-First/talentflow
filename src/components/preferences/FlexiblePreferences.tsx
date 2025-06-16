import { Briefcase, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus } from "lucide-react"
import CompensationSection from "@/components/job-matching/CompensationSection"
import AvailabilitySection from "@/components/job-matching/AvailabilitySection"
import LocationSection from "@/components/job-matching/LocationSection"

interface FlexiblePreferencesProps {
  rateRange: number[]
  setRateRange: (range: number[]) => void
  paymentType: string
  setPaymentType: (type: string) => void
  startDate: string
  setStartDate: (date: string) => void
  timezone: string
  setTimezone: (zone: string) => void
  remotePreference: boolean
  setRemotePreference: (preference: boolean) => void
  industryPreferences: string[]
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>
  currentLocation: string
  setCurrentLocation: (location: string) => void
  locationPreferences: string[]
  setLocationPreferences: React.Dispatch<React.SetStateAction<string[]>>
  workEligibility: string[]
  setWorkEligibility: React.Dispatch<React.SetStateAction<string[]>>
}

export const FlexiblePreferences = ({
  rateRange,
  setRateRange,
  paymentType,
  setPaymentType,
  timezone,
  setTimezone,
  remotePreference,
  setRemotePreference,
  industryPreferences,
  setIndustryPreferences,
  currentLocation,
  setCurrentLocation,
  locationPreferences,
  setLocationPreferences,
  workEligibility,
  setWorkEligibility,
}: FlexiblePreferencesProps) => {
  return (
    <div className="bg-background/80 rounded-lg p-4 space-y-6">
      {/* Flexible position only shows hourly and daily rate options */}
      <CompensationSection
        paymentType={paymentType === "annual" ? "hourly" : paymentType}
        setPaymentType={setPaymentType}
        rateRange={rateRange}
        setRateRange={setRateRange}
        showOnly="hourly-daily"
      />

      <AvailabilitySection
        availabilityTypes={{ fullTime: false, fractional: true }}
        timezone={timezone}
        setTimezone={setTimezone}
      />

      {/* Location Section */}
      <div className="py-4">
        <LocationSection
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          workEligibility={workEligibility}
          setWorkEligibility={setWorkEligibility}
          locationPreferences={locationPreferences}
          setLocationPreferences={setLocationPreferences}
          remotePreference={remotePreference}
          setRemotePreference={setRemotePreference}
        />
      </div>

      {/* Industry Preferences */}
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Industry Preferences</h3>
        </div>
        <div className="flex flex-wrap gap-2 px-4">
          {industryPreferences.map((industry) => (
            <Badge key={industry} variant="outline">
              {industry}
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  setIndustryPreferences((prev) =>
                    prev.filter((i) => i !== industry)
                  )
                }
              >
                ×
              </button>
            </Badge>
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add Industry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Industry Preference</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter industry name"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      setIndustryPreferences((prev) => [
                        ...prev,
                        e.currentTarget.value.trim(),
                      ])
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement
                    if (input.value.trim()) {
                      setIndustryPreferences((prev) => [
                        ...prev,
                        input.value.trim(),
                      ])
                      input.value = ""
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
