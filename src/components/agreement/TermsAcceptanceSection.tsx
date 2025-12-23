import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ExternalLink } from "lucide-react"

interface TermsAcceptanceSectionProps {
  agreeConfidentiality: boolean
  agreeNonCircumvention: boolean
  agreeFullAgreement: boolean
  onAgreeConfidentialityChange: (value: boolean) => void
  onAgreeNonCircumventionChange: (value: boolean) => void
  onAgreeFullAgreementChange: (value: boolean) => void
}

export const TermsAcceptanceSection = ({
  agreeConfidentiality,
  agreeNonCircumvention,
  agreeFullAgreement,
  onAgreeConfidentialityChange,
  onAgreeNonCircumventionChange,
  onAgreeFullAgreementChange,
}: TermsAcceptanceSectionProps) => {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-5 sm:p-6 space-y-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Terms and Conditions
        </h3>
        <p className="text-sm text-muted-foreground">
          To proceed, please accept the following terms and conditions as stipulated in the full Master Candidate Agreement:
        </p>
      </div>

      <div className="space-y-4">
        {/* Confidentiality */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confidentiality"
              checked={agreeConfidentiality}
              onCheckedChange={(checked) => onAgreeConfidentialityChange(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="confidentiality" className="font-semibold cursor-pointer">
                Confidentiality
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You will keep all FF and Client information strictly confidential (5 years generally, indefinite for trade secrets and personal data).
              </p>
            </div>
          </div>
        </div>

        {/* Non-Circumvention */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="nonCircumvention"
              checked={agreeNonCircumvention}
              onCheckedChange={(checked) => onAgreeNonCircumventionChange(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="nonCircumvention" className="font-semibold cursor-pointer">
                Non-Circumvention (24 months)
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You will not bypass FF or route senior/executive-level opportunities around FF (unless expressly permitted in an SOW). Any such opportunities must be disclosed within 3 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Full Agreement */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="fullAgreement"
              checked={agreeFullAgreement}
              onCheckedChange={(checked) => onAgreeFullAgreementChange(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="fullAgreement" className="font-semibold cursor-pointer">
                Full Agreement
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You accept the complete Master Candidate Agreement (vDecember2025), including independent contractor status, payments, IP assignment, ecosystem rules, and Good Leaver release.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Full MSA Link */}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <ExternalLink className="h-4 w-4" />
        View Full MSA
      </a>
    </div>
  )
}
