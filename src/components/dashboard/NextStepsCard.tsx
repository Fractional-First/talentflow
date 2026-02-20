import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Share2,
  Users,
  Search,
  PartyPopper,
  RefreshCw,
  Globe,
  Copy,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface NextStepsCardProps {
  onShareProfile?: () => void
  onPublishProfile?: () => void
  isPublished?: boolean
  isUpdatingPublishStatus?: boolean
}

export const NextStepsCard = ({
  onShareProfile,
  onPublishProfile,
  isPublished = false,
  isUpdatingPublishStatus = false,
}: NextStepsCardProps) => {
  const navigate = useNavigate()

  const handleGetGuidance = () => {
    navigate("/dashboard/branding")
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="text-center space-y-3 pb-4">
        <div className="flex items-center justify-center gap-2">
          <PartyPopper className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Your profile and job preferences are now complete!
          </h2>
          <PartyPopper className="h-6 w-6 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          Here's how to put them to work.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Actions Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Share/Publish Profile Action */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {isPublished ? (
                <Share2 className="h-6 w-6 text-primary" />
              ) : (
                <Globe className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-foreground">
                {isPublished ? "Share Your Profile" : "Publish Your Profile"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPublished
                  ? "Showcase your expertise to your network and allow companies to find you."
                  : "Make your profile publicly accessible so others can discover and connect with you."}
              </p>
            </div>
            <div className="mt-auto">
              <Button
                onClick={isPublished ? onShareProfile : onPublishProfile}
                disabled={isUpdatingPublishStatus}
                className="w-full"
                size="sm"
              >
                {isPublished && <Share2 className="mr-2 h-4 w-4" />}
                {isUpdatingPublishStatus
                  ? "Publishing..."
                  : isPublished
                  ? "Share Profile"
                  : "Publish Profile"}
              </Button>
            </div>
          </div>

          {/* Get Guidance Action */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-foreground">Get Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Work with a coach to refine your personal positioning and career
                strategy.
              </p>
            </div>
            <div className="mt-auto">
              <Button onClick={handleGetGuidance} className="w-full" size="sm">
                Get Guidance
              </Button>
            </div>
          </div>

          {/* Get Engagement-Ready Action */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-foreground flex items-center justify-center gap-2">
                Get Engagement-Ready
                <Badge variant="default" className="text-[10px] px-1.5 py-0">New</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete the final steps to become client engagement-ready.
              </p>
            </div>
            <div className="mt-auto">
              <Button
                onClick={() => navigate("/dashboard/agreement")}
                className="w-full"
                size="sm"
              >
                Accept Agreement
              </Button>
            </div>
          </div>
        </div>

        {/* Gentle Reminder */}
        <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-3">
          <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong>Keep it fresh:</strong> Remember to update your profile and
            job preferences periodically to ensure opportunities and connections
            stay relevant.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
