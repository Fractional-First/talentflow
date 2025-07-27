
import { StepCard } from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  ArrowRight,
  MapPin,
  DollarSign,
  Building,
  Clock,
} from "lucide-react"

export const JobPreferencesPlaceholder = () => {
  const navigate = useNavigate()

  return (
    <StepCard>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Job Preferences</h3>
          <p className="text-muted-foreground">
            Help us understand what you're looking for in your next role
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Desired roles and job titles
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Location preferences
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Building className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Industry and company size
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Salary expectations
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Work type and availability
            </span>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/work-preferences")}
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: '#449889' }}
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            This will help us match you with the right opportunities
          </p>
        </div>
      </div>
    </StepCard>
  )
}
