
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import clsx from "clsx"

interface EngagementOptionsSelectorProps {
  selectedOptions: string[]
  onOptionsChange: (options: string[]) => void
  className?: string
}

const PREDEFINED_OPTIONS = [
  "Full-time",
  "Consultant", 
  "Fractional",
  "Interim",
  "Advisor",
  "Mentor",
  "Coach"
]

export const EngagementOptionsSelector: React.FC<EngagementOptionsSelectorProps> = ({
  selectedOptions,
  onOptionsChange,
  className = "",
}) => {
  const [showSelector, setShowSelector] = useState(false)

  const handleToggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onOptionsChange(selectedOptions.filter(item => item !== option))
    } else {
      onOptionsChange([...selectedOptions, option])
    }
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Engagement Options</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSelector(!showSelector)}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showSelector ? 'Hide Options' : 'Add Options'}
        </Button>
      </div>

      {/* Selected Options Display */}
      {selectedOptions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected engagement types:</p>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-[#449889]/10 text-[#449889] cursor-pointer hover:bg-[#449889]/20"
                onClick={() => handleToggleOption(option)}
              >
                {option} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Options Selector */}
      {showSelector && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">
            Select the engagement types you're interested in:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PREDEFINED_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleToggleOption(option)}
                type="button"
                className={clsx(
                  "p-3 rounded-lg border-2 text-left transition-all text-sm",
                  selectedOptions.includes(option)
                    ? "border-[#449889] bg-[#449889]/5 text-[#449889]"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                <span className="font-medium">{option}</span>
                {selectedOptions.includes(option) && (
                  <span className="ml-2 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
