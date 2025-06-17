import { useState } from "react"
import { Check, ChevronsUpDown, Globe, X } from "lucide-react"
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
import { useCountries, useRegions, type Country } from "@/queries/useCountries"
import { cn } from "@/lib/utils"

interface CountrySelectorProps {
  selectedCountries: string[]
  onCountriesChange: (countries: string[]) => void
  placeholder?: string
  maxSelections?: number
  onClearAll?: () => void
}

export function CountrySelector({
  selectedCountries,
  onCountriesChange,
  placeholder = "Select countries...",
  maxSelections = 10,
  onClearAll,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filterByRegion, setFilterByRegion] = useState<string | null>(null)

  const { data: countries = [], isLoading } = useCountries()
  const { data: regions = [] } = useRegions()

  const filteredCountries = countries.filter((country) => {
    const matchesSearch =
      country.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      country.alpha2_code.toLowerCase().includes(searchValue.toLowerCase())
    const matchesRegion = !filterByRegion || country.region === filterByRegion
    return matchesSearch && matchesRegion
  })

  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(
        selectedCountries.filter((code) => code !== countryCode)
      )
    } else if (selectedCountries.length < maxSelections) {
      onCountriesChange([...selectedCountries, countryCode])
    }
  }

  const removeCountry = (countryCode: string) => {
    onCountriesChange(selectedCountries.filter((code) => code !== countryCode))
  }

  const getSelectedCountryNames = () => {
    return countries
      .filter((country) => selectedCountries.includes(country.alpha2_code))
      .map((country) => ({ code: country.alpha2_code, name: country.name }))
  }

  const selectedCountryData = getSelectedCountryNames()

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {selectedCountries.length === 0
                ? placeholder
                : `${selectedCountries.length} selected`}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput
              placeholder="Search countries..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No countries found.</CommandEmpty>

              {/* Region filters */}
              <CommandGroup heading="Filter by Region">
                <CommandItem onSelect={() => setFilterByRegion(null)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !filterByRegion ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Regions
                </CommandItem>
                {regions.map((region) => (
                  <CommandItem
                    key={region}
                    onSelect={() => setFilterByRegion(region)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filterByRegion === region ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {region}
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* Countries */}
              <CommandGroup heading="Countries">
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.alpha2_code}
                    onSelect={() => toggleCountry(country.alpha2_code)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountries.includes(country.alpha2_code)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-muted px-1 rounded">
                        {country.alpha2_code}
                      </span>
                      <span>{country.name}</span>
                      {country.region && (
                        <span className="text-xs text-muted-foreground">
                          • {country.region}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected countries display */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCountryData.map(({ code, name }) => (
            <Badge
              key={code}
              variant="outline"
              className="flex items-center gap-1"
            >
              <span>{name}</span>
              <button
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => removeCountry(code)}
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
