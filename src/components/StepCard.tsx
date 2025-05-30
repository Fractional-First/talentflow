
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function StepCard({ 
  children, 
  className,
  animate = true
}: StepCardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl px-8 py-6 md:px-10 md:py-8 w-full",
        animate && "animate-scale-in",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StepCardHeader({ 
  children, 
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  );
}

export function StepCardTitle({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-2xl font-medium tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function StepCardDescription({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground mt-2", className)}>
      {children}
    </p>
  );
}

export function StepCardContent({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

export function StepCardFooter({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex items-center justify-end gap-2", className)}>
      {children}
    </div>
  );
}
