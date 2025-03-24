
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
import { 
  ArrowRight, ArrowLeft, Briefcase, Building, MapPin, DollarSign, 
  Sparkles, ThumbsUp, ThumbsDown, Clock, Flag, Calendar, 
  CalendarDays, AlertCircle, Home, Info, Globe, HelpCircle
} from 'lucide-react';
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const JobMatching = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activelyLooking, setActivelyLooking] = useState(true);
  const [availabilityType, setAvailabilityType] = useState<'full-time' | 'fractional' | 'interim'>('full-time');
  const [rateRange, setRateRange] = useState([75000, 100000]);
  const [paymentType, setPaymentType] = useState('annual');
  const [remotePreference, setRemotePreference] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('New York, USA');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDays, setSelectedDays] = useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  });
  const [timePreference, setTimePreference] = useState('all-day');
  const [timezone, setTimezone] = useState('EST');
  
  const [locationPreferences, setLocationPreferences] = useState<string[]>([
    'New York',
    'San Francisco',
    'Boston'
  ]);
  
  const [workEligibility, setWorkEligibility] = useState<string[]>([
    'United States',
    'Canada'
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
  
  // Simplified steps - removed Agreement, Branding, and Job Branding
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed', estimatedTime: '2-3 minutes' },
    { id: 2, name: 'Profile', description: 'Enter your information', status: 'completed', estimatedTime: '5-7 minutes' },
    { id: 3, name: 'Profile Snapshot', description: 'Review your profile', status: 'completed', estimatedTime: '3-5 minutes' },
    { id: 4, name: 'Job Matching', description: 'Get matched to jobs', status: 'current', estimatedTime: '8-10 minutes' }
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
    <DashboardLayout steps={steps} currentStep={4}>
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
              <span className="text-sm text-muted-foreground">Estimated completion time: <strong>{steps[3].estimatedTime}</strong></span>
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
                    <p className="text-sm text-muted-foreground">Set your preferred compensation range</p>
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Rate Range</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Set your expected salary range. The lower end applies to higher volume commitments, while the higher end applies to more specialized or shorter-term work.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Slider
                        defaultValue={[75000, 100000]}
                        max={200000}
                        min={30000}
                        step={5000}
                        value={rateRange}
                        onValueChange={setRateRange}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm font-medium">{formatSalary(rateRange[0])}</span>
                        <span className="text-sm font-medium">{formatSalary(rateRange[1])}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Range from {formatSalary(rateRange[0])} to {formatSalary(rateRange[1])}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="daily" className="pt-4">
                    <div className="px-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Daily Rate Range</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Set your expected daily rate range. The lower end applies to longer engagements, while the higher end applies to shorter-term work.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Slider
                        defaultValue={[500, 1000]}
                        max={3000}
                        min={100}
                        step={50}
                        value={[500, 1000]}
                        onValueChange={() => {}}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm font-medium">$500</span>
                        <span className="text-sm font-medium">$1,000</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Range from $500 to $1,000 per day</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hourly" className="pt-4">
                    <div className="px-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Hourly Rate Range</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Set your expected hourly rate range. The lower end applies to higher volume commitments (20+ hours/week), while the higher end applies to specialized or lower volume work.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Slider
                        defaultValue={[75, 150]}
                        max={500}
                        min={25}
                        step={5}
                        value={[75, 150]}
                        onValueChange={() => {}}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm font-medium">$75</span>
                        <span className="text-sm font-medium">$150</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Range from $75 to $150 per hour</p>
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
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="full-time" 
                      checked={availabilityType === 'full-time'}
                      onCheckedChange={() => setAvailabilityType('full-time')}
                    />
                    <div>
                      <Label htmlFor="full-time" className="font-medium">Full-time</Label>
                      <p className="text-sm text-muted-foreground">40 hours per week, dedicated to one company</p>
                    </div>
                  </div>
                  
                  {availabilityType === 'full-time' && (
                    <Accordion type="single" collapsible className="ml-7">
                      <AccordionItem value="start-date">
                        <AccordionTrigger className="text-sm py-2">
                          Specify start date
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <Label htmlFor="ft-start-date" className="text-sm">Earliest Start Date</Label>
                            <Input
                              id="ft-start-date"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="max-w-xs"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fractional" 
                      checked={availabilityType === 'fractional'}
                      onCheckedChange={() => setAvailabilityType('fractional')}
                    />
                    <div>
                      <Label htmlFor="fractional" className="font-medium">Fractional</Label>
                      <p className="text-sm text-muted-foreground">Part-time commitment, may work with multiple companies</p>
                    </div>
                  </div>
                  
                  {availabilityType === 'fractional' && (
                    <Accordion type="single" collapsible className="ml-7">
                      <AccordionItem value="flexibility-options">
                        <AccordionTrigger className="text-sm py-2">
                          Choose flexibility options
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm mb-2 block">Preferred Days</Label>
                              <div className="grid grid-cols-7 gap-2">
                                {Object.entries({
                                  mon: 'Mon',
                                  tue: 'Tue',
                                  wed: 'Wed',
                                  thu: 'Thu',
                                  fri: 'Fri',
                                  sat: 'Sat',
                                  sun: 'Sun'
                                }).map(([key, label]) => (
                                  <div key={key} className="flex flex-col items-center">
                                    <Checkbox 
                                      id={`day-${key}`} 
                                      checked={selectedDays[key as keyof typeof selectedDays]}
                                      onCheckedChange={(checked) => 
                                        setSelectedDays(prev => ({...prev, [key]: checked === true}))}
                                      className="mb-1"
                                    />
                                    <label htmlFor={`day-${key}`} className="text-xs">{label}</label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm mb-2 block">Time Preference</Label>
                              <RadioGroup defaultValue="all-day" value={timePreference} onValueChange={setTimePreference}>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="all-day" id="all-day" />
                                  <Label htmlFor="all-day">All Day</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="mornings" id="mornings" />
                                  <Label htmlFor="mornings">Mornings Only</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="afternoons" id="afternoons" />
                                  <Label htmlFor="afternoons">Afternoons Only</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div>
                              <Label className="text-sm mb-2 block">Timezone</Label>
                              <Select value={timezone} onValueChange={setTimezone}>
                                <SelectTrigger className="max-w-xs">
                                  <SelectValue placeholder="Select your timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EST">Eastern Time (EST/EDT)</SelectItem>
                                  <SelectItem value="CST">Central Time (CST/CDT)</SelectItem>
                                  <SelectItem value="MST">Mountain Time (MST/MDT)</SelectItem>
                                  <SelectItem value="PST">Pacific Time (PST/PDT)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="interim" 
                      checked={availabilityType === 'interim'}
                      onCheckedChange={() => setAvailabilityType('interim')}
                    />
                    <div>
                      <Label htmlFor="interim" className="font-medium">Interim</Label>
                      <p className="text-sm text-muted-foreground">Temporary role with defined start and end dates</p>
                    </div>
                  </div>
                  
                  {availabilityType === 'interim' && (
                    <Accordion type="single" collapsible className="ml-7">
                      <AccordionItem value="date-range">
                        <AccordionTrigger className="text-sm py-2">
                          Set start and end dates
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="int-start-date" className="text-sm">Start Date</Label>
                              <Input
                                id="int-start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="max-w-xs"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="int-end-date" className="text-sm">End Date (Optional)</Label>
                              <Input
                                id="int-end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="max-w-xs"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm block mb-2">Type</Label>
                              <RadioGroup defaultValue="full-time">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="full-time" id="int-full-time" />
                                  <Label htmlFor="int-full-time">Full-time Interim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="fractional" id="int-fractional" />
                                  <Label htmlFor="int-fractional">Fractional Interim</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
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
                    <h3 className="font-medium">Location Information</h3>
                    <p className="text-sm text-muted-foreground">Your current location and work eligibility</p>
                  </div>
                </div>
                
                <div className="space-y-4 px-4">
                  <div>
                    <Label htmlFor="current-location" className="text-sm">Current Location</Label>
                    <Input 
                      id="current-location"
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Legal Work Eligibility</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Select countries where you are legally authorized to work without visa sponsorship.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workEligibility.map(country => (
                        <Badge key={country} variant="outline">
                          {country}
                          <button 
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => setWorkEligibility(prev => prev.filter(c => c !== country))}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">+ Add Country</Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Preferred Work Locations</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Add cities or regions where you prefer to work, if not working remotely.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
            onClick={() => navigate('/dashboard/profile-snapshot')}
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
