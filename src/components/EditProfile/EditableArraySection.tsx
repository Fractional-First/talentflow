
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, X } from "lucide-react"
import clsx from "clsx"
import React from "react"

interface EditableArraySectionProps {
  title: string
  items: string[]
  onChange: (items: string[]) => void
  isEditing: boolean
  onEditToggle: () => void
  placeholder?: string
  addLabel?: string
  badgeClassName?: string
  inputClassName?: string
  className?: string
  displayType?: "badges" | "bullets"
}

export const EditableArraySection: React.FC<EditableArraySectionProps> = ({
  title,
  items,
  onChange,
  isEditing,
  onEditToggle,
  placeholder = "",
  addLabel = "Add Item",
  badgeClassName = "",
  inputClassName = "",
  className = "",
  displayType = "badges",
}) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange(newItems)
  }

  const handleAdd = () => {
    onChange([...(items || []), ""])
  }

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  return (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditToggle}
          className="hover:bg-gray-100"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-1 w-full">
                  {displayType === "bullets" ? (
                    <Textarea
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className={clsx(
                        "text-sm min-h-[40px] w-full",
                        inputClassName
                      )}
                      placeholder={placeholder}
                      rows={2}
                    />
                  ) : (
                    <Input
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className={clsx("text-xs h-8 w-32", inputClassName)}
                      placeholder={placeholder}
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdd}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              {addLabel}
            </Button>
          </div>
        ) : displayType === "bullets" ? (
          <ul className="space-y-1">
            {(items && items.length > 0
              ? items
              : [placeholder || "Not available"]
            ).map((item, index) => (
              <li key={index} className="flex">
                <span className="text-sm text-gray-700 mr-2 flex-shrink-0 mt-0.5">•</span>
                <span className="text-sm text-gray-700 flex-1" style={{ textIndent: '0', paddingLeft: '0' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(items && items.length > 0
              ? items
              : [placeholder || "Not available"]
            ).map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={clsx("text-xs", badgeClassName)}
              >
                {item}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
