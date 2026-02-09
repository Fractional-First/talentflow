import { useState } from "react"
import { Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCountries } from "@/queries/useCountries"
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

interface ContactDetailsSectionProps {
  contactEmail: string
  mobileCountryCode: string
  mobileNumber: string
  onContactEmailChange: (value: string) => void
  onMobileCountryCodeChange: (value: string) => void
  onMobileNumberChange: (value: string) => void
  emailError?: string
  phoneError?: string
  countryCodeError?: string
}

export const ContactDetailsSection = ({
  contactEmail,
  mobileCountryCode,
  mobileNumber,
  onContactEmailChange,
  onMobileCountryCodeChange,
  onMobileNumberChange,
  emailError,
  phoneError,
  countryCodeError,
}: ContactDetailsSectionProps) => {
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)
  const { data: countries = [], isLoading } = useCountries()

  // Build unique dial code options from countries
  const dialCodeOptions = countries
    .filter((c) => c.country_code)
    .map((c) => ({
      label: `${c.name} +${c.country_code}`,
      value: `+${c.country_code}`,
      alpha2: c.alpha2_code,
      name: c.name,
    }))

  const selectedLabel = dialCodeOptions.find((o) => o.value === mobileCountryCode)

  return (
    <div className="bg-muted/50 border border-border rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Provide the best email and mobile number for us to reach you about opportunities.
      </p>

      {/* Preferred Contact Email */}
      <div className="space-y-2">
        <Label htmlFor="contact-email">Preferred Contact Email</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          value={contactEmail}
          onChange={(e) => onContactEmailChange(e.target.value)}
          className={emailError ? "border-destructive" : ""}
        />
        {emailError && (
          <p className="text-sm text-destructive">{emailError}</p>
        )}
      </div>

      {/* Mobile Number with Country Code */}
      <div className="space-y-2">
        <Label>Mobile Number</Label>
        <div className="flex gap-2">
          {/* Country Code Selector */}
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

          {/* Phone Number Input */}
          <div className="flex-1">
            <Input
              type="tel"
              placeholder="Mobile number"
              value={mobileNumber}
              onChange={(e) => {
                // Only allow digits
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
