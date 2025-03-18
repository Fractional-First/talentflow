
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, ArrowLeft, Briefcase, Building, MapPin, DollarSign, Sparkles, ThumbsUp, ThumbsDown, Clock, Flag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const JobMatching = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activelyLooking, setActivelyLooking] = useState(true);
  const [preferredSalary, setPreferredSalary] = useState([75000]);
  const [remotePreference, setRemotePreference] = useState(true);
  const [locationPreferences, setLocationPreferences] = useState<string[]>([
    'New York',
    'San Francisco',
    'Boston'
  ]);
  const [industryPreferences, setIndustryPreferences] = useState<string[]>([
    'Technology',
    'Finance',
    'Healthcare'
  ]);
  
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Profile Snapshot', description: 'Review your profile', status: 'completed' },
    { id: 4, name: 'Agreement', description: 'Sign legal documents', status: 'completed' },
    { id: 5, name: 'Branding', description: 'Enhance your profile', status: 'completed' },
    { id: 6, name: 'Job Matching', description: 'Get matched to jobs', status: 'current' }
  ];
  
  // Mock job recommendations
  const recommendedJobs = [
    {
      id: 1,
      title: 'Senior Product Manager',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      matchScore: 92,
      remote: true,
      newMatch: true
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateSoft',
      location: 'Boston, MA',
      salary: '$90,000 - $110,000',
      matchScore: 87,
      remote: true
    },
    {
      id: 3,
      title: 'Technical Product Manager',
      company: 'GlobalTech Solutions',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      matchScore: 82,
      remote: false,
      newMatch: true
    }
  ];
  
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const handleContinue = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/waiting-room');
    }, 1000);
  };

  return (
    <DashboardLayout steps={steps} currentStep={6}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Job Matching Preferences</StepCardTitle>
            <StepCardDescription>
              Configure your job matching preferences to help us find the perfect opportunities for you
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Job Search Status</h3>
                    <p className="text-sm text-muted-foreground">Set your current job search status</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="actively-looking" 
                    checked={activelyLooking}
                    onCheckedChange={setActivelyLooking}
                  />
                  <label htmlFor="actively-looking" className="text-sm font-medium">
                    {activelyLooking ? 'Actively Looking' : 'Passively Looking'}
                  </label>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Salary Expectations</h3>
                    <p className="text-sm text-muted-foreground">Set your preferred salary range</p>
                  </div>
                </div>
                
                <div className="px-4">
                  <Slider
                    defaultValue={[75000]}
                    max={200000}
                    min={30000}
                    step={5000}
                    value={preferredSalary}
                    onValueChange={setPreferredSalary}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">$30,000</span>
                    <span className="text-sm font-medium">{formatSalary(preferredSalary[0])}</span>
                    <span className="text-sm text-muted-foreground">$200,000+</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Remote Work Preference</h3>
                    <p className="text-sm text-muted-foreground">Are you interested in remote work?</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="remote-preference" 
                    checked={remotePreference}
                    onCheckedChange={setRemotePreference}
                  />
                  <label htmlFor="remote-preference" className="text-sm font-medium">
                    {remotePreference ? 'Yes' : 'No'}
                  </label>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Location Preferences</h3>
                    <p className="text-sm text-muted-foreground">Select your preferred work locations</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 px-4">
                  {locationPreferences.map(location => (
                    <Badge key={location} variant="outline">
                      {location}
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setLocationPreferences(prev => prev.filter(l => l !== location))}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">+ Add Location</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Industry Preferences</h3>
                    <p className="text-sm text-muted-foreground">Select your preferred industries</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 px-4">
                  {industryPreferences.map(industry => (
                    <Badge key={industry} variant="outline">
                      {industry}
                      <button 
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setIndustryPreferences(prev => prev.filter(i => i !== industry))}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">+ Add Industry</Button>
                </div>
              </div>
            </div>
          </StepCardContent>
        </StepCard>
        
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>AI-Powered Job Recommendations</StepCardTitle>
            <StepCardDescription>
              Based on your profile and preferences, we've found these matching opportunities for you
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="space-y-4">
              {recommendedJobs.map((job, index) => (
                <Card 
                  key={job.id} 
                  className="transition-all duration-300 hover:shadow-medium animate-slide-up relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {job.newMatch && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-md bg-primary">New Match</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {job.company}
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.location}
                          {job.remote && <Badge variant="outline" className="ml-2 text-xs py-0">Remote</Badge>}
                        </CardDescription>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Sparkles className="h-4 w-4 text-primary mr-1" />
                          <span className="font-medium">{job.matchScore}% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <DollarSign className="h-3.5 w-3.5 inline-block" />
                          {job.salary}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${job.matchScore}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm">
                      You match {job.matchScore}% of the requirements for this position based on your skills and experience.
                    </p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                        Not Interested
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Flag className="h-3.5 w-3.5 mr-1" />
                        Save for Later
                      </Button>
                    </div>
                    
                    <Button size="sm" className="h-8">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      Interested
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </StepCardContent>
        </StepCard>
        
        <StepCardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/branding')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Enter Waiting Room'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </StepCardFooter>
      </div>
    </DashboardLayout>
  );
};

export default JobMatching;
