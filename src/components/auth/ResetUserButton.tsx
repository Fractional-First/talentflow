
import { Button } from "@/components/ui/button"
import { resetUserState } from "@/utils/authUtils"
import { RotateCcw } from "lucide-react"

export const ResetUserButton = () => {
  const handleReset = async () => {
    if (confirm('Are you sure you want to reset the user state? This will log you out and clear all auth data.')) {
      await resetUserState()
    }
  }

  return (
    <Button 
      onClick={handleReset}
      variant="destructive"
      size="sm"
      className="fixed bottom-4 right-4 z-50"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Reset User State
    </Button>
  )
}
