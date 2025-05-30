import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, DollarSign, Building, Clock, Briefcase } from "lucide-react";

interface JobPreferencesOnboardingProps {
  onComplete: () => void;
}

export const JobPreferencesOnboarding = ({ onComplete }: JobPreferencesOnboardingProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    desiredRoles: [] as string[],
    workType: '',
    preferredLocations: [] as string[],
    remoteWork: false,
    industries: [] as string[],
    salaryExpectation: '',
    availability: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleAddRole = (role: string) => {
    if (role && !formData.desiredRoles.includes(role)) {
      setFormData(prev => ({
        ...prev,
        desiredRoles: [...prev.desiredRoles, role]
      }));
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      desiredRoles: prev.desiredRoles.filter(r => r !== role)
    }));
  };

  const handleAddLocation = (location: string) => {
    if (location && !formData.preferredLocations.includes(location)) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, location]
      }));
    }
  };

  const handleAddIndustry = (industry: string) => {
    if (industry && !formData.industries.includes(industry)) {
      setFormData(prev => ({
        ...prev,
        industries: [...prev.industries, industry]
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Save preferences to localStorage or API
    localStorage.setItem('jobPreferences', JSON.stringify(formData));
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="role-input">What roles are you interested in?</Label>
              <div className="flex gap-2">
                <Input
                  id="role-input"
                  placeholder="e.g., Product Manager, Senior Developer"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddRole((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('role-input') as HTMLInputElement;
                    handleAddRole(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.desiredRoles.map(role => (
                  <Badge key={role} variant="secondary" className="gap-1">
                    {role}
                    <button onClick={() => handleRemoveRole(role)}>×</button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Work Type Preference</Label>
              <Select value={formData.workType} onValueChange={(value) => setFormData(prev => ({ ...prev, workType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Availability</Label>
              <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="When can you start?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                  <SelectItem value="1-month">1 month</SelectItem>
                  <SelectItem value="3-months">3+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="location-input">Preferred Locations</Label>
              <div className="flex gap-2">
                <Input
                  id="location-input"
                  placeholder="e.g., San Francisco, New York"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddLocation((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('location-input') as HTMLInputElement;
                    handleAddLocation(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredLocations.map(location => (
                  <Badge key={location} variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                    <button onClick={() => setFormData(prev => ({ ...prev, preferredLocations: prev.preferredLocations.filter(l => l !== location) }))}>×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remote-work"
                checked={formData.remoteWork}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remoteWork: checked === true }))}
              />
              <Label htmlFor="remote-work">Open to remote work opportunities</Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="industry-input">Preferred Industries</Label>
              <div className="flex gap-2">
                <Input
                  id="industry-input"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddIndustry((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('industry-input') as HTMLInputElement;
                    handleAddIndustry(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.industries.map(industry => (
                  <Badge key={industry} variant="secondary" className="gap-1">
                    <Building className="h-3 w-3" />
                    {industry}
                    <button onClick={() => setFormData(prev => ({ ...prev, industries: prev.industries.filter(i => i !== industry) }))}>×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="salary">Salary Expectation (Optional)</Label>
              <Select value={formData.salaryExpectation} onValueChange={(value) => setFormData(prev => ({ ...prev, salaryExpectation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select salary range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50k-75k">$50k - $75k</SelectItem>
                  <SelectItem value="75k-100k">$75k - $100k</SelectItem>
                  <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                  <SelectItem value="150k-200k">$150k - $200k</SelectItem>
                  <SelectItem value="200k+">$200k+</SelectItem>
                  <SelectItem value="negotiate">Prefer to negotiate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (step === currentStep) return <div className="h-5 w-5 rounded-full bg-primary" />;
    return <div className="h-5 w-5 rounded-full bg-muted" />;
  };

  const stepTitles = [
    "Desired Roles",
    "Work Type & Availability", 
    "Location Preferences",
    "Industries & Compensation"
  ];

  return (
    <div id="job-preferences-form">
      <StepCard className="shadow-lg border-primary/20">
        <StepCardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <StepCardTitle>Job Preferences</StepCardTitle>
              <StepCardDescription>
                Help us understand what opportunities you're looking for
              </StepCardDescription>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Step indicators */}
            <div className="flex justify-between">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex flex-col items-center gap-2 text-center max-w-24">
                  {getStepIcon(index + 1)}
                  <span className={`text-xs ${index + 1 === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StepCardHeader>

        <StepCardContent>
          <div className="min-h-64">
            {renderStepContent()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button onClick={handleComplete} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Save & Continue
              </Button>
            )}
          </div>
        </StepCardContent>
      </StepCard>
    </div>
  );
};
