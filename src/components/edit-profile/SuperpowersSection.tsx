
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X } from "lucide-react"
import clsx from "clsx"
import type { Superpower } from "@/types/profile"
import { EditableSection } from "@/components/EditableSection"
import { getSuperpowerIcons } from "@/utils/superpowerIcons"

interface SuperpowersSectionProps {
  superpowers: Superpower[]
  isEditing: boolean
  onEditToggle: () => void
  onSuperpowersChange: (superpowers: Superpower[]) => void
  className?: string
  content?: string
  readOnly?: boolean
}

export const SuperpowersSection: React.FC<SuperpowersSectionProps> = ({
  superpowers,
  isEditing,
  onEditToggle,
  onSuperpowersChange,
  className = "",
  content = "Highlight your unique strengths and what sets you apart professionally",
  readOnly = false,
}) => {
  const [localSuperpowers, setLocalSuperpowers] = useState<Superpower[]>([])

  // Sync local state with props
  useEffect(() => {
    setLocalSuperpowers(superpowers || [])
  }, [superpowers])

  // Debounce superpowers changes
  useEffect(() => {
    if (!isEditing) return
    const timeout = setTimeout(() => {
      onSuperpowersChange(localSuperpowers)
    }, 300)
    return () => clearTimeout(timeout)
  }, [localSuperpowers, isEditing, onSuperpowersChange])

  const handleTitleChange = (index: number, value: string) => {
    setLocalSuperpowers((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], title: value }
      return updated
    })
  }

  const handleDescriptionChange = (index: number, value: string) => {
    setLocalSuperpowers((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], description: value }
      return updated
    })
  }

  const handleAddSuperpower = () => {
    setLocalSuperpowers((prev) => [...prev, { title: "", description: "" }])
  }

  const handleRemoveSuperpower = (index: number) => {
    setLocalSuperpowers((prev) => prev.filter((_, i) => i !== index))
  }

  // Get superpowers with their intelligent icon assignments
  const superpowersWithIcons = getSuperpowerIcons(localSuperpowers || [])

  const sectionContent = (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-[#449889] text-white rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-1 sm:pl-4 gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-center sm:text-left">Superpowers</h3>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="text-white hover:bg-white/20 self-center sm:self-auto min-h-[48px] min-w-[48px] p-3"
          >
            <Edit className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>
      <div className="p-4">
        <div className="space-y-6 sm:space-y-4">
          {superpowersWithIcons && superpowersWithIcons.length > 0 ? (
            superpowersWithIcons.map((superpower, index) => {
              const IconComponent = superpower.icon
              return (
                <div key={index} className="space-y-3 sm:space-y-2">
                  {isEditing ? (
                    <div className="space-y-3 sm:space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <Input
                          value={superpower.title}
                          onChange={(e) =>
                            handleTitleChange(index, e.target.value)
                          }
                          className="font-medium flex-1 min-h-[48px]"
                          placeholder="Superpower title"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSuperpower(index)}
                          className="text-red-500 hover:text-red-700 self-center sm:self-auto min-h-[48px] min-w-[48px] p-3"
                        >
                          <X className="h-5 w-5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={superpower.description}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        className="text-sm min-h-[100px]"
                        placeholder="Superpower description"
                        rows={4}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center self-center sm:mt-1">
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: "#449889" }}
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="font-medium text-gray-900 mb-2 text-base">
                          {superpower.title}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed break-words">
                          {superpower.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-sm text-gray-700 py-4 text-center sm:text-left">
              Superpowers not available
            </div>
          )}

          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSuperpower}
              className="w-full min-h-[48px] mt-4"
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
              Add Superpower
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <EditableSection isEditing={isEditing} content={content}>
      {sectionContent}
    </EditableSection>
  )
}
