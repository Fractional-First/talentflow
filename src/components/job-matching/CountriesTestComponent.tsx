
import { useState } from 'react'
import { CountrySelector } from './CountrySelector'
import { useCountries, useRegions } from '@/hooks/useCountries'

export function CountriesTestComponent() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const { data: countries, isLoading: countriesLoading } = useCountries()
  const { data: regions, isLoading: regionsLoading } = useRegions()

  if (countriesLoading || regionsLoading) {
    return <div>Loading countries data...</div>
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div>
        <h3 className="text-lg font-medium mb-2">Countries Database Test</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Testing the countries table with {countries?.length} countries across {regions?.length} regions
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Work Eligibility Countries</h4>
        <CountrySelector
          selectedCountries={selectedCountries}
          onCountriesChange={setSelectedCountries}
          placeholder="Select countries where you can work..."
          maxSelections={20}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Total Countries:</strong> {countries?.length}
        </div>
        <div>
          <strong>Regions:</strong> {regions?.length}
        </div>
        <div>
          <strong>Selected:</strong> {selectedCountries.length}
        </div>
        <div>
          <strong>Sample Regions:</strong> {regions?.slice(0, 3).join(', ')}
        </div>
      </div>

      {selectedCountries.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Country Codes:</h4>
          <code className="text-xs bg-muted p-2 rounded block">
            {JSON.stringify(selectedCountries, null, 2)}
          </code>
        </div>
      )}
    </div>
  )
}
