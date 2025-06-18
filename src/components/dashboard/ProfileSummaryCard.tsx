import { StepCard } from "@/components/StepCard"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type ProfileSummary } from "@/queries/useProfileData"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ProfileSummaryCardProps {
  profile: ProfileSummary
  readonly?: boolean
  className?: string
}

export function ProfileSummaryCard({
  profile,
  readonly = false,
  className,
}: ProfileSummaryCardProps) {
  const navigate = useNavigate()
  // Get initials from name
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <StepCard className={cn(className)}>
      {readonly && (
        <div className="flex items-center gap-2 p-4 border-b bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Profile Complete</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.name}
            </h2>
            <p className="text-gray-600">{profile.title}</p>
            <p className="text-gray-500 text-sm">{profile.company}</p>
            <p className="text-gray-500 text-sm">{profile.location}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">About</h3>
          <p className="mt-2 text-sm text-gray-600">{profile.about}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Button onClick={() => navigate("/edit-profile")} className="w-full">
            Edit Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </StepCard>
  )
}
