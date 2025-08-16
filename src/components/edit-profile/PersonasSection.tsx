
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Edit, Plus, X } from "lucide-react"
import clsx from "clsx"
import type { Persona } from "@/types/profile"
import { EditableSection } from "@/components/EditableSection"

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
  content?: string
  readOnly?: boolean
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
  content = "Define different professional personas that showcase various aspects of your expertise",
  readOnly = false,
}) => {
  const sectionContent = (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="bg-[#449889] text-white rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-1 sm:pl-4 gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-center sm:text-left">Personas</h3>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="text-white hover:bg-white/20 self-center sm:self-auto min-h-[48px] min-w-[48px] p-3"
          >
            <Edit className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>
      <div className="p-4">
        {personas && personas.length > 0 ? (
          <Tabs
            value={activeTab}
            onValueChange={onActiveTabChange}
            className="w-full"
          >
            <TabsList
              className="grid w-full mb-6 bg-gray-100 h-auto p-1"
              style={{
                gridTemplateColumns: `repeat(${personas.length}, minmax(0, 1fr))`,
              }}
            >
              {personas.map((persona, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 px-2 sm:px-3 py-3 whitespace-normal text-center leading-tight h-auto min-h-[3rem] flex items-center justify-center"
                  title={persona.title || `Persona ${index + 1}`}
                >
                  <span className="break-words">
                    {persona.title || `Persona ${index + 1}`}
                  </span>
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
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <Input
                        value={personaEditStates[index]?.title || ""}
                        onChange={(e) =>
                          onPersonaLocalUpdate(index, "title", e.target.value)
                        }
                        className="font-medium flex-1 min-h-[48px]"
                        placeholder="Persona title"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemovePersona(index)}
                        className="text-red-500 hover:text-red-700 self-center sm:self-auto min-h-[48px] min-w-[48px] p-3"
                        disabled={personas.length === 1}
                      >
                        <X className="h-5 w-5 sm:h-4 sm:w-4" />
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
                      className="min-h-[120px] sm:min-h-[140px]"
                      placeholder="Enter bullet points, one per line. Start each line with '•' or it will be added automatically."
                    />
                  </>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium text-base sm:text-lg text-gray-900 text-center sm:text-left">
                      {persona.title}
                    </h4>
                    <ul className="space-y-3">
                      {persona.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="text-gray-900 mr-3 mt-0.5 flex-shrink-0 text-base">
                            •
                          </span>
                          <span className="text-sm text-gray-700 leading-relaxed break-words flex-1">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-sm text-gray-700 py-4 text-center sm:text-left">Personas not available</div>
        )}
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPersona}
            className="w-full mt-4 min-h-[48px]"
          >
            <Plus className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
            Add Persona
          </Button>
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
