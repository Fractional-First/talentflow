import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ProfileCommitmentsSectionProps {
  commitmentsConfirmed: boolean
  setCommitmentsConfirmed: (value: boolean) => void
}

export const ProfileCommitmentsSection = ({
  commitmentsConfirmed,
  setCommitmentsConfirmed,
}: ProfileCommitmentsSectionProps) => {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 font-urbanist">
        I agree and confirm that:
      </h3>

      <ul className="space-y-3 text-sm text-foreground mb-6 font-urbanist">
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5 font-bold">•</span>
          <span>I will use best efforts to keep my profile information reasonably up to date, including my roles, skills, availability, pricing, work authorization, and other details relevant to potential opportunities; and</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5 font-bold">•</span>
          <span>I currently have valid work authorization in the countries listed in my profile and will notify Fractional First promptly if this changes.</span>
        </li>
      </ul>

      <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg">
        <Checkbox
          id="commitments-confirmed"
          checked={commitmentsConfirmed}
          onCheckedChange={(checked) => setCommitmentsConfirmed(checked as boolean)}
          className="mt-0.5"
        />
        <Label htmlFor="commitments-confirmed" className="text-sm font-medium cursor-pointer font-urbanist leading-relaxed">
          I confirm and agree to the above.
        </Label>
      </div>
    </div>
  )
}
