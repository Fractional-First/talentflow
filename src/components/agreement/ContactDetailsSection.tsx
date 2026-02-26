import { useState } from "react"
import { Mail, Phone, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCountries } from "@/queries/useCountries"
import { DIAL_CODES } from "@/utils/dialCodes"
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
import { Button } from "@/components/ui/button"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RegisteredAddress } from "@/components/agreement/ContractingTypeSection"

export interface PersonalDetailsData {
  fullLegalName: string
  identificationNumber: string
  residentialAddress: RegisteredAddress
}

interface ContactDetailsSectionProps {
  contactEmail: string
  mobileCountryCode: string
  mobileNumber: string
  personalDetails: PersonalDetailsData
  onContactEmailChange: (value: string) => void
  onMobileCountryCodeChange: (value: string) => void
  onMobileNumberChange: (value: string) => void
  onPersonalDetailsChange: (value: PersonalDetailsData) => void
  emailError?: string
  phoneError?: string
  countryCodeError?: string
  showErrors?: boolean
}

export const ContactDetailsSection = ({
  contactEmail,
  mobileCountryCode,
  mobileNumber,
  personalDetails,
  onContactEmailChange,
  onMobileCountryCodeChange,
  onMobileNumberChange,
  onPersonalDetailsChange,
  emailError,
  phoneError,
  countryCodeError,
  showErrors,
}: ContactDetailsSectionProps) => {
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)
  const { data: countries = [], isLoading } = useCountries()

  // Build dial code options using accurate ITU dial codes mapped by alpha2
  const dialCodeOptions = countries
    .filter((c) => DIAL_CODES[c.alpha2_code])
    .map((c) => ({
      label: `${c.name} ${DIAL_CODES[c.alpha2_code]}`,
      value: DIAL_CODES[c.alpha2_code],
      alpha2: c.alpha2_code,
      name: c.name,
    }))

  const selectedLabel = dialCodeOptions.find((o) => o.value === mobileCountryCode)

  const updateAddress = (field: keyof RegisteredAddress, value: string) => {
    onPersonalDetailsChange({
      ...personalDetails,
      residentialAddress: { ...personalDetails.residentialAddress, [field]: value },
    })
  }

  return (
    <div className={cn("bg-muted/50 border rounded-xl p-5 sm:p-6 space-y-5", showErrors ? "border-destructive" : "border-border")}>
      <div className="flex items-center gap-2 mb-1">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Provide your personal and contact information so we can reach you about opportunities.
      </p>

      {/* Full Legal Name */}
      <div className="space-y-2">
        <Label htmlFor="fullLegalName">Full Legal Name</Label>
        <Input
          id="fullLegalName"
          placeholder="Enter your full legal name"
          value={personalDetails.fullLegalName}
          onChange={(e) => onPersonalDetailsChange({ ...personalDetails, fullLegalName: e.target.value })}
          className={showErrors && !personalDetails.fullLegalName.trim() ? "border-destructive" : ""}
        />
        {showErrors && !personalDetails.fullLegalName.trim() && (
          <p className="text-sm text-destructive">Full legal name is required</p>
        )}
      </div>


      {/* Residential Address */}
      <div className="space-y-3">
        <Label>Residential Address</Label>
        <Input
          placeholder="Address Line 1"
          value={personalDetails.residentialAddress.addressLine1}
          onChange={(e) => updateAddress("addressLine1", e.target.value)}
          className={showErrors && !personalDetails.residentialAddress.addressLine1.trim() ? "border-destructive" : ""}
        />
        {showErrors && !personalDetails.residentialAddress.addressLine1.trim() && (
          <p className="text-sm text-destructive">Address line 1 is required</p>
        )}
        <Input
          placeholder="Address Line 2 (optional)"
          value={personalDetails.residentialAddress.addressLine2}
          onChange={(e) => updateAddress("addressLine2", e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Input
              placeholder="City"
              value={personalDetails.residentialAddress.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              className={showErrors && !personalDetails.residentialAddress.city.trim() ? "border-destructive" : ""}
            />
            {showErrors && !personalDetails.residentialAddress.city.trim() && (
              <p className="text-sm text-destructive">City is required</p>
            )}
          </div>
          <Input
            placeholder="State / Province (optional)"
            value={personalDetails.residentialAddress.stateProvince}
            onChange={(e) => updateAddress("stateProvince", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Input
              placeholder="Postal Code"
              value={personalDetails.residentialAddress.postalCode}
              onChange={(e) => updateAddress("postalCode", e.target.value)}
              className={showErrors && !personalDetails.residentialAddress.postalCode.trim() ? "border-destructive" : ""}
            />
            {showErrors && !personalDetails.residentialAddress.postalCode.trim() && (
              <p className="text-sm text-destructive">Postal code is required</p>
            )}
          </div>
          <div className="space-y-1">
            <select
              className={cn(
                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                showErrors && !personalDetails.residentialAddress.country ? "border-destructive" : "border-input"
              )}
              value={personalDetails.residentialAddress.country}
              onChange={(e) => updateAddress("country", e.target.value)}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            {showErrors && !personalDetails.residentialAddress.country && (
              <p className="text-sm text-destructive">Country is required</p>
            )}
          </div>
        </div>
      </div>

      {/* Preferred Contact Email */}
      <div className="space-y-2">
        <Label htmlFor="contact-email">Preferred Contact Email</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          value={contactEmail}
          onChange={(e) => onContactEmailChange(e.target.value)}
          className={(emailError || (showErrors && !contactEmail.trim())) ? "border-destructive" : ""}
        />
        {emailError && (
          <p className="text-sm text-destructive">{emailError}</p>
        )}
        {!emailError && showErrors && !contactEmail.trim() && (
          <p className="text-sm text-destructive">Email is required</p>
        )}
      </div>

      {/* Mobile Number with Country Code */}
      <div className="space-y-2">
        <Label>Mobile Number</Label>
        <div className="flex gap-2">
          <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countryCodeOpen}
                className={cn(
                  "w-[140px] justify-between text-sm shrink-0",
                  countryCodeError ? "border-destructive" : ""
                )}
                disabled={isLoading}
              >
                <span className="truncate">
                  {isLoading
                    ? "Loading..."
                    : selectedLabel
                      ? `${selectedLabel.alpha2} ${selectedLabel.value}`
                      : "Code"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {dialCodeOptions.map((option) => (
                      <CommandItem
                        key={`${option.alpha2}-${option.value}`}
                        value={option.label}
                        onSelect={() => {
                          onMobileCountryCodeChange(option.value)
                          setCountryCodeOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            mobileCountryCode === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="truncate">{option.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex-1">
            <Input
              type="tel"
              placeholder="Mobile number"
              value={mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "")
                onMobileNumberChange(val)
              }}
              className={phoneError ? "border-destructive" : ""}
            />
          </div>
        </div>
        {(countryCodeError || phoneError) && (
          <p className="text-sm text-destructive">
            {countryCodeError || phoneError}
          </p>
        )}
      </div>
    </div>
  )
}
