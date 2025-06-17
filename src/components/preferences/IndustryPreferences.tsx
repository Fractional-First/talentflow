
import { useIndustries } from "@/hooks/useIndustries"
import { Briefcase } from "lucide-react"
import React from "react"
import Select from "react-select"

interface IndustryPreferencesSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
}

const IndustryPreferences: React.FC<IndustryPreferencesSelectProps> = ({
  value,
  onChange,
}) => {
  const { data: industries = [], isLoading } = useIndustries()

  const options = industries.map((ind) => ({ value: ind.id, label: ind.name }))
  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#449889' : '#E6E6E6',
      borderRadius: '8px',
      padding: '8px 12px',
      minHeight: '48px',
      fontSize: '16px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(68, 152, 137, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#449889',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#449889',
      borderRadius: '6px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'white',
      fontSize: '14px',
      padding: '2px 8px',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#6B7280',
      fontSize: '16px',
    }),
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Select Industries
        </label>
        <Select
          isMulti
          isLoading={isLoading}
          options={options}
          value={selectedOptions}
          onChange={(opts) => onChange(opts ? opts.map((opt) => opt.value) : [])}
          placeholder="Search and select industries you're interested in..."
          classNamePrefix="react-select"
          styles={customStyles}
          className="text-base"
        />
        {value.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {value.length} {value.length === 1 ? 'industry' : 'industries'} selected
          </p>
        )}
      </div>
    </div>
  )
}

export default IndustryPreferences
