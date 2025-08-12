
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingProgress, Step } from './OnboardingProgress';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  steps?: Step[];
  currentStep?: number;
  className?: string;
  sidebar?: boolean;
}

export function DashboardLayout({
  children,
  steps,
  currentStep,
  className,
  sidebar = false
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    if (onboardingStatus === 'true') {
      setOnboardingComplete(true);
    }
  }, []);

  const backgroundEffect = (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
    </div>
  );

  // Sidebar Layout
  if (sidebar) {
    return (
      <div className="min-h-screen w-full flex">
        {backgroundEffect}
        {/* Sidebar goes here */}
        {children /* in sidebar mode, the layout is custom and children handle the rest */}
      </div>
    );
  }

  // Standard Layout (with onboarding progress)
  return (
    <div className="min-h-screen w-full flex flex-col">
      {backgroundEffect}

      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png" 
              alt="Fractional First" 
              className="h-12 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center space-x-2">
            {onboardingComplete && window.location.pathname !== '/dashboard' && (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-7xl mx-auto">
          {steps && currentStep !== undefined && (
            <OnboardingProgress steps={steps} currentStep={currentStep} />
          )}
          <main className={cn(steps && currentStep !== undefined ? "mt-8" : "", className)}>
            {children}
          </main>
        </div>
      </div>

      <footer className="border-t border-border/40 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Fractional First. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
