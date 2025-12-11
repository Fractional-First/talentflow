import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { UserPlus, Mail, Shield, FileText, Edit, Briefcase, LayoutDashboard, Play } from 'lucide-react';

const demoSteps = [
  { id: 1, name: 'Sign Up', path: '/demo/signup', icon: UserPlus, description: 'Create an account' },
  { id: 2, name: 'Check Email', path: '/demo/check-email', icon: Mail, description: 'Verify your email' },
  { id: 3, name: 'Identity Verification', path: '/demo/identity-verification', icon: Shield, description: 'Confirm your identity' },
  { id: 4, name: 'Create Profile', path: '/demo/create-profile', icon: FileText, description: 'Upload LinkedIn or resume' },
  { id: 5, name: 'Edit Profile', path: '/demo/edit-profile', icon: Edit, description: 'Review and refine your profile' },
  { id: 6, name: 'Work Preferences', path: '/demo/work-preferences', icon: Briefcase, description: 'Set job preferences' },
  { id: 7, name: 'Dashboard', path: '/demo/dashboard', icon: LayoutDashboard, description: 'Your home base' },
];

export default function DemoIndex() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthBackground />
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Demo Mode</strong> — Preview the complete onboarding experience
          </span>
        </div>

        <BrandHeader />
        
        <Card className="mt-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Onboarding Flow Preview</CardTitle>
            <CardDescription className="text-base">
              Click any step to preview, or start from the beginning
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Start Flow Button */}
            <Button
              onClick={() => navigate('/demo/signup')}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Full Demo Flow
            </Button>

            {/* Steps Grid */}
            <div className="grid gap-3 mt-6">
              {demoSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => navigate(step.path)}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {step.id}
                    </div>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{step.name}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back to App */}
            <Button
              variant="ghost"
              onClick={() => navigate('/agreements')}
              className="w-full mt-4"
            >
              Exit Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
