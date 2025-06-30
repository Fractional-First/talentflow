
import React from "react"
import { EditingTooltip } from "@/components/edit-profile/EditingTooltip"

interface EditableSectionProps {
  children: React.ReactElement
  isEditing: boolean
  tooltipContent: string
  className?: string
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  children,
  isEditing,
  tooltipContent,
  className = "",
}) => {
  return (
    <EditingTooltip content={tooltipContent} show={isEditing}>
      <div className={className}>
        {children}
      </div>
    </EditingTooltip>
  )
}
