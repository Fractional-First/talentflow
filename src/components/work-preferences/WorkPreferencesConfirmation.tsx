
import {
  StepCard,
  StepCardContent,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface WorkPreferencesConfirmationProps {
  onGoToDashboard: () => void
}

export const WorkPreferencesConfirmation = ({
  onGoToDashboard,
}: WorkPreferencesConfirmationProps) => {
  return (
    <StepCard>
      <StepCardHeader className="text-center">
        <StepCardTitle>Work Preferences Saved</StepCardTitle>
      </StepCardHeader>
      <StepCardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Success!</h3>
          <p className="text-muted-foreground mb-6">
            Your work preferences have been saved. We'll use these to find the
            best opportunities for you.
          </p>
          <Button onClick={onGoToDashboard} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </StepCardContent>
    </StepCard>
  )
}
