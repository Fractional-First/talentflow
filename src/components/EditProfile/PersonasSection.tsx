import React from "react"
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

interface PersonaEditState {
  title: string
  bulletsText: string
}

interface PersonasSectionProps {
  personas: Persona[]
  personaEditStates: { [key: number]: PersonaEditState }
  isEditing: boolean
  onEditToggle: () => void
  onPersonaLocalUpdate: (
    index: number,
    field: "title" | "bulletsText",
    value: string
  ) => void
  onAddPersona: () => void
  onRemovePersona: (index: number) => void
  activeTab: string
  onActiveTabChange: (tab: string) => void
  className?: string
}

export const PersonasSection: React.FC<PersonasSectionProps> = ({
  personas,
  personaEditStates,
  isEditing,
  onEditToggle,
  onPersonaLocalUpdate,
  onAddPersona,
  onRemovePersona,
  activeTab,
  onActiveTabChange,
  className = "",
}) => {
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
        {personas && personas.length > 0 ? (
          <Tabs
            value={activeTab}
            onValueChange={onActiveTabChange}
            className="w-full"
          >
            <TabsList
              className="grid w-full mb-6 bg-gray-100"
              style={{
                gridTemplateColumns: `repeat(${personas.length}, minmax(0, 1fr))`,
              }}
            >
              {personas.map((persona, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  {persona.title || `Persona ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
            {personas.map((persona, index) => (
              <TabsContent
                key={index}
                value={index.toString()}
                className="space-y-4"
              >
                {isEditing ? (
                  <>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={personaEditStates[index]?.title || ""}
                        onChange={(e) =>
                          onPersonaLocalUpdate(index, "title", e.target.value)
                        }
                        className="font-medium"
                        placeholder="Persona title"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemovePersona(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={personas.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={personaEditStates[index]?.bulletsText || ""}
                      onChange={(e) =>
                        onPersonaLocalUpdate(
                          index,
                          "bulletsText",
                          e.target.value
                        )
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
            onClick={onAddPersona}
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
