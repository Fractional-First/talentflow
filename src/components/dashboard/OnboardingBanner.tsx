
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"

export const OnboardingBanner = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Welcome! Let's complete your profile
              </h2>
              <p className="text-muted-foreground mt-1">
                Tell us what you're looking for so we can prepare future
                opportunities for you.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/work-preferences")}
            className="w-full sm:w-auto sm:ml-6"
          >
            Set Job Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
