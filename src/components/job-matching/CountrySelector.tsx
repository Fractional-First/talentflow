
import { useState } from 'react'
import { Check, ChevronsUpDown, Globe, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useCountries, useRegions, type Country } from '@/hooks/useCountries'
import { cn } from '@/lib/utils'

interface CountrySelectorProps {
  selectedCountries: string[]
  onCountriesChange: (countries: string[]) => void
  placeholder?: string
  maxSelections?: number
}

export function CountrySelector({
  selectedCountries,
  onCountriesChange,
  placeholder = "Select countries...",
  maxSelections = 10
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [filterByRegion, setFilterByRegion] = useState<string | null>(null)
  
  const { data: countries = [], isLoading } = useCountries()
  const { data: regions = [] } = useRegions()

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         country.alpha2_code.toLowerCase().includes(searchValue.toLowerCase())
    const matchesRegion = !filterByRegion || country.region === filterByRegion
    return matchesSearch && matchesRegion
  })

  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(selectedCountries.filter(code => code !== countryCode))
    } else if (selectedCountries.length < maxSelections) {
      onCountriesChange([...selectedCountries, countryCode])
    }
  }

  const removeCountry = (countryCode: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onCountriesChange(selectedCountries.filter(code => code !== countryCode))
  }

  const getSelectedCountryNames = () => {
    return countries
      .filter(country => selectedCountries.includes(country.alpha2_code))
      .map(country => ({ code: country.alpha2_code, name: country.name }))
  }

  const clearSelection = () => {
    onCountriesChange([])
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
            className="w-full justify-between min-h-10 h-auto px-3 py-2"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              <Globe className="h-4 w-4 flex-shrink-0" />
              {selectedCountries.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
                  {selectedCountryData.map(({ code, name }) => (
                    <Badge 
                      key={code} 
                      variant="secondary" 
                      className="text-xs flex items-center gap-1 max-w-32"
                    >
                      <span className="truncate">{name}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={(e) => removeCountry(code, e)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
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
                  <Check className={cn("mr-2 h-4 w-4", !filterByRegion ? "opacity-100" : "opacity-0")} />
                  All Regions
                </CommandItem>
                {regions.map(region => (
                  <CommandItem key={region} onSelect={() => setFilterByRegion(region)}>
                    <Check className={cn("mr-2 h-4 w-4", filterByRegion === region ? "opacity-100" : "opacity-0")} />
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
                        selectedCountries.includes(country.alpha2_code) ? "opacity-100" : "opacity-0"
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

      {/* Selection summary and clear all */}
      {selectedCountries.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Selected ({selectedCountries.length}/{maxSelections})
          </span>
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
