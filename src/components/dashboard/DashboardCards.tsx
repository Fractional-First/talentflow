import { useNavigate } from "react-router-dom"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Briefcase,
  Image,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react"

export const WelcomeCard = () => {
  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Welcome to Your Dashboard</StepCardTitle>
        <StepCardDescription>
          You've completed onboarding! Now you can freely navigate between
          different sections.
        </StepCardDescription>
      </StepCardHeader>

      <StepCardContent>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm">All onboarding steps completed</span>
        </div>
      </StepCardContent>
    </StepCard>
  )
}

export const DashboardNavCard = ({
  title,
  description,
  detailText,
  path,
  icon,
  badgeText,
  badgeVariant = "success",
  completionRate = 100,
}: {
  title: string
  description: string
  detailText: string
  path: string
  icon: React.ReactNode
  badgeText: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success"
  completionRate?: number
}) => {
  const navigate = useNavigate()

  // Helper function to determine progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return "#FF4C4C" // Red
    if (percentage <= 50) return "#FFA500" // Orange
    if (percentage <= 79) return "#FFD700" // Yellow
    if (percentage <= 99) return "#90EE90" // Light Green
    return "#32CD32" // Green (100%)
  }

  return (
    <StepCard className="h-full transition-all hover:shadow-md">
      <button onClick={() => navigate(path)} className="text-left w-full">
        <StepCardHeader>
          <div className="flex items-start">
            <div className="mr-3">
              <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
            </div>
            <div>
              <StepCardTitle>{title}</StepCardTitle>
            </div>
          </div>
          <StepCardDescription>{description}</StepCardDescription>
        </StepCardHeader>

        <StepCardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress
              value={completionRate}
              className="h-1.5"
              indicatorColor={getProgressColor(completionRate)}
            />

            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">{detailText}</p>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </StepCardContent>
      </button>
    </StepCard>
  )
}

export const DashboardNavGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardNavCard
        title="Improve Profile"
        description="Continuously enhance your professional profile"
        detailText="Add more skills, experiences, and keep your info current"
        path="/create-profile"
        icon={<User className="h-5 w-5 text-primary" />}
        badgeText="Evolving"
        completionRate={85}
      />

      <DashboardNavCard
        title="Professional Branding"
        description="Enhance your professional presence"
        detailText="Update your portfolio and professional images"
        path="/dashboard/branding"
        icon={<Image className="h-5 w-5 text-primary" />}
        badgeText="Complete"
        completionRate={90}
      />

      <DashboardNavCard
        title="Job Preferences"
        description="View and manage preferences"
        detailText="Set availability and preferences for smarter opportunity matches"
        path="/dashboard/job-matching"
        icon={<Briefcase className="h-5 w-5 text-primary" />}
        badgeText="Active"
        completionRate={75}
      />
    </div>
  )
}
