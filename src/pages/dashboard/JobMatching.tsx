
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCardFooter } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { PlacementTypeStep } from '@/components/job-matching/PlacementTypeStep';
import { JobMatchingConfirmation } from '@/components/job-matching/JobMatchingConfirmation';

const JobMatching = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'placement-type' | 'confirmation'>('placement-type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activelyLooking, setActivelyLooking] = useState(true);
  
  // Updated placement type state to handle multiple selections
  const [availabilityTypes, setAvailabilityTypes] = useState({
    fullTime: false,
    fractional: false
  });
  
  // This value is used for backward compatibility with existing components
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
  
  const handleContinue = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep('confirmation');
      // Mark onboarding as complete when reaching confirmation
      localStorage.setItem('onboardingComplete', 'true');
    }, 1000);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  useState(() => {
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    if (onboardingStatus === 'true') {
      setOnboardingComplete(true);
    }
  });

  // Handle selection of placement types and update the backward compatibility variable
  const handleSelectTypes = (types: { fullTime: boolean; fractional: boolean }) => {
    setAvailabilityTypes(types);
    
    // Update the availabilityType for backward compatibility
    if (types.fullTime && types.fractional) {
      // Both selected, default to full-time for legacy components
      setAvailabilityType('full-time');
    } else if (types.fullTime) {
      setAvailabilityType('full-time');
    } else if (types.fractional) {
      setAvailabilityType('fractional');
    }
  };

  const renderStepContent = () => {
    if (currentStep === 'placement-type') {
      return (
        <PlacementTypeStep 
          availabilityTypes={availabilityTypes}
          onSelectTypes={handleSelectTypes}
          onContinue={handleContinue}
          rateRange={rateRange}
          setRateRange={setRateRange}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
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
          remotePreference={remotePreference}
          setRemotePreference={setRemotePreference}
          industryPreferences={industryPreferences}
          setIndustryPreferences={setIndustryPreferences}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          locationPreferences={locationPreferences}
          setLocationPreferences={setLocationPreferences}
          workEligibility={workEligibility}
          setWorkEligibility={setWorkEligibility}
        />
      );
    }

    if (currentStep === 'confirmation') {
      return (
        <JobMatchingConfirmation 
          onGoToDashboard={handleGoToDashboard}
        />
      );
    }
  };

  return (
    <DashboardLayout sidebar={false} className="space-y-6">
      <div className="space-y-6">
        {onboardingComplete && currentStep !== 'confirmation' && (
          <div className="mb-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        )}
        
        {renderStepContent()}
      </div>
    </DashboardLayout>
  );
};

export default JobMatching;
