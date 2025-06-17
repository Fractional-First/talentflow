import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X } from "lucide-react"
import clsx from "clsx"

interface EditableArraySectionProps {
  title: string
  items: string[]
  isEditing: boolean
  onEditToggle: () => void
  onChange: (newArr: string[]) => void
  placeholder?: string
  addLabel?: string
  displayType?: "default" | "bullets"
  className?: string
  headerClassName?: string
  bgColorClass?: string
  textColorClass?: string
}

export const EditableArraySection: React.FC<EditableArraySectionProps> = ({
  title,
  items,
  isEditing,
  onEditToggle,
  onChange,
  placeholder = "Item",
  addLabel = "Add Item",
  displayType = "default",
  className = "",
  headerClassName = "",
  bgColorClass = "",
  textColorClass = "",
}) => {
  const [localItems, setLocalItems] = useState<string[]>([])

  useEffect(() => {
    setLocalItems(items || [])
  }, [items])

  useEffect(() => {
    if (!isEditing) {
      onChange(localItems)
    }
  }, [localItems, isEditing, onChange])

  const handleChange = (index: number, value: string) => {
    const newItems = [...localItems]
    newItems[index] = value
    setLocalItems(newItems)
  }

  const handleAdd = () => {
    setLocalItems([...localItems, ""])
  }

  const handleRemove = (index: number) => {
    const newItems = [...localItems]
    newItems.splice(index, 1)
    setLocalItems(newItems)
  }

  return (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div
        className={clsx(
          "flex items-center justify-between p-4 rounded-t-lg",
          bgColorClass || "bg-gray-50",
          headerClassName
        )}
      >
        <h3
          className={clsx(
            "text-base font-semibold",
            textColorClass || "text-gray-900"
          )}
        >
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditToggle}
          className={clsx(
            "hover:bg-white/20",
            textColorClass || "text-gray-600"
          )}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {localItems.length > 0 ? (
          <div className="space-y-2">
            {displayType === "bullets" ? (
              <ul className="space-y-2">
                {localItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {isEditing ? (
                      <div className="flex gap-2 items-center w-full">
                        <Input
                          value={item}
                          onChange={(e) => handleChange(index, e.target.value)}
                          placeholder={placeholder}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(index)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-600 mt-1 flex-shrink-0">•</span>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2">
                {localItems.map((item, index) => (
                  <div key={index}>
                    {isEditing ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={item}
                          onChange={(e) => handleChange(index, e.target.value)}
                          placeholder={placeholder}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 mt-1 flex-shrink-0">•</span>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            {placeholder} not available
          </div>
        )}

        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
