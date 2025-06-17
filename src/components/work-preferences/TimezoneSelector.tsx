import { useTimezones } from "@/queries/useTimezones"
import Select from "react-select"

interface TimezoneSelectorProps {
  selectedTimezone: string
  onTimezoneChange: (timezone: string) => void
  placeholder?: string
}

const TimezoneSelector = ({
  selectedTimezone,
  onTimezoneChange,
  placeholder = "Select timezone...",
}: TimezoneSelectorProps) => {
  const { data: timezones = [], isLoading } = useTimezones()

  const options = timezones.map((tz) => ({ value: tz.value, label: tz.text }))
  const selectedOption =
    options.find((opt) => opt.value === selectedTimezone) || null

  return (
    <div>
      <Select
        isLoading={isLoading}
        options={options}
        value={selectedOption}
        onChange={(opt) => onTimezoneChange(opt ? opt.value : "")}
        placeholder={placeholder}
        classNamePrefix="react-select"
        isClearable
      />
    </div>
  )
}

export default TimezoneSelector
