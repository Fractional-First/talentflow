import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { ArrowRight, ArrowLeft, Edit, Check, User, Briefcase, Star, Target } from 'lucide-react';
import { toast } from 'sonner';

const mockProfile = {
  name: 'Sarah Johnson',
  title: 'Fractional CFO & Strategic Finance Leader',
  headline: 'Helping growth-stage companies scale financial operations and achieve profitability',
  superpowers: ['Financial Modeling', 'Fundraising Strategy', 'Board Management', 'M&A Integration'],
  personas: ['CFO', 'VP Finance', 'Finance Advisor'],
  industries: ['SaaS', 'FinTech', 'Healthcare Tech'],
};

export default function DemoEditProfile() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    toast.success('Profile confirmed! (Demo mode)');
    navigate('/demo/work-preferences');
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthBackground />
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Step 5 of 7</strong> — Review & Edit Profile
          </span>
        </div>

        <BrandHeader />
        
        <Card className="mt-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Edit className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Review Your Profile</CardTitle>
            <CardDescription className="text-base">
              We've generated your profile. Review and edit as needed.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Preview */}
            <div className="space-y-4">
              {/* Header Section */}
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{mockProfile.name}</h3>
                  <p className="text-primary font-medium">{mockProfile.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{mockProfile.headline}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* Superpowers */}
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-medium">Superpowers</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.superpowers.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Personas */}
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-medium">Executive Personas</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.personas.map((persona) => (
                    <Badge key={persona} variant="outline">{persona}</Badge>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium">Target Industries</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.industries.map((industry) => (
                    <Badge key={industry} variant="outline">{industry}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button onClick={handleConfirm} className="w-full" size="lg">
              <Check className="mr-2 h-4 w-4" />
              Confirm Profile
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/demo/create-profile')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/demo/work-preferences')}
                className="flex-1"
              >
                Skip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
