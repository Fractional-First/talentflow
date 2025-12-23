import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ProfileCommitmentsSectionProps {
  keepProfileUpdated: boolean
  setKeepProfileUpdated: (value: boolean) => void
  workAuthorizationConfirmed: boolean
  setWorkAuthorizationConfirmed: (value: boolean) => void
}

export const ProfileCommitmentsSection = ({
  keepProfileUpdated,
  setKeepProfileUpdated,
  workAuthorizationConfirmed,
  setWorkAuthorizationConfirmed,
}: ProfileCommitmentsSectionProps) => {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2 font-urbanist">
        Profile Commitments
      </h3>
      <p className="text-sm text-muted-foreground mb-4 font-urbanist">
        Please confirm the following to help us serve you better:
      </p>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg">
          <Checkbox
            id="keep-profile-updated"
            checked={keepProfileUpdated}
            onCheckedChange={(checked) => setKeepProfileUpdated(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="keep-profile-updated" className="text-sm font-medium cursor-pointer font-urbanist leading-relaxed">
            I agree to use best efforts to keep my profile information up to date, including new roles, skills, availability, pricing, work authorization, and other details relevant to opportunities.
          </Label>
        </div>

        <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg">
          <Checkbox
            id="work-authorization-confirmed"
            checked={workAuthorizationConfirmed}
            onCheckedChange={(checked) => setWorkAuthorizationConfirmed(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="work-authorization-confirmed" className="text-sm font-medium cursor-pointer font-urbanist leading-relaxed">
            I confirm I have valid work authorization in the countries listed in my profile and will notify Fractional First promptly if this changes.
          </Label>
        </div>
      </div>
    </div>
  )
}
