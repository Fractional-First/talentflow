import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Share2,
  Briefcase,
  Search,
  RefreshCw,
  Globe,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAgreementStatus } from "@/queries/useAgreementAcceptance"
import { PublishConfirmationModal } from "@/components/edit-profile/PublishConfirmationModal"

interface NextStepsCardProps {
  onShareProfile?: () => void
  onPublishProfile?: () => Promise<void>
  isPublished?: boolean
  isUpdatingPublishStatus?: boolean
  publicProfileUrl?: string
  firstName?: string
  hasJobPreferences?: boolean
  /** Work-preferences query still in flight — see the settling note below. */
  isPreferencesLoading?: boolean
}

export const NextStepsCard = ({
  onShareProfile,
  onPublishProfile,
  isPublished = false,
  isUpdatingPublishStatus = false,
  publicProfileUrl = "",
  firstName,
  hasJobPreferences = false,
  isPreferencesLoading = false,
}: NextStepsCardProps) => {
  const navigate = useNavigate()
  const { isAccepted, isCurrentVersion, isLoading: isAgreementLoading } =
    useAgreementStatus({ allowDemoOverride: true })
  const [showPublishModal, setShowPublishModal] = useState(false)

  // Until both queries settle, "not done" is indistinguishable from "not loaded yet". This card
  // now renders unconditionally, so on a cold load a candidate who has already accepted would
  // otherwise be shown an "Accept Agreement" button; following it reaches the agreement form,
  // whose read-only guard is also still unsettled, and acceptances are append-only INSERTs — a
  // duplicate row in the legal record. Disabling until settled closes that window.
  const isSettling = isPreferencesLoading || isAgreementLoading

  // Accepting a version that has since been superseded leaves the candidate needing to
  // re-accept — the agreement page says as much — so it is not "engagement-ready" yet.
  const isAgreementAccepted = isAccepted && isCurrentVersion
  const needsReAcceptance = isAccepted && !isCurrentVersion

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="text-center space-y-3 pb-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Your profile is now complete
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Recommended actions
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Actions Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* Share/Publish Profile Action */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {isPublished ? (
                <Share2 className="h-6 w-6 text-primary" />
              ) : (
                <Globe className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-foreground">
                {isPublished ? "Share Your Profile" : "Publish Your Profile"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPublished
                  ? "Showcase your expertise to your network and allow companies to find you."
                  : "Creates a personalized link to share and helps our team match you to opportunities."}
              </p>
            </div>
            <div className="mt-auto">
              <Button
                onClick={isPublished ? onShareProfile : () => setShowPublishModal(true)}
                disabled={isUpdatingPublishStatus}
                className="w-full"
                size="sm"
              >
                {isPublished && <Share2 className="mr-2 h-4 w-4" />}
                {isUpdatingPublishStatus
                  ? "Publishing..."
                  : isPublished
                  ? "Share Profile"
                  : "Publish Profile"}
              </Button>
            </div>
          </div>

          {/* Job Preferences Action */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-foreground">Job Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Help us understand what you're looking for in your next role. This information will stay private.
              </p>
            </div>
            <div className="mt-auto">
              <Button
                onClick={() => navigate("/work-preferences")}
                disabled={isSettling}
                className="w-full"
                size="sm"
              >
                {isSettling
                  ? "Loading…"
                  : hasJobPreferences
                  ? "View or Edit Preferences"
                  : "Set Preferences"}
              </Button>
            </div>
          </div>

          {/* Get Engagement-Ready Action */}
          <div className="space-y-3 text-center flex flex-col">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-foreground">
                Get Engagement-Ready
              </h3>
              <p className="text-sm text-muted-foreground">
                {isSettling
                  ? "Checking your agreement status…"
                  : isAgreementAccepted
                  ? "You're engagement-ready. View your accepted agreement."
                  : needsReAcceptance
                  ? "Our agreement has been updated. Review and re-accept to stay engagement-ready."
                  : "Complete the final steps to become client engagement-ready."}
              </p>
            </div>
            <div className="mt-auto">
              <Button
                onClick={() => navigate("/dashboard/agreement")}
                disabled={isSettling}
                className="w-full"
                size="sm"
              >
                {isSettling
                  ? "Loading…"
                  : isAgreementAccepted
                  ? "View Agreement"
                  : needsReAcceptance
                  ? "Review Agreement"
                  : "Accept Agreement"}
              </Button>
            </div>
          </div>
        </div>

        {/* Gentle Reminder */}
        <div className="bg-muted/30 rounded-lg p-3 flex items-start gap-3">
          <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong>Keep it fresh:</strong> Remember to update your profile and
            job preferences periodically to ensure opportunities and connections
            stay relevant.
          </div>
        </div>

        {onPublishProfile && (
          <PublishConfirmationModal
            open={showPublishModal}
            onOpenChange={setShowPublishModal}
            onConfirm={onPublishProfile}
            isUpdating={isUpdatingPublishStatus}
            publicProfileUrl={publicProfileUrl}
            firstName={firstName}
          />
        )}
      </CardContent>
    </Card>
  )
}
