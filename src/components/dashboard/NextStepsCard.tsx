import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
            Your profile is now complete!
          </h2>
          <PartyPopper className="h-6 w-6 text-primary" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          Here's how to put it to work.
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
                  ? "Showcase your expertise to your network and allow companies and recruiters to find you directly through our platform."
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
                {isPublished && <Copy className="mr-2 h-4 w-4" />}
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

          {/* Activate Search Action (Coming Soon) */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-muted-foreground">
                Activate Search (Coming Soon)
              </h3>
              <p className="text-sm text-muted-foreground">
                Start exploring fractional leadership opportunities tailored to
                your profile.
              </p>
            </div>
            <div className="mt-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled
                      variant="secondary"
                      className="w-full opacity-50 cursor-not-allowed"
                      size="sm"
                    >
                      Coming Soon
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Coming soon — you'll be able to start exploring leadership
                      opportunities here.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
