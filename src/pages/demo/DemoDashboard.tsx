import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  FileText, 
  Shield, 
  Briefcase,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DemoDashboard() {
  const navigate = useNavigate();
  const [confidentialityChecks, setConfidentialityChecks] = useState({
    obligations: false,
    nonCircumvention: false,
    workBoundaries: false,
  });

  const allChecked = Object.values(confidentialityChecks).every(Boolean);

  const handleConfidentialitySubmit = () => {
    if (allChecked) {
      toast.success('Confidentiality agreement accepted! (Demo mode)');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Demo Banner */}
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Step 7 of 7</strong> — Dashboard (Onboarding Complete!)
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, Sarah!</h1>
              <p className="text-muted-foreground">Your onboarding is almost complete</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/demo')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demo Index
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Onboarding Progress
                </CardTitle>
                <CardDescription>You're almost there!</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={85} className="mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Account Created', done: true, icon: User },
                    { label: 'Email Verified', done: true, icon: CheckCircle2 },
                    { label: 'Identity Verified', done: true, icon: Shield },
                    { label: 'Profile Created', done: true, icon: FileText },
                  ].map((step) => (
                    <div 
                      key={step.label}
                      className={`p-3 rounded-lg border ${step.done ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}
                    >
                      <step.icon className={`h-4 w-4 mb-2 ${step.done ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-xs font-medium">{step.label}</p>
                      {step.done && <Badge variant="secondary" className="mt-1 text-xs">Done</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <User className="h-5 w-5 mb-2" />
                  <span className="font-medium">Edit Profile</span>
                  <span className="text-xs text-muted-foreground">Update your information</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <Briefcase className="h-5 w-5 mb-2" />
                  <span className="font-medium">Job Preferences</span>
                  <span className="text-xs text-muted-foreground">Set your criteria</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <ExternalLink className="h-5 w-5 mb-2" />
                  <span className="font-medium">Public Profile</span>
                  <span className="text-xs text-muted-foreground">View & share</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <FileText className="h-5 w-5 mb-2" />
                  <span className="font-medium">Agreements</span>
                  <span className="text-xs text-muted-foreground">View documents</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Confidentiality Checklist Card */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Complete Your Setup</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Accept confidentiality terms to unlock job matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <Checkbox
                      id="obligations"
                      checked={confidentialityChecks.obligations}
                      onCheckedChange={(checked) => 
                        setConfidentialityChecks({ ...confidentialityChecks, obligations: checked === true })
                      }
                    />
                    <Label htmlFor="obligations" className="text-sm cursor-pointer leading-relaxed">
                      I agree to keep all client information confidential
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <Checkbox
                      id="nonCircumvention"
                      checked={confidentialityChecks.nonCircumvention}
                      onCheckedChange={(checked) => 
                        setConfidentialityChecks({ ...confidentialityChecks, nonCircumvention: checked === true })
                      }
                    />
                    <Label htmlFor="nonCircumvention" className="text-sm cursor-pointer leading-relaxed">
                      I agree to the 24-month non-circumvention period
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <Checkbox
                      id="workBoundaries"
                      checked={confidentialityChecks.workBoundaries}
                      onCheckedChange={(checked) => 
                        setConfidentialityChecks({ ...confidentialityChecks, workBoundaries: checked === true })
                      }
                    />
                    <Label htmlFor="workBoundaries" className="text-sm cursor-pointer leading-relaxed">
                      I understand work boundaries and engagement terms
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleConfidentialitySubmit}
                  disabled={!allChecked}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Accept & Enable Matching
                </Button>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Our team is here to help you get started.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
