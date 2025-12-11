import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { ArrowRight, ArrowLeft, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function DemoWorkPreferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    openToFractional: true,
    openToFullTime: false,
    remoteOnly: true,
    hourlyRate: [150, 300],
    hoursPerWeek: [15, 25],
  });

  const handleSave = () => {
    toast.success('Preferences saved! (Demo mode)');
    navigate('/demo/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthBackground />
      <div className="w-full max-w-xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Step 6 of 7</strong> — Work Preferences
          </span>
        </div>

        <BrandHeader />
        
        <Card className="mt-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Work Preferences</CardTitle>
            <CardDescription className="text-base">
              Tell us about your ideal engagement
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Work Type */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Open to Fractional Work</Label>
                    <p className="text-sm text-muted-foreground">Part-time engagements</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.openToFractional}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, openToFractional: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Open to Full-Time</Label>
                    <p className="text-sm text-muted-foreground">Permanent positions</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.openToFullTime}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, openToFullTime: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Remote Only</Label>
                    <p className="text-sm text-muted-foreground">No on-site requirements</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.remoteOnly}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, remoteOnly: checked })
                  }
                />
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="p-4 rounded-lg border border-border space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Label className="font-medium">Hourly Rate Range</Label>
              </div>
              <Slider
                value={preferences.hourlyRate}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, hourlyRate: value })
                }
                min={50}
                max={500}
                step={25}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${preferences.hourlyRate[0]}/hr</span>
                <span>${preferences.hourlyRate[1]}/hr</span>
              </div>
            </div>

            {/* Hours Per Week */}
            <div className="p-4 rounded-lg border border-border space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label className="font-medium">Hours Per Week</Label>
              </div>
              <Slider
                value={preferences.hoursPerWeek}
                onValueChange={(value) => 
                  setPreferences({ ...preferences, hoursPerWeek: value })
                }
                min={5}
                max={40}
                step={5}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{preferences.hoursPerWeek[0]} hrs/week</span>
                <span>{preferences.hoursPerWeek[1]} hrs/week</span>
              </div>
            </div>

            {/* Actions */}
            <Button onClick={handleSave} className="w-full" size="lg">
              Save Preferences
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/demo/edit-profile')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/demo/dashboard')}
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
