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
import { ArrowRight, ArrowLeft, Briefcase, Building, MapPin, DollarSign, Sparkles, ThumbsUp, ThumbsDown, Clock, Flag, Calendar, CalendarDays, AlertCircle, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "@/components/ui/use-toast";

const JobMatching = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activelyLooking, setActivelyLooking] = useState(true);
  const [preferredSalary, setPreferredSalary] = useState([75000]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [paymentType, setPaymentType] = useState('annual');
  const [remotePreference, setRemotePreference] = useState(true);
  const [availabilityTab, setAvailabilityTab] = useState('full-time');
  const [startDate, setStartDate] = useState('');
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
  
  const [jobRankings, setJobRankings] = useState<{[key: number]: number | null}>({
    1: null,
    2: null,
    3: null,
    4: null
  });
  
  const allJobsRanked = Object.values(jobRankings).every(rank => rank !== null);
  
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed', estimatedTime: '2-3 minutes' },
    { id: 2, name: 'Profile', description: 'Enter your information', status: 'completed', estimatedTime: '5-7 minutes' },
    { id: 3, name: 'Profile Snapshot', description: 'Review your profile', status: 'completed', estimatedTime: '3-5 minutes' },
    { id: 4, name: 'Agreement', description: 'Sign legal documents', status: 'completed', estimatedTime: '4-6 minutes' },
    { id: 5, name: 'Branding', description: 'Enhance your profile', status: 'completed', estimatedTime: '5-8 minutes' },
    { id: 6, name: 'Job Matching', description: 'Get matched to jobs', status: 'current', estimatedTime: '8-10 minutes' }
  ];
  
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
    },
    {
      id: 4,
      title: 'Associate Product Director',
      company: 'Future Systems',
      location: 'Chicago, IL',
      salary: '$130,000 - $160,000',
      matchScore: 78,
      remote: true
    }
  ];
  
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const handleContinue = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/waiting-room');
    }, 1000);
  };

  const handleJobRanking = (jobId: number, rank: number) => {
    const jobWithThisRank = Object.entries(jobRankings).find(
      ([id, currentRank]) => currentRank === rank && Number(id) !== jobId
    );
    
    const newRankings = { ...jobRankings };
    
    if (jobWithThisRank) {
      const [otherId] = jobWithThisRank;
      newRankings[Number(otherId)] = jobRankings[jobId] || null;
    }
    
    newRankings[jobId] = rank;
    
    setJobRankings(newRankings);
    
    if (Object.values(newRankings).every(r => r !== null) && 
        Object.values(jobRankings).some(r => r === null)) {
      toast({
        title: "Ranking Complete!",
        description: "Thank you for ranking all job opportunities. Your preferences have been recorded.",
      });
    }
  };

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  useState(() => {
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    if (onboardingStatus === 'true') {
      setOnboardingComplete(true);
    }
  });

  return (
    <DashboardLayout steps={steps} currentStep={6}>
      <div className="space-y-6">
        {onboardingComplete && (
          <div className="mb-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        )}
        
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Job Matching Preferences</StepCardTitle>
            <StepCardDescription>
              Configure your job matching preferences to help us find the perfect opportunities for you
            </StepCardDescription>
            <div className="flex items-center mt-2 bg-muted/40 px-3 py-2 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Estimated completion time: <strong>{steps[5].estimatedTime}</strong></span>
            </div>
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
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Compensation Expectations</h3>
                    <p className="text-sm text-muted-foreground">Set your preferred compensation structure</p>
                  </div>
                </div>
                
                <Tabs defaultValue="annual" onValueChange={setPaymentType} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="annual">Annual Salary</TabsTrigger>
                    <TabsTrigger value="daily">Daily Rate</TabsTrigger>
                    <TabsTrigger value="hourly">Hourly Rate</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="annual" className="pt-4">
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
                  </TabsContent>
                  
                  <TabsContent value="daily" className="pt-4">
                    <div className="flex items-center space-x-2 px-4">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Enter your daily rate"
                        value={dailyRate}
                        onChange={(e) => setDailyRate(e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground">per day</span>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hourly" className="pt-4">
                    <div className="flex items-center space-x-2 px-4">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Enter your hourly rate"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground">per hour</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Availability & Schedule</h3>
                    <p className="text-sm text-muted-foreground">Set your work availability preferences</p>
                  </div>
                </div>
                
                <Tabs defaultValue="full-time" onValueChange={setAvailabilityTab} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="full-time">Full-time</TabsTrigger>
                    <TabsTrigger value="part-time">Part-time</TabsTrigger>
                    <TabsTrigger value="contract">Contract</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="full-time" className="pt-4 px-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="start-date" className="text-sm">Earliest Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="max-w-xs"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Working Days Preference</Label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox id={`day-${day}`} defaultChecked />
                              <label htmlFor={`day-${day}`} className="text-sm">{day}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="part-time" className="pt-4 px-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Preferred Days</Label>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox id={`pt-day-${day}`} />
                              <label htmlFor={`pt-day-${day}`} className="text-sm">{day}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Hours Per Week</Label>
                        <Select>
                          <SelectTrigger className="max-w-xs">
                            <SelectValue placeholder="Select hours per week" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-15">10-15 hours</SelectItem>
                            <SelectItem value="16-20">16-20 hours</SelectItem>
                            <SelectItem value="21-30">21-30 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contract" className="pt-4 px-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Contract Duration</Label>
                        <Select>
                          <SelectTrigger className="max-w-xs">
                            <SelectValue placeholder="Select contract duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-3">0-3 months</SelectItem>
                            <SelectItem value="3-6">3-6 months</SelectItem>
                            <SelectItem value="6-12">6-12 months</SelectItem>
                            <SelectItem value="12+">12+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="extension-option" defaultChecked />
                          <Label htmlFor="extension-option" className="text-sm">Interested in contract extensions</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
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
            <StepCardTitle>Job Ranking Simulator</StepCardTitle>
            <StepCardDescription>
              Rank these job opportunities from 1 (most preferred) to 4 (least preferred) to help us understand your preferences
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Preference Analysis</AlertTitle>
              <AlertDescription>
                Your rankings help our AI understand your detailed preferences and improve job matching accuracy.
              </AlertDescription>
            </Alert>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Rank these opportunities based on your interest (1 = most interested)</h3>
                {allJobsRanked ? (
                  <Badge variant="success">Ranking Complete</Badge>
                ) : (
                  <Badge variant="outline">Ranking Incomplete</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {recommendedJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className={`border-2 transition-all duration-300 hover:shadow-md ${
                      jobRankings[job.id] !== null ? 'border-primary/50' : 'border-transparent'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-grow p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              {job.company}
                              <span className="mx-2">•</span>
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {job.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Sparkles className="h-4 w-4 text-primary mr-1" />
                              <span className="font-medium">{job.matchScore}% Match</span>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <DollarSign className="h-3.5 w-3.5 mr-1" />
                              {job.salary}
                            </p>
                          </div>
                        </div>
                        {job.remote && <Badge variant="outline" className="mt-2 text-xs">Remote</Badge>}
                      </div>
                      
                      <div className="p-4 md:border-l border-border flex items-center space-x-6 md:w-[180px] justify-end">
                        <div className="font-medium text-sm">Your Ranking:</div>
                        <Select 
                          value={jobRankings[job.id]?.toString() || ""} 
                          onValueChange={(value) => handleJobRanking(job.id, parseInt(value))}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st</SelectItem>
                            <SelectItem value="2">2nd</SelectItem>
                            <SelectItem value="3">3rd</SelectItem>
                            <SelectItem value="4">4th</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {allJobsRanked && (
              <Alert className="bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Ranking Complete!</AlertTitle>
                <AlertDescription>
                  Thank you for ranking these opportunities. This helps our AI learn your preferences and provide better matches.
                </AlertDescription>
              </Alert>
            )}
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
