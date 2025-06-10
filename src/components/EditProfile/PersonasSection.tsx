import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X } from "lucide-react"
import clsx from "clsx"

export interface Persona {
  title: string
  bullets: string[]
}

interface PersonasSectionProps {
  personas: Persona[]
  isEditing: boolean
  onEditToggle: () => void
  onPersonasChange: (personas: Persona[]) => void
  className?: string
}

export const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  isEditing,
  onEditToggle,
  onPersonasChange,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("0")
  const [localPersonas, setLocalPersonas] = useState<Persona[]>([])

  // Sync local state with props
  useEffect(() => {
    setLocalPersonas(personas || [])
  }, [personas])

  // Debounce persona changes
  useEffect(() => {
    if (!isEditing) return
    const timeout = setTimeout(() => {
      onPersonasChange(localPersonas)
    }, 300)
    return () => clearTimeout(timeout)
  }, [localPersonas, isEditing, onPersonasChange])

  const handleTitleChange = (index: number, value: string) => {
    setLocalPersonas((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], title: value }
      return updated
    })
  }

  const handleBulletsChange = (index: number, value: string) => {
    const bullets = value
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter((line) => line.length > 0)
    setLocalPersonas((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], bullets }
      return updated
    })
  }

  const handleAddPersona = () => {
    setLocalPersonas((prev) => [...prev, { title: "", bullets: [] }])
    setActiveTab(String(localPersonas.length))
  }

  const handleRemovePersona = (index: number) => {
    setLocalPersonas((prev) => prev.filter((_, i) => i !== index))
    setActiveTab("0")
  }

  return (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-[#449889] text-white rounded-t-lg flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Personas</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditToggle}
          className="text-white hover:bg-white/20"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {localPersonas && localPersonas.length > 0 ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full mb-6 bg-gray-100"
              style={{
                gridTemplateColumns: `repeat(${localPersonas.length}, minmax(0, 1fr))`,
              }}
            >
              {localPersonas.map((persona, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  {persona.title || `Persona ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
            {localPersonas.map((persona, index) => (
              <TabsContent
                key={index}
                value={index.toString()}
                className="space-y-4"
              >
                {isEditing ? (
                  <>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={persona.title}
                        onChange={(e) =>
                          handleTitleChange(index, e.target.value)
                        }
                        className="font-medium"
                        placeholder="Persona title"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePersona(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={localPersonas.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={persona.bullets.map((b) => `• ${b}`).join("\n")}
                      onChange={(e) =>
                        handleBulletsChange(index, e.target.value)
                      }
                      className="min-h-[120px]"
                      placeholder="Enter bullet points, one per line. Start each line with '•' or it will be added automatically."
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-medium">{persona.title}</h4>
                    <ul className="space-y-2">
                      {persona.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>• {bullet}</li>
                      ))}
                    </ul>
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-sm text-gray-700">Personas not available</div>
        )}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPersona}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Persona
          </Button>
        )}
      </div>
    </div>
  )
}
