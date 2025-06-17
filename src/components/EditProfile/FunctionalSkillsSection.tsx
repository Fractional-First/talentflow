
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X, Minus } from "lucide-react"
import clsx from "clsx"
import type { FunctionalSkill, FunctionalSkills } from "@/types/profile"

interface FunctionalSkillsSectionProps {
  functionalSkills: FunctionalSkills
  isEditing: boolean
  onEditToggle: () => void
  onFunctionalSkillsChange: (skills: FunctionalSkills) => void
  className?: string
}

export const FunctionalSkillsSection: React.FC<
  FunctionalSkillsSectionProps
> = ({
  functionalSkills,
  isEditing,
  onEditToggle,
  onFunctionalSkillsChange,
  className = "",
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

  return (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-teal-600 text-white rounded-t-lg flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Functional Skills</h3>
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
        {Object.keys(localSkills).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(localSkills).map(([category, skills]) => (
              <div key={category} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-center w-full">
                  {isEditing ? (
                    <Input
                      value={category}
                      onChange={(e) =>
                        handleCategoryTitleChange(category, e.target.value)
                      }
                      className="font-medium text-gray-900 w-1/2"
                      placeholder="Category name"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">
                      {category}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category ? null : category
                        )
                      }
                      className="h-8 px-2 text-xs"
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
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {expandedCategory === category && (
                  <div className="mt-3 space-y-3">
                    {skills.length > 0 ? (
                      <ul className="space-y-3">
                        {skills.map((skill, index) => (
                          <li key={index}>
                            {isEditing ? (
                              <div className="space-y-2">
                                <div className="flex gap-2 items-center">
                                  <Input
                                    value={skill.title}
                                    onChange={(e) =>
                                      handleSkillTitleChange(
                                        category,
                                        index,
                                        e.target.value
                                      )
                                    }
                                    className="font-medium"
                                    placeholder="Skill title"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveSkill(category, index)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
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
                                  className="text-sm"
                                  placeholder="Skill description"
                                  rows={3}
                                />
                              </div>
                            ) : (
                              <div className="flex items-start gap-2">
                                <span className="text-gray-600 mt-1 flex-shrink-0">•</span>
                                <div className="flex-1">
                                  <div className="text-sm text-gray-900 mb-1">
                                    <strong>{skill.title}</strong>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed pl-0">
                                    {skill.description}
                                  </p>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-700">
                        No skills in this category
                      </div>
                    )}
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSkill(category)}
                        className="w-full mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            Functional skills not available
          </div>
        )}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>
    </div>
  )
}
