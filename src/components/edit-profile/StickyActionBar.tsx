import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  firstName?: string
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
  firstName,
}: StickyActionBarProps) => {
  const [showPublishModal, setShowPublishModal] = useState(false)

  const publishInfoText = "Publish to go live. Your work availability remains private."

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
          {/* Mobile layout */}
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>{publishInfoText}</p>
            </div>
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

          {/* Desktop layout */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onRegenerateProfile}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regenerate Profile
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground max-w-md leading-relaxed">
                <p>
                  <Info className="h-3.5 w-3.5 inline-block mr-1 -mt-0.5" />
                  {publishInfoText}
                </p>
                <p className="hidden sm:block ml-[calc(0.875rem+0.25rem)]">
                  You may unpublish at any time.
                </p>
              </div>

              <Button
                onClick={handlePublishClick}
                disabled={isUpdatingPublishStatus}
                variant={!isPublished ? "default" : "outline"}
                className={!isPublished ? "bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" : "shrink-0"}
              >
                <Globe className="mr-2 h-4 w-4" />
                {isUpdatingPublishStatus
                  ? "Updating..."
                  : !isPublished
                  ? "Publish"
                  : "Unpublish"}
              </Button>

              <Button
                onClick={onSaveAndContinue}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
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
          firstName={firstName}
        />
      )}
    </>
  )
}
