
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  children: ReactNode;
  className?: string;
}

export function StepCard({ children, className }: StepCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-border shadow-sm overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

interface StepCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function StepCardHeader({ children, className }: StepCardHeaderProps) {
  return (
    <div className={cn("px-3 sm:px-6 py-6 sm:py-8 border-b border-border", className)}>
      {children}
    </div>
  );
}

interface StepCardContentProps {
  children: ReactNode;
  className?: string;
}

export function StepCardContent({ children, className }: StepCardContentProps) {
  return (
    <div className={cn("px-3 sm:px-6 py-6 sm:py-8", className)}>
      {children}
    </div>
  );
}

interface StepCardTitleProps {
  children: ReactNode;
  className?: string;
}

export function StepCardTitle({ 
  children, 
  className 
}: StepCardTitleProps) {
  return (
    <h2 className={cn("text-xl sm:text-2xl font-medium tracking-tight", className)}>
      {children}
    </h2>
  );
}

interface StepCardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function StepCardDescription({ 
  children, 
  className 
}: StepCardDescriptionProps) {
  return (
    <p className={cn("text-muted-foreground text-sm sm:text-base", className)}>
      Choose how you'd like to work. Select one or both options to help us match you with the best job opportunities and optimize your compensation. While all fields on this page are optional, providing this information helps us match you with the most relevant opportunities.
    </p>
  );
}

interface StepCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function StepCardFooter({ 
  children, 
  className 
}: StepCardFooterProps) {
  return (
    <div className={cn("px-3 sm:px-6 py-6 sm:py-8 border-t border-border", className)}>
      {children}
    </div>
  );
}
