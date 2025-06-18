import { useIndustries } from "@/queries/useIndustries"
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

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Industry Preferences</h3>
      </div>
      <Select
        isMulti
        isLoading={isLoading}
        options={options}
        value={selectedOptions}
        onChange={(opts) => onChange(opts.map((opt) => opt.value))}
        placeholder="Search and select industries..."
        classNamePrefix="react-select"
      />
    </div>
  )
}

export default IndustryPreferences
