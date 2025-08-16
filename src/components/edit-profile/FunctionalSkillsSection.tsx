
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X, Minus } from "lucide-react"
import clsx from "clsx"
import type { FunctionalSkill, FunctionalSkills } from "@/types/profile"
import { EditableSection } from "@/components/EditableSection"

interface FunctionalSkillsSectionProps {
  functionalSkills: FunctionalSkills
  isEditing: boolean
  onEditToggle: () => void
  onFunctionalSkillsChange: (skills: FunctionalSkills) => void
  className?: string
  content?: string
  readOnly?: boolean
}

export const FunctionalSkillsSection: React.FC<
  FunctionalSkillsSectionProps
> = ({
  functionalSkills,
  isEditing,
  onEditToggle,
  onFunctionalSkillsChange,
  className = "",
  content = "Organize your skills by category and provide details about your expertise level",
  readOnly = false,
}) => {
  const [localSkills, setLocalSkills] = useState<FunctionalSkills>({})
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Sync local state with props
  useEffect(() => {
    setLocalSkills(functionalSkills || {})
  }, [functionalSkills])

  // Debounce changes
  useEffect(() => {
    if (!isEditing) return
    const timeout = setTimeout(() => {
      onFunctionalSkillsChange(localSkills)
    }, 300)
    return () => clearTimeout(timeout)
  }, [localSkills, isEditing, onFunctionalSkillsChange])

  const handleCategoryTitleChange = (
    oldCategory: string,
    newCategory: string
  ) => {
    setLocalSkills((prev) => {
      const updated = { ...prev }
      const skills = updated[oldCategory]
      delete updated[oldCategory]
      updated[newCategory] = skills
      return updated
    })
    if (expandedCategory === oldCategory) setExpandedCategory(newCategory)
  }

  const handleSkillTitleChange = (
    category: string,
    index: number,
    value: string
  ) => {
    setLocalSkills((prev) => {
      const updated = { ...prev }
      updated[category] = [...updated[category]]
      updated[category][index] = { ...updated[category][index], title: value }
      return updated
    })
  }

  const handleSkillDescriptionChange = (
    category: string,
    index: number,
    value: string
  ) => {
    setLocalSkills((prev) => {
      const updated = { ...prev }
      updated[category] = [...updated[category]]
      updated[category][index] = {
        ...updated[category][index],
        description: value,
      }
      return updated
    })
  }

  const handleAddCategory = () => {
    let newCategory = "New Category"
    let i = 1
    while (localSkills[newCategory]) {
      newCategory = `New Category ${i++}`
    }
    setLocalSkills((prev) => ({ ...prev, [newCategory]: [] }))
    setExpandedCategory(newCategory)
  }

  const handleRemoveCategory = (category: string) => {
    setLocalSkills((prev) => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })
    if (expandedCategory === category) setExpandedCategory(null)
  }

  const handleAddSkill = (category: string) => {
    setLocalSkills((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), { title: "", description: "" }],
    }))
  }

  const handleRemoveSkill = (category: string, index: number) => {
    setLocalSkills((prev) => {
      const updated = { ...prev }
      updated[category] = updated[category].filter((_, i) => i !== index)
      return updated
    })
  }

  const sectionContent = (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-[#449889] text-white rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-1 sm:pl-4 gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-center sm:text-left">Functional Skills</h3>
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
        {Object.keys(localSkills).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(localSkills).map(([category, skills]) => (
              <div key={category} className="border-b border-gray-200 pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 sm:gap-0">
                  {isEditing ? (
                    <Input
                      value={category}
                      onChange={(e) =>
                        handleCategoryTitleChange(category, e.target.value)
                      }
                      className="font-medium text-gray-900 flex-1 min-h-[48px]"
                      placeholder="Category name"
                    />
                  ) : (
                    <span className="font-medium text-gray-900 text-center sm:text-left">
                      {category}
                    </span>
                  )}
                  <div className="flex items-center gap-1 justify-center sm:justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category ? null : category
                        )
                      }
                      className="h-10 px-3 text-xs min-h-[48px] min-w-[48px]"
                    >
                      {expandedCategory === category ? (
                        <Minus className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCategory(category)}
                        className="text-red-500 hover:text-red-700 min-h-[48px] min-w-[48px] p-3"
                      >
                        <X className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {expandedCategory === category && (
                  <div className="mt-4 space-y-4 sm:space-y-3">
                    {skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <div key={index} className="space-y-3 sm:space-y-2">
                          {isEditing ? (
                            <div className="space-y-3 sm:space-y-2">
                              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                                <Input
                                  value={skill.title}
                                  onChange={(e) =>
                                    handleSkillTitleChange(
                                      category,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  className="font-medium flex-1 min-h-[48px]"
                                  placeholder="Skill title"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveSkill(category, index)
                                  }
                                  className="text-red-500 hover:text-red-700 self-center sm:self-auto min-h-[48px] min-w-[48px] p-3"
                                >
                                  <X className="h-5 w-5 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                              <Textarea
                                value={skill.description}
                                onChange={(e) =>
                                  handleSkillDescriptionChange(
                                    category,
                                    index,
                                    e.target.value
                                  )
                                }
                                className="text-sm min-h-[100px]"
                                placeholder="Skill description"
                                rows={4}
                              />
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-700 mt-0.5 text-base">
                                •
                              </span>
                              <div className="flex-1">
                                <div className="text-sm text-gray-700 leading-relaxed break-words">
                                  <span className="font-medium">
                                    {skill.title}
                                  </span>
                                  {skill.description && (
                                    <span className="ml-1">
                                      - {skill.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-700 py-2 text-center sm:text-left">
                        No skills in this category
                      </div>
                    )}
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSkill(category)}
                        className="w-full mt-3 min-h-[48px]"
                      >
                        <Plus className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                        Add Skill
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-700 py-4 text-center sm:text-left">
            Functional skills not available
          </div>
        )}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            className="w-full mt-4 min-h-[48px]"
          >
            <Plus className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <EditableSection isEditing={isEditing} content={content}>
      {sectionContent}
    </EditableSection>
  )
}
