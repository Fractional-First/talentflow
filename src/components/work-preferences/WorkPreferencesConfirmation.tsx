
import {
  StepCard,
  StepCardContent,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PreferencesSaved } from "./PreferencesSaved"

interface WorkPreferencesConfirmationProps {
  onGoToDashboard: () => void
}

export const WorkPreferencesConfirmation = ({
  onGoToDashboard,
}: WorkPreferencesConfirmationProps) => {
  return (
    <StepCard>
      <StepCardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <PreferencesSaved />
        </div>
      </StepCardContent>
    </StepCard>
  )
}
