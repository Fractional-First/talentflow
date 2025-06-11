
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X, Palette, Users, Eye } from "lucide-react"
import clsx from "clsx"
import type { Superpower } from "@/types/profile"

interface SuperpowersSectionProps {
  superpowers: Superpower[]
  isEditing: boolean
  onEditToggle: () => void
  onSuperpowersChange: (superpowers: Superpower[]) => void
  className?: string
}

// Icon mapping for common superpower titles
const getSuperpowerIcon = (title: string) => {
  const lowercaseTitle = title.toLowerCase()
  if (lowercaseTitle.includes("design") || lowercaseTitle.includes("user-centered")) {
    return Palette
  }
  if (lowercaseTitle.includes("collaborative") || lowercaseTitle.includes("team")) {
    return Users
  }
  if (lowercaseTitle.includes("accessibility") || lowercaseTitle.includes("inclusive")) {
    return Eye
  }
  // Default icon
  return Palette
}

export const SuperpowersSection: React.FC<SuperpowersSectionProps> = ({
  superpowers,
  isEditing,
  onEditToggle,
  onSuperpowersChange,
  className = "",
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

  return (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-teal-600 text-white rounded-t-lg flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Superpowers</h3>
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
        <div className="space-y-4">
          {localSuperpowers && localSuperpowers.length > 0 ? (
            localSuperpowers.map((superpower, index) => {
              const IconComponent = getSuperpowerIcon(superpower.title)
              
              return (
                <div key={index} className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          value={superpower.title}
                          onChange={(e) =>
                            handleTitleChange(index, e.target.value)
                          }
                          className="font-medium"
                          placeholder="Superpower title"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSuperpower(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={superpower.description}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        className="text-sm"
                        placeholder="Superpower description"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#449889]/10 p-2 rounded-full mt-1 flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-[#449889]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {superpower.title}
                        </div>
                        <p className="text-sm text-gray-700">
                          {superpower.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-sm text-gray-700">
              Superpowers not available
            </div>
          )}

          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSuperpower}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Superpower
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
