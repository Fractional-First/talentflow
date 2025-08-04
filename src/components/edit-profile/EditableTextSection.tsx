
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"
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
  content?: string
  readOnly?: boolean
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
  content = "Edit this section to customize your information",
  readOnly = false,
}) => {
  const sectionContent = (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="flex items-center justify-between p-1 pl-4 rounded-t-lg bg-[#449889] text-white">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="hover:bg-white/20 text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-4 bg-white">
        {isEditing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(
              textAreaClass,
              "text-sm leading-relaxed bg-white text-gray-700"
            )}
            rows={8}
            placeholder={placeholder}
          />
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
            {value || placeholder || "Not available"}
          </div>
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
