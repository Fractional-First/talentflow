
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
  const navigate = useNavigate()

  return (
    <StepCard>
      <StepCardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Success!</h3>
          <p className="text-muted-foreground mb-6">
            Your job preferences have been saved. We'll use these to find the
            best opportunities for you. While you're here, why not{" "}
            <button
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              onClick={() => navigate("/dashboard/branding")}
            >
              explore professional coaching options
            </button>{" "}
            to help you stand out?
          </p>
          <Button onClick={onGoToDashboard} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </StepCardContent>
    </StepCard>
  )
}
