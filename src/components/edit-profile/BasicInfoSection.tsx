
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"

interface BasicInfoSectionProps {
  name: string
  role: string
  location: string
  isEditing: boolean
  onEditToggle: () => void
  onChange: (field: "name" | "role" | "location", value: string) => void
  className?: string
  content?: string
  readOnly?: boolean
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  role,
  location,
  isEditing,
  onEditToggle,
  onChange,
  className = "",
  content = "Update your name, role, and location to keep your profile current",
  readOnly = false,
}) => {
  const sectionContent = (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-2">
        <div className="flex-1 min-w-0 order-2 sm:order-1">
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              className="text-xl sm:text-2xl font-bold text-center min-h-[48px]"
              placeholder="Name"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-bold text-center break-words">
              {name || "Name not available"}
            </h1>
          )}
        </div>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="flex-shrink-0 order-1 sm:order-2 self-center sm:self-auto min-h-[48px] min-w-[48px] p-3"
          >
            <Edit className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-3 sm:space-y-2 text-center">
        {isEditing ? (
          <>
            <Input
              value={role}
              onChange={(e) => onChange("role", e.target.value)}
              className="text-base sm:text-lg text-center min-h-[48px]"
              placeholder="Role"
            />
            <Input
              value={location}
              onChange={(e) => onChange("location", e.target.value)}
              className="text-sm text-center min-h-[48px]"
              placeholder="Location"
            />
          </>
        ) : (
          <>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed break-words px-2">
              {role || "Role not available"}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed break-words px-2">
              {location || "Location not available"}
            </p>
          </>
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
