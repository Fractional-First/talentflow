import { StepCard } from "@/components/StepCard"
import { ClipboardCheck, Handshake, MessageCircle } from "lucide-react"

const prerequisites = [
  "Published your profile",
  "Set your job preferences",
  "Accept your agreement with Fractional First",
]

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

export const WhatHappensNextCard = () => {
  return (
    <StepCard className="h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-foreground pb-4 mb-2 border-b border-border">What Happens Next</h3>
          <p className="text-base text-muted-foreground">
            Here's what to expect now that your profile is complete
          </p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="p-3 rounded-lg bg-primary/10 space-y-2">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm text-foreground">
                Our team reviews your completed profile once you've:
              </span>
            </div>
            <ol className="space-y-1.5 pl-8">
              {prerequisites.map((item, index) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          {steps.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </StepCard>
  )
}
