import type { ProfileData, Superpower } from "@/types/profile"
import { useEffect, useState } from "react"

export function useSuperpowerEditState({
  superpowers,
  setFormData,
}: {
  superpowers: Superpower[]
  setFormData: React.Dispatch<React.SetStateAction<ProfileData>>
}) {
  const [superpowerEditStates, setSuperpowerEditStates] = useState<{
    [key: number]: { title: string; description: string }
  }>({})

  // Debounced update function for superpowers
  useEffect(() => {
    const timeouts: { [key: number]: NodeJS.Timeout } = {}
    Object.entries(superpowerEditStates).forEach(
      ([superpowerIndex, editState]) => {
        const index = parseInt(superpowerIndex)
        if (timeouts[index]) clearTimeout(timeouts[index])
        timeouts[index] = setTimeout(() => {
          setFormData((prev) => {
            const updatedSuperpowers = [...(prev.superpowers || [])]
            updatedSuperpowers[index] = {
              title: editState.title,
              description: editState.description,
            }
            return { ...prev, superpowers: updatedSuperpowers }
          })
        }, 300)
      }
    )
    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [superpowerEditStates, setFormData])

  // Sync superpower edit state from superpowers array (e.g. when entering edit mode)
  const syncSuperpowerEditStates = (superpowers: Superpower[]) => {
    const syncedEditStates: {
      [key: number]: { title: string; description: string }
    } = {}
    superpowers.forEach((superpower, index) => {
      syncedEditStates[index] = {
        title: superpower.title,
        description: superpower.description,
      }
    })
    setSuperpowerEditStates(syncedEditStates)
  }

  return {
    superpowerEditStates,
    syncSuperpowerEditStates,
  }
}
