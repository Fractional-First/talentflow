
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { EditingTooltip } from "@/components/edit-profile/EditingTooltip"
import clsx from "clsx"
import React from "react"

interface EditableTextSectionProps {
  title: string
  value: string
  onChange: (value: string) => void
  isEditing: boolean
  onEditToggle: () => void
  placeholder?: string
  className?: string
  bgColorClass?: string
  textColorClass?: string
  labelClassName?: string
  headerClassName?: string
  textAreaClass?: string
  tooltipContent?: string
}

export const EditableTextSection: React.FC<EditableTextSectionProps> = ({
  title,
  value,
  onChange,
  isEditing,
  onEditToggle,
  placeholder,
  className,
  bgColorClass = "bg-white",
  textColorClass = "text-gray-900",
  labelClassName = "",
  headerClassName = "",
  textAreaClass = "",
  tooltipContent = "Edit this section to customize your information",
}) => {
  return (
    <EditingTooltip content={tooltipContent} show={isEditing}>
      <div className={clsx("rounded-lg border", bgColorClass, className)}>
        <div
          className={clsx(
            "flex items-center justify-between p-4 rounded-t-lg",
            headerClassName
          )}
        >
          <h3 className={clsx("text-lg font-semibold", labelClassName)}>
            {title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className={"hover:bg-gray-100"}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className={clsx("p-4", textColorClass)}>
          {isEditing ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={clsx(
                textAreaClass,
                "text-sm leading-relaxed",
                textColorClass,
                bgColorClass.includes("teal") ? "bg-teal-500" : bgColorClass,
              )}
              rows={bgColorClass.includes("teal") ? 4 : 8}
              placeholder={placeholder}
            />
          ) : (
            <div
              className={clsx(
                "text-sm leading-relaxed whitespace-pre-line",
                textColorClass
              )}
            >
              {value || placeholder || "Not available"}
            </div>
          )}
        </div>
      </div>
    </EditingTooltip>
  )
}
