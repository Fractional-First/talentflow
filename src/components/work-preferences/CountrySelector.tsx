
import { useCountries } from "@/queries/useCountries"
import { useState } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
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

interface CountrySelectorProps {
  selectedCountries: string[]
  onCountriesChange: (countries: string[]) => void
  placeholder?: string
}

const CountrySelector = ({
  selectedCountries,
  onCountriesChange,
  placeholder = "Search and select countries",
}: CountrySelectorProps) => {
  const [open, setOpen] = useState(false)
  const { data: countries = [], isLoading } = useCountries()

  const selectedCountryNames = countries
    .filter((country) => selectedCountries.includes(country.alpha2_code))
    .map((country) => country.name)

  const handleCountryToggle = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(selectedCountries.filter((c) => c !== countryCode))
    } else {
      onCountriesChange([...selectedCountries, countryCode])
    }
  }

  const removeCountry = (countryCode: string) => {
    onCountriesChange(selectedCountries.filter((c) => c !== countryCode))
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between text-body-mobile md:text-body-desktop">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Loading countries...
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
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
            className="w-full justify-between text-body-mobile md:text-body-desktop"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {selectedCountries.length > 0
                ? `${selectedCountries.length} countries selected`
                : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.alpha2_code}
                    value={country.name}
                    onSelect={() => {
                      handleCountryToggle(country.alpha2_code)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountries.includes(country.alpha2_code)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span>{country.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Countries Pills */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCountryNames.map((countryName) => {
            const country = countries.find((c) => c.name === countryName)
            return (
              <Badge
                key={country?.alpha2_code}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full hover:bg-primary/15"
              >
                {countryName}
                <button
                  onClick={() => removeCountry(country?.alpha2_code || "")}
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
  )
}

export default CountrySelector
