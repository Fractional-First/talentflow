import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowLeft, ArrowRight, Globe, Info } from "lucide-react"
import { PublishConfirmationModal } from "./PublishConfirmationModal"

interface StickyActionBarProps {
  isPublished: boolean
  isUpdatingPublishStatus: boolean
  isSubmitting: boolean
  onRegenerateProfile: () => void
  onPublishToggle: () => void
  onSaveAndContinue: () => void
  publicProfileUrl?: string
  onPublishConfirm?: () => Promise<void>
}

export const StickyActionBar = ({
  isPublished,
  isUpdatingPublishStatus,
  isSubmitting,
  onRegenerateProfile,
  onPublishToggle,
  onSaveAndContinue,
  publicProfileUrl = "",
  onPublishConfirm,
}: StickyActionBarProps) => {
  const [showPublishModal, setShowPublishModal] = useState(false)

  const publishInfoText = "Publishing creates a personalized shareable link as an alternative to your LinkedIn profile. This does not mean that you are looking for work. Making your profile publicly accessible helps the Fractional First team internally match and contact you for client opportunities."

  const handlePublishClick = () => {
    if (!isPublished && onPublishConfirm) {
      setShowPublishModal(true)
    } else {
      onPublishToggle()
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Mobile: Stack layout */}
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onRegenerateProfile}
                className="flex-1"
                size="sm"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Regenerate
              </Button>
              
              <div className="flex items-center gap-1 flex-1">
                <Button
                  onClick={handlePublishClick}
                  disabled={isUpdatingPublishStatus}
                  variant={!isPublished ? "default" : "outline"}
                  className={!isPublished ? "bg-primary hover:bg-primary/90 text-primary-foreground flex-1" : "flex-1"}
                  size="sm"
                >
                  <Globe className="mr-1 h-4 w-4" />
                  {isUpdatingPublishStatus
                    ? "..."
                    : !isPublished
                    ? "Publish"
                    : "Unpublish"}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[280px] text-xs">
                      {publishInfoText}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button
                onClick={onSaveAndContinue}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                size="sm"
              >
                {isSubmitting ? "..." : "Save"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onRegenerateProfile}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regenerate Profile
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Button
                  onClick={handlePublishClick}
                  disabled={isUpdatingPublishStatus}
                  variant={!isPublished ? "default" : "outline"}
                  className={!isPublished ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {isUpdatingPublishStatus
                    ? "Updating..."
                    : !isPublished
                    ? "Publish"
                    : "Unpublish"}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[320px] text-xs">
                      {publishInfoText}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button
                onClick={onSaveAndContinue}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Processing..." : "Save Draft & Go to Dashboard"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {onPublishConfirm && (
        <PublishConfirmationModal
          open={showPublishModal}
          onOpenChange={setShowPublishModal}
          onConfirm={onPublishConfirm}
          isUpdating={isUpdatingPublishStatus}
          publicProfileUrl={publicProfileUrl}
        />
      )}
    </>
  )
}
