

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

interface JobPreferencesPlaceholderProps {
  isCompleted?: boolean
}

export const JobPreferencesPlaceholder = ({ isCompleted = false }: JobPreferencesPlaceholderProps) => {
  const navigate = useNavigate()

  return (
    <StepCard className="h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-4 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 flex-shrink-0">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold mb-2">Job Preferences</h3>
            <p className="text-muted-foreground">
              Help us understand what you're looking for in your next role
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6 flex-1">
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

        <div className="text-center mt-auto">
          <Button
            onClick={() => navigate("/work-preferences")}
            className="w-full bg-[#449889] hover:bg-[#449889]/90 text-white"
          >
            {isCompleted ? "Update Preferences" : "Get Started"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </StepCard>
  )
}

