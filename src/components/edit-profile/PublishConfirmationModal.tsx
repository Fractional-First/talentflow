import { useState } from "react"
import { ExternalLink, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, Link2, Shield, Search, Globe } from "lucide-react"
import { toast } from "@/hooks/use-toast"

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
  const [isSuccess, setIsSuccess] = useState(false)

  const handleConfirm = async () => {
    try {
      await onConfirm()
      setIsSuccess(true)
    } catch {
      // Error handling is done in the parent
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    onOpenChange(false)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl)
      toast({
        title: "Link copied!",
        description: "Share it with your network.",
      })
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Publish Your Profile
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-1">
                Here's what publishing means:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                  <Link2 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-foreground">
                  A clean, shareable link for peer-to-peer introductions.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-foreground">
                  Searchable only within our vetted internal network.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-foreground">
                  No public "looking for work" signals.
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isUpdating ? "Publishing..." : "Confirm Publish"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Your profile is now live!</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center text-center pt-4 pb-2 space-y-5">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  Your profile is now live!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share your profile link with your network.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full min-w-0 bg-muted rounded-lg px-3 py-2.5">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate flex-1 text-left min-w-0">
                  {publicProfileUrl}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: "My Profile", url: publicProfileUrl })
                    } else {
                      handleCopyLink()
                    }
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Profile
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  asChild
                >
                  <a href={publicProfileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Profile
                  </a>
                </Button>
              </div>

              <Button variant="ghost" onClick={handleClose} className="w-full text-muted-foreground">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
