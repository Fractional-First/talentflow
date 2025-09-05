
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"

export const OnboardingBanner = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Welcome to your dashboard!
              </h2>
              <p className="text-muted-foreground mt-1">
                Complete your job preferences to unlock more functionality.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/work-preferences")}
            className="ml-6"
          >
            Set Job Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
