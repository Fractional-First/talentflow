
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

interface CompensationSectionProps {
  compensationType: "salary" | "hourly" | "daily" | null
  setCompensationType: (type: "salary" | "hourly" | "daily") => void
  minCompensation: number
  maxCompensation: number
  setMinCompensation: (min: number) => void
  setMaxCompensation: (max: number) => void
  isFullTime?: boolean
}

const CompensationSection = ({
  compensationType,
  setCompensationType,
  minCompensation,
  maxCompensation,
  setMinCompensation,
  setMaxCompensation,
  isFullTime = false,
}: CompensationSectionProps) => {
  const [localMinValue, setLocalMinValue] = useState([minCompensation])
  const [localMaxValue, setLocalMaxValue] = useState([maxCompensation])

  useEffect(() => {
    setLocalMinValue([minCompensation])
  }, [minCompensation])

  useEffect(() => {
    setLocalMaxValue([maxCompensation])
  }, [maxCompensation])

  const handleMinChange = (value: number[]) => {
    setLocalMinValue(value)
    setMinCompensation(value[0])
  }

  const handleMaxChange = (value: number[]) => {
    setLocalMaxValue(value)
    setMaxCompensation(value[0])
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSliderConfig = () => {
    if (isFullTime) {
      return {
        min: 50000,
        max: 500000,
        step: 5000,
        label: "Annual Salary Range"
      }
    } else {
      if (compensationType === "hourly") {
        return {
          min: 25,
          max: 500,
          step: 5,
          label: "Hourly Rate Range"
        }
      } else {
        return {
          min: 200,
          max: 5000,
          step: 50,
          label: "Daily Rate Range"
        }
      }
    }
  }

  const config = getSliderConfig()

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Compensation Preferences</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set your preferred compensation range
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 space-y-6">
        {!isFullTime && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Payment Structure</Label>
            <RadioGroup
              value={compensationType || "hourly"}
              onValueChange={(value) => setCompensationType(value as "hourly" | "daily")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly" className="text-sm font-normal text-foreground">Hourly Rate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="text-sm font-normal text-foreground">Daily Rate</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Compensation Range */}
        <div className="space-y-6">
          <Label className="text-sm font-medium text-foreground">{config.label}</Label>
          
          {/* Minimum */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Minimum</Label>
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="font-medium text-primary text-sm">
                  {formatCurrency(localMinValue[0])}
                </span>
              </div>
            </div>
            <Slider
              value={localMinValue}
              onValueChange={handleMinChange}
              max={config.max}
              min={config.min}
              step={config.step}
              className="w-full"
            />
          </div>

          {/* Maximum */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-muted-foreground">Maximum</Label>
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="font-medium text-primary text-sm">
                  {formatCurrency(localMaxValue[0])}
                </span>
              </div>
            </div>
            <Slider
              value={localMaxValue}
              onValueChange={handleMaxChange}
              max={config.max}
              min={config.min}
              step={config.step}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompensationSection
