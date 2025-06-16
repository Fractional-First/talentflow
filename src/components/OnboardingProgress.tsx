import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Step = {
  id: number
  name: string
  description: string
  status: "completed" | "current" | "upcoming"
  estimatedTime?: string
}

interface OnboardingProgressProps {
  steps: Step[]
  currentStep: number
}

export function OnboardingProgress({
  steps,
  currentStep,
}: OnboardingProgressProps) {
  return (
    <div className="py-6 px-1">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isUpcoming = step.id > currentStep

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "progress-step group relative z-10",
                    isCompleted && "progress-step-completed",
                    isCurrent && "border-primary text-primary bg-background",
                    isUpcoming && "progress-step-pending"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span>{step.id}</span>
                  )}

                  <div className="absolute -bottom-[48px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-max z-20">
                    <div className="px-3 py-2 rounded-md text-xs font-medium bg-gray-900 text-white shadow-lg">
                      <div>{step.name}</div>
                      {step.estimatedTime && (
                        <div className="text-xs opacity-80 mt-1">
                          Est. time: {step.estimatedTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <span className="mt-2 text-xs font-medium hidden sm:block">
                  {step.name}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center justify-center mx-4">
                  <div
                    className={cn(
                      "h-0.5 w-full bg-muted-foreground/30 transition-all duration-300 ease-in-out",
                      step.id < currentStep &&
                        steps[index + 1].id <= currentStep
                        ? "bg-primary"
                        : ""
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
