
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCardFooter } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';
import JobMatchingPreferencesSection from '@/components/job-matching/JobMatchingPreferencesSection';
import JobRankingSection from '@/components/job-matching/JobRankingSection';
import JobRecommendationsSection from '@/components/job-matching/JobRecommendationsSection';

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
  
  const handleContinue = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/waiting-room');
    }, 1000);
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
        
        <JobMatchingPreferencesSection
          activelyLooking={activelyLooking}
          setActivelyLooking={setActivelyLooking}
          availabilityType={availabilityType}
          setAvailabilityType={setAvailabilityType}
          rateRange={rateRange}
          setRateRange={setRateRange}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          remotePreference={remotePreference}
          setRemotePreference={setRemotePreference}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          timePreference={timePreference}
          setTimePreference={setTimePreference}
          timezone={timezone}
          setTimezone={setTimezone}
          locationPreferences={locationPreferences}
          setLocationPreferences={setLocationPreferences}
          workEligibility={workEligibility}
          setWorkEligibility={setWorkEligibility}
          industryPreferences={industryPreferences}
          setIndustryPreferences={setIndustryPreferences}
          estimatedTime={steps[3].estimatedTime}
        />
        
        <JobRankingSection
          recommendedJobs={recommendedJobs}
          jobRankings={jobRankings}
          setJobRankings={setJobRankings}
        />
        
        <JobRecommendationsSection 
          recommendedJobs={recommendedJobs}
        />
        
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
