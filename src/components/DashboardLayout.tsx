
import { ReactNode } from 'react';
import { OnboardingProgress, Step } from './OnboardingProgress';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function DashboardLayout({
  children,
  steps,
  currentStep,
  className
}: DashboardLayoutProps) {
  const backgroundEffect = (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col">
      {backgroundEffect}
      
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">TalentFlow</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Will add user-related buttons here later */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <OnboardingProgress steps={steps} currentStep={currentStep} />
          
          <main className={cn("mt-8", className)}>
            {children}
          </main>
        </div>
      </div>
      
      <footer className="border-t border-border/40 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 TalentFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
