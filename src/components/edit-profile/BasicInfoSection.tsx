
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit, Linkedin } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"

interface BasicInfoSectionProps {
  name: string
  role: string
  location: string
  linkedinUrl?: string
  isEditing: boolean
  onEditToggle: () => void
  onChange: (field: "name" | "role" | "location" | "linkedin_url", value: string) => void
  className?: string
  content?: string
  readOnly?: boolean
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  role,
  location,
  linkedinUrl,
  isEditing,
  onEditToggle,
  onChange,
  className = "",
  content = "Update your name, role, and location to keep your profile current",
  readOnly = false,
}) => {
  const sectionContent = (
    <div className={`${className} px-4 py-6 md:px-6`}>
      {/* Name Section with Edit Button */}
      <div className="flex flex-col items-center space-y-4 md:space-y-2 md:flex-row md:items-center md:justify-center relative">
        {isEditing ? (
          <div className="w-full max-w-sm">
            <Input
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              className="text-xl md:text-2xl font-bold text-center border-2 focus:border-primary"
              placeholder="Your Name"
            />
          </div>
        ) : (
          <h1 className="text-xl md:text-2xl font-bold text-center leading-tight">
            {name || "Name not available"}
          </h1>
        )}
        
        {/* Edit Button - positioned for mobile/desktop */}
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="shrink-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 h-10 w-10 rounded-full hover:bg-primary/10"
            aria-label="Edit profile information"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Role and Location Section */}
      <div className="mt-6 space-y-4 text-center">
        {isEditing ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <Input
              value={role}
              onChange={(e) => onChange("role", e.target.value)}
              className="text-base md:text-lg text-center"
              placeholder="Your Role/Title"
            />
            <Input
              value={location}
              onChange={(e) => onChange("location", e.target.value)}
              className="text-sm text-center"
              placeholder="Your Location"
            />
            <Input
              value={linkedinUrl || ""}
              onChange={(e) => onChange("linkedin_url", e.target.value)}
              className="text-sm text-center"
              placeholder="LinkedIn Profile URL (https://...)"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-base md:text-lg text-foreground font-medium leading-relaxed">
              {role || "Role not available"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {location || "Location not available"}
            </p>
            
            {/* LinkedIn Link - Horizontal layout for mobile */}
            {linkedinUrl && (
              <div className="flex justify-center pt-2">
                <a
                  href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 touch-manipulation min-h-[48px] max-w-full"
                  aria-label="View LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium truncate">LinkedIn Profile</span>
                </a>
              </div>
            )}
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
