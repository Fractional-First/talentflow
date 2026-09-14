import { StepCard } from "@/components/StepCard"
import { Check, ClipboardCheck, Handshake, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgreementStatus } from "@/queries/useAgreementAcceptance"

const steps = [
  {
    icon: Handshake,
    text: "We match you to relevant fractional and full-time opportunities as we uncover them",
  },
  {
    icon: MessageCircle,
    text: "We reach out directly when there's a strong fit",
  },
]

interface WhatHappensNextCardProps {
  isPublished?: boolean
  hasJobPreferences?: boolean
}

export const WhatHappensNextCard = ({
  isPublished = false,
  hasJobPreferences = false,
}: WhatHappensNextCardProps) => {
  const { isAccepted: isAgreementAccepted } = useAgreementStatus()

  // The three actions are independent — a candidate can complete them in any order,
  // so this list reflects what they have already done instead of prescribing a sequence.
  const prerequisites = [
    { label: "Publish your profile", isDone: isPublished },
    { label: "Set your job preferences", isDone: hasJobPreferences },
    {
      label: "Accept your agreement with Fractional First",
      isDone: isAgreementAccepted,
    },
  ]

  const allDone = prerequisites.every((item) => item.isDone)

  return (
    <StepCard className="h-full flex flex-col bg-primary/5 border-primary/20 shadow-none">
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground pb-4 mb-2 border-b border-primary/20">
            What Happens Next
          </h2>
          <p className="text-base text-muted-foreground">
            Here's what to expect now that your profile is complete
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="p-4 rounded-lg bg-card border border-primary/10 space-y-3">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm text-foreground">
                {allDone
                  ? "You're all set — our team is reviewing your profile."
                  : "Our team reviews your profile once you've:"}
              </span>
            </div>
            <ul className="space-y-2 pl-8">
              {prerequisites.map((item, index) => (
                <li
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    item.isDone
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center h-4 w-4 rounded-full text-[10px] font-semibold flex-shrink-0",
                      item.isDone
                        ? "bg-primary text-primary-foreground"
                        : "border border-primary/40 text-primary"
                    )}
                  >
                    {item.isDone ? (
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                    <span className="sr-only">
                      {item.isDone ? "Done" : "Not done yet"}
                    </span>
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
            {!allDone && (
              <p className="pl-8 text-xs text-muted-foreground">
                You can complete these in any order.
              </p>
            )}
          </div>

          {steps.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 p-3 rounded-lg bg-card/60 border border-border"
            >
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </StepCard>
  )
}
