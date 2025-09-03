import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Share2, Users, Search, PartyPopper, RefreshCw } from "lucide-react"

interface NextStepsCardProps {
  onShareProfile?: () => void
  onGetGuidance?: () => void
}

export const NextStepsCard = ({ onShareProfile, onGetGuidance }: NextStepsCardProps) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="text-center space-y-2 pb-4">
        <div className="flex items-center justify-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Your profile is now complete!
          </h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Here's how to put it to work.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        {/* Actions Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Share Profile Action */}
          <div className="space-y-2 text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Share2 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-foreground">Share & Be Discoverable</h3>
              <p className="text-xs text-muted-foreground">
                Showcase your expertise and allow companies to find you.
              </p>
            </div>
            <Button 
              onClick={onShareProfile}
              className="w-full"
              size="sm"
            >
              Share Profile
            </Button>
          </div>

          {/* Get Guidance Action */}
          <div className="space-y-2 text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-foreground">Get Guidance</h3>
              <p className="text-xs text-muted-foreground">
                Work with a coach to refine your positioning.
              </p>
            </div>
            <Button 
              onClick={onGetGuidance}
              className="w-full"
              size="sm"
            >
              Get Guidance
            </Button>
          </div>

          {/* Activate Search Action (Coming Soon) */}
          <div className="space-y-2 text-center">
            <div className="mx-auto w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground">Activate Search (Coming Soon)</h3>
              <p className="text-xs text-muted-foreground">
                Explore fractional opportunities tailored to you.
              </p>
            </div>
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
                  <p>Coming soon — you'll be able to start exploring leadership opportunities here.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Gentle Reminder */}
        <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-2">
          <RefreshCw className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <strong>Keep it fresh:</strong> Update your profile and job preferences periodically to ensure opportunities stay relevant.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}