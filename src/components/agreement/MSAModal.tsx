import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface MSAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MSAModal = ({ open, onOpenChange }: MSAModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Master Candidate Agreement
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                December 2025
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/documents/master-candidate-agreement.pdf"
            className="w-full h-full border-0"
            title="Master Candidate Agreement"
          />
        </div>
        
        <div className="px-6 py-4 border-t border-border flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
