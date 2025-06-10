import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
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
  bgColorClass?: string // e.g. 'bg-teal-600', 'bg-white', etc.
  textColorClass?: string // e.g. 'text-white', 'text-gray-900', etc.
  labelClassName?: string
  textAreaClass?: string
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
  textAreaClass = "",
}) => {
  return (
    <div className={clsx("rounded-lg border", bgColorClass, className)}>
      <div
        className={
          "flex items-center justify-between p-4 rounded-t-lg bg-teal-600 text-white"
        }
      >
        <h3 className={clsx("text-lg font-semibold")}>{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditToggle}
          className={"hover:bg-white/50 text-white"}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className={clsx("p-4 text-white")}>
        {isEditing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(
              "text-sm leading-relaxed",
              textColorClass,
              bgColorClass,
              textAreaClass
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
  )
}
