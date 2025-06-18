import React from "react"
import LocationInputWithPopover from "./LocationAutocomplete"

export interface LocationData {
  place_id: string
  name: string
  formatted_address: string
  city?: string
  state_province?: string
  country_code?: string
  latitude?: number
  longitude?: number
  place_types?: string[]
}

interface LocationSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  placeholder = "Search for your current location...",
  label,
  className,
}) => {
  return (
    <div className={className}>
      {label && <label className="text-sm mb-2 block">{label}</label>}
      <LocationInputWithPopover
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}
