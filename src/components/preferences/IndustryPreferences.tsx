
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
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      minHeight: '44px',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--border))',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '6px',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'white',
      fontSize: '14px',
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
      color: 'hsl(var(--muted-foreground))',
    }),
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground block">
          Select Industries
        </label>
        <p className="text-sm text-muted-foreground">
          Choose the industries where you'd like to find opportunities. You can select multiple options.
        </p>
      </div>
      
      <Select
        isMulti
        isLoading={isLoading}
        options={options}
        value={selectedOptions}
        onChange={(opts) => onChange(opts ? opts.map((opt) => opt.value) : [])}
        placeholder="Search and select industries..."
        classNamePrefix="react-select"
        styles={customStyles}
        className="w-full"
      />
      
      {selectedOptions.length > 0 && (
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>{selectedOptions.length}</strong> {selectedOptions.length === 1 ? 'industry' : 'industries'} selected
          </p>
        </div>
      )}
    </div>
  )
}

export default IndustryPreferences
