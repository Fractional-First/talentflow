
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

interface EngagementOptionsSectionProps {
  engagementOptions: string[]
  isEditing: boolean
  onEditToggle: () => void
  onEngagementOptionsChange: (options: string[]) => void
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

export const EngagementOptionsSection: React.FC<EngagementOptionsSectionProps> = ({
  engagementOptions,
  isEditing,
  onEditToggle,
  onEngagementOptionsChange,
  className = "",
}) => {
  const [localOptions, setLocalOptions] = useState<string[]>([])

  // Sync local state with props and filter to predefined options
  useEffect(() => {
    const filteredOptions = (engagementOptions || []).filter(option => 
      PREDEFINED_OPTIONS.includes(option)
    )
    setLocalOptions(filteredOptions)
  }, [engagementOptions])

  // Debounce changes
  useEffect(() => {
    if (!isEditing) return
    const timeout = setTimeout(() => {
      onEngagementOptionsChange(localOptions)
    }, 300)
    return () => clearTimeout(timeout)
  }, [localOptions, isEditing, onEngagementOptionsChange])

  const handleToggleOption = (option: string) => {
    setLocalOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option)
      } else {
        return [...prev, option]
      }
    })
  }

  return (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-[#449889] text-white rounded-t-lg flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Engagement Options</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditToggle}
          className="text-white hover:bg-white/20"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              Select the engagement types you're interested in:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PREDEFINED_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleToggleOption(option)}
                  className={clsx(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    localOptions.includes(option)
                      ? "border-[#449889] bg-[#449889]/5 text-[#449889]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="font-medium">{option}</span>
                  {localOptions.includes(option) && (
                    <span className="ml-2 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {localOptions && localOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {localOptions.map((option, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#449889]/10 text-[#449889]">
                    {option}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-700">
                No engagement options selected
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
