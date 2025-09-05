import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Copy, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PublicProfileLinkProps {
  publicProfileUrl: string
}

export const PublicProfileLink = ({
  publicProfileUrl,
}: PublicProfileLinkProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl)
      toast({
        title: "Link copied to clipboard",
        description: "You can now share your public profile link.",
      })
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Your public profile:
          </p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-background px-2 py-1 rounded border flex-1 break-all">
              {publicProfileUrl}
            </code>
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy link</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(publicProfileUrl, "_blank")}
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
