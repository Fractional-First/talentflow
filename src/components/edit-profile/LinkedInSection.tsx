import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, X, Linkedin } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"
import clsx from "clsx"
import { useClickOutside } from "@/hooks/useClickOutside"

interface LinkedInSectionProps {
  value: string
  onChange: (value: string) => void
  className?: string
  content?: string
}

export const LinkedInSection: React.FC<LinkedInSectionProps> = ({
  value,
  onChange,
  className,
  content = "Add your LinkedIn profile URL to enhance your professional presence",
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update temp value when prop value changes
  useEffect(() => {
    setTempValue(value)
  }, [value])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Handle click outside to save
  useClickOutside(containerRef, () => {
    if (isEditing) {
      handleSave()
    }
  })

  const handleEdit = () => {
    setTempValue(value)
    setIsEditing(true)
  }

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const sectionContent = (
    <div ref={containerRef} className={clsx("rounded-lg border", className)}>
      <div className="flex items-center justify-between p-1 pl-4 rounded-t-lg bg-[#449889] text-white">
        <h3 className="text-lg font-semibold">
          LinkedIn Profile
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="hover:bg-white/20 text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="hover:bg-white/20 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-4 rounded-b-lg bg-white">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://linkedin.com/in/your-profile"
            className="text-sm"
          />
        ) : (
          <div className="flex items-center gap-3">
            <Linkedin className="h-5 w-5 text-[#0077b5]" />
            <div className="text-sm text-gray-700">
              {value ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077b5] hover:underline"
                >
                  {value}
                </a>
              ) : (
                <span className="text-gray-500">Not added yet</span>
              )}
            </div>
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