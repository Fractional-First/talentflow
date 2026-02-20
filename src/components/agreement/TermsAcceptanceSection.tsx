import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"

interface TermsAcceptanceSectionProps {
  acceptFullAgreement: boolean
  onAcceptFullAgreementChange: (value: boolean) => void
  onViewMSA: () => void
  showErrors?: boolean
}

export const TermsAcceptanceSection = ({
  acceptFullAgreement,
  onAcceptFullAgreementChange,
  onViewMSA,
  showErrors,
}: TermsAcceptanceSectionProps) => {
  return (
    <div className={`bg-muted/50 border rounded-xl p-5 sm:p-6 space-y-5 ${showErrors ? "border-destructive" : "border-border"}`}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Final Step: Acceptance of Agreement
        </h3>
        <p className="text-sm text-muted-foreground">
          As a final step, please review and accept the Candidate Agreement.
        </p>
        {showErrors && (
          <p className="text-sm text-destructive">Please accept the Candidate Agreement to continue.</p>
        )}
      </div>

      <div className="bg-background border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptFullAgreement"
            checked={acceptFullAgreement}
            onCheckedChange={(checked) => onAcceptFullAgreementChange(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="acceptFullAgreement" className="text-sm leading-relaxed cursor-pointer">
            I have read and accepted the Candidate Agreement, including the confidentiality and 18-month non-circumvention obligations.
          </Label>
        </div>
      </div>

      {/* View MSA Link */}
      <button
        type="button"
        onClick={onViewMSA}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <FileText className="h-4 w-4" />
        View Candidate Agreement (13.02.2026)
      </button>
    </div>
  )
}
