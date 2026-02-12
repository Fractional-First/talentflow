import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PublishConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  isUpdating: boolean
  publicProfileUrl: string
}

export const PublishConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  isUpdating,
  publicProfileUrl,
}: PublishConfirmationModalProps) => {
  const [isPublishing, setIsPublishing] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsPublishing(true)
      await onConfirm()
    } catch {
      // Error handling is done in the parent
    } finally {
      setIsPublishing(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }




  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Publish Your Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            Are you ready to make your profile live?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isUpdating || isPublishing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isUpdating || isPublishing ? "Publishing..." : "Confirm Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
