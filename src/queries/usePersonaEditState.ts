import { useEffect, useState } from "react"
import type { Persona, ProfileData } from "@/types/profile"

export function usePersonaEditState({
  personas,
  setFormData,
}: {
  personas: Persona[]
  setFormData: React.Dispatch<React.SetStateAction<ProfileData>>
}) {
  const [personaEditStates, setPersonaEditStates] = useState<{
    [key: number]: { title: string; bulletsText: string }
  }>({})

  // Debounced update function for personas
  useEffect(() => {
    const timeouts: { [key: number]: NodeJS.Timeout } = {}
    Object.entries(personaEditStates).forEach(([personaIndex, editState]) => {
      const index = parseInt(personaIndex)
      if (timeouts[index]) clearTimeout(timeouts[index])
      timeouts[index] = setTimeout(() => {
        const bullets = editState.bulletsText
          .split("\n")
          .map((line) => line.replace(/^•\s*/, "").trim())
          .filter((line) => line.length > 0)
        setFormData((prev) => {
          const updatedPersonas = [...(prev.personas || [])]
          updatedPersonas[index] = {
            ...updatedPersonas[index],
            title: editState.title,
            bullets: bullets,
          }
          return { ...prev, personas: updatedPersonas }
        })
      }, 300)
    })
    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [personaEditStates, setFormData])

  // Sync persona edit state from personas array (e.g. when entering edit mode)
  const syncPersonaEditStates = (personas: Persona[]) => {
    const syncedEditStates: {
      [key: number]: { title: string; bulletsText: string }
    } = {}
    personas.forEach((persona, index) => {
      syncedEditStates[index] = {
        title: persona.title,
        bulletsText:
          persona.bullets?.map((bullet) => `• ${bullet}`).join("\n") || "",
      }
    })
    setPersonaEditStates(syncedEditStates)
  }

  const handlePersonaLocalUpdate = (
    personaIndex: number,
    field: "title" | "bulletsText",
    value: string
  ) => {
    setPersonaEditStates((prev) => ({
      ...prev,
      [personaIndex]: {
        ...prev[personaIndex],
        [field]: value,
      },
    }))
  }

  const handleAddPersona = () => {
    setFormData((prev) => {
      const newPersonas = [...(prev.personas || []), { title: "", bullets: [] }]
      return { ...prev, personas: newPersonas }
    })
    setPersonaEditStates((prev) => ({
      ...prev,
      [personas.length]: { title: "", bulletsText: "" },
    }))
  }

  const handleRemovePersona = (index: number) => {
    setFormData((prev) => {
      const newPersonas = (prev.personas || []).filter((_, i) => i !== index)
      return { ...prev, personas: newPersonas }
    })
    // Remove from edit state and reindex
    const newEditStates: {
      [key: number]: { title: string; bulletsText: string }
    } = {}
    const newPersonas = (personas || []).filter((_, i) => i !== index)
    newPersonas.forEach((persona, newIndex) => {
      if (personaEditStates[newIndex < index ? newIndex : newIndex + 1]) {
        newEditStates[newIndex] =
          personaEditStates[newIndex < index ? newIndex : newIndex + 1]
      } else {
        newEditStates[newIndex] = {
          title: persona.title,
          bulletsText:
            persona.bullets?.map((bullet) => `• ${bullet}`).join("\n") || "",
        }
      }
    })
    setPersonaEditStates(newEditStates)
  }

  return {
    personaEditStates,
    setPersonaEditStates,
    handlePersonaLocalUpdate,
    handleAddPersona,
    handleRemovePersona,
    syncPersonaEditStates,
  }
}
