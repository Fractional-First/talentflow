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
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <p>
                Publishing makes your profile visible for networking. This does not
                change your status to "looking for work" or opt you into active
                placement services.
              </p>
            </div>

            <div className="flex gap-2">
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
              <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-md">
                <Info className="h-4 w-4 shrink-0 text-primary" />
                <p className="leading-tight">
                  Publishing makes your profile visible for networking. This does not
                  change your status to "looking for work" or opt you into active
                  placement services.
                </p>
              </div>

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

              <Button
                onClick={onSaveAndContinue}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Processing..." : "Save & Go to Dashboard"}
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
