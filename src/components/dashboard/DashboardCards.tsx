
import { useNavigate } from 'react-router-dom';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { User, Briefcase, Image, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const WelcomeCard = () => {
  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Welcome to Your Dashboard</StepCardTitle>
        <StepCardDescription>
          You've completed onboarding! Now you can freely navigate between different sections.
        </StepCardDescription>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm">All onboarding steps completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="whitespace-nowrap">Active</Badge>
          <span className="text-sm text-muted-foreground">Your profile is visible to potential employers</span>
        </div>
      </StepCardContent>
    </StepCard>
  );
};

export const DashboardNavCard = ({ 
  title, 
  description, 
  detailText,
  path,
  icon,
  badgeText,
  badgeVariant = "success",
  completionRate = 100
}: { 
  title: string; 
  description: string;
  detailText: string;
  path: string;
  icon: React.ReactNode;
  badgeText: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success";
  completionRate?: number;
}) => {
  const navigate = useNavigate();
  
  return (
    <StepCard className="h-full transition-all hover:shadow-md">
      <button 
        onClick={() => navigate(path)}
        className="text-left w-full"
      >
        <StepCardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                {icon}
              </div>
              <div>
                <StepCardTitle>{title}</StepCardTitle>
                <div className="mt-1">
                  <Badge variant={badgeVariant} className="whitespace-nowrap">{badgeText}</Badge>
                </div>
              </div>
            </div>
          </div>
          <StepCardDescription>
            {description}
          </StepCardDescription>
        </StepCardHeader>
        
        <StepCardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-1.5" />
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                {detailText}
              </p>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </StepCardContent>
      </button>
    </StepCard>
  );
};

export const DashboardNavGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardNavCard
        title="Profile Setup"
        description="View and edit your professional profile"
        detailText="Update your skills, experience, and personal information"
        path="/dashboard/profile-creation"
        icon={<User className="h-5 w-5 text-primary" />}
        badgeText="Complete"
        completionRate={100}
      />
      
      <DashboardNavCard
        title="Professional Branding"
        description="Enhance your professional presence"
        detailText="Update your portfolio and professional images"
        path="/dashboard/branding"
        icon={<Image className="h-5 w-5 text-primary" />}
        badgeText="Complete"
        completionRate={90}
      />
      
      <DashboardNavCard
        title="AI Job Matching"
        description="View and manage job matches"
        detailText="See opportunities matched to your profile"
        path="/dashboard/job-matching"
        icon={<Briefcase className="h-5 w-5 text-primary" />}
        badgeText="Active"
        completionRate={75}
      />
    </div>
  );
};
