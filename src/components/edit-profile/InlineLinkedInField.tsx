import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, X, Linkedin } from "lucide-react"
import { useClickOutside } from "@/hooks/useClickOutside"

interface InlineLinkedInFieldProps {
  value: string
  onChange: (value: string) => void
}

export const InlineLinkedInField: React.FC<InlineLinkedInFieldProps> = ({
  value,
  onChange,
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

  if (isEditing) {
    return (
      <div ref={containerRef} className="flex items-center gap-2 mt-3">
        <Linkedin className="h-6 w-6 text-[#0077b5] flex-shrink-0" />
        <Input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://linkedin.com/in/your-profile"
          className="text-sm"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="p-1 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
          aria-label="View LinkedIn Profile"
        >
          <Linkedin className="h-6 w-6 text-[#0077b5]" />
        </a>
      ) : (
        <Linkedin className="h-6 w-6 text-gray-400" />
      )}
      {value ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          <Edit className="h-3 w-3" />
        </Button>
      ) : (
        <div ref={containerRef} className="flex items-center gap-1">
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder="Add LinkedIn profile URL"
            className="text-sm w-64"
          />
        </div>
      )}
    </div>
  )
}