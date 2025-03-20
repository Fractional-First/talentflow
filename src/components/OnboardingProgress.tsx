
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Step = {
  id: number;
  name: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedTime?: string;
};

interface OnboardingProgressProps {
  steps: Step[];
  currentStep: number;
}

export function OnboardingProgress({ 
  steps, 
  currentStep 
}: OnboardingProgressProps) {
  return (
    <div className="py-6 px-1">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "progress-step group relative z-10",
                  step.status === 'completed' && "progress-step-completed",
                  step.status === 'current' && "progress-step-active",
                  step.status === 'upcoming' && "progress-step-pending"
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <span>{step.id}</span>
                )}
                
                <div className="absolute -bottom-[48px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-max z-20">
                  <div className="glassmorphism px-3 py-2 rounded-md text-xs font-medium">
                    <div>{step.name}</div>
                    {step.estimatedTime && (
                      <div className="text-xs opacity-80 mt-1">Est. time: {step.estimatedTime}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <span className="mt-2 text-xs font-medium hidden sm:block">
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="relative flex-1 max-w-[100px]">
                <div
                  className={cn(
                    "progress-connector",
                    (steps[index].status === 'completed' && steps[index + 1].status === 'completed') ||
                    (steps[index].status === 'completed' && steps[index + 1].status === 'current')
                      ? "progress-connector-active"
                      : ""
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
