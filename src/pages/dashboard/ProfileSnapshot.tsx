import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Pencil,
  WandSparkles,
  Info,
  MapPin,
  Mail,
  Phone,
  Plus,
  Minus,
  Save,
  X,
  Edit,
  History
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { VersionHistorySidebar } from '@/components/profile/VersionHistorySidebar';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { Json } from '@/integrations/supabase/types';

interface ProfileData {
  name?: string;
  role?: string;
  summary?: string;
  location?: string;
  personas?: Array<{
    title: string;
    bullets: string[];
  }>;
  meet_them?: string;
  sweetspot?: string;
  highlights?: string[];
  industries?: string[];
  focus_areas?: string[];
  stage_focus?: string[];
  superpowers?: Array<{
    title: string;
    description: string;
  }>;
  user_manual?: string;
  certifications?: string[];
  non_obvious_role?: {
    title: string;
    description: string;
  };
  functional_skills?: {
    [key: string]: Array<{
      title: string;
      description: string;
    }>;
  };
  personal_interests?: string[];
  geographical_coverage?: string[];
  profilePicture?: string;
}

interface EditStates {
  basicInfo: boolean;
  description: boolean;
  keyRoles: boolean;
  focusAreas: boolean;
  industries: boolean;
  geographicalCoverage: boolean;
  stages: boolean;
  personalInterests: boolean;
  certifications: boolean;
  engagementOptions: boolean;
  meetIntro: boolean;
  personas: boolean;
  superpowers: boolean;
  sweetSpot: boolean;
  userManual: boolean;
  functionalSkills: boolean;
}

const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';

const ProfileSnapshot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [expandedFunctionalSkill, setExpandedFunctionalSkill] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [versionHistorySidebar, setVersionHistorySidebar] = useState<{
    isOpen: boolean;
    fieldName: string;
  }>({ isOpen: false, fieldName: '' });

  const [editStates, setEditStates] = useState<EditStates>({
    basicInfo: false,
    description: false,
    keyRoles: false,
    focusAreas: false,
    industries: false,
    geographicalCoverage: false,
    stages: false,
    personalInterests: false,
    certifications: false,
    engagementOptions: false,
    meetIntro: false,
    personas: false,
    superpowers: false,
    sweetSpot: false,
    userManual: false,
    functionalSkills: false,
  });

  // Fetch profile data from Supabase with more specific query
  const { data: profileDataResponse, isLoading, error } = useQuery({
    queryKey: ['profile-snapshot', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available');
        return null;
      }
      
      console.log('Fetching profile data for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_data, onboarding_status')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Raw profile data from DB:', data);
      
      // Check if we have profile_data and it's not just the onboarding_status
      if (!data || !data.profile_data) {
        console.log('No profile_data found in database');
        return null;
      }
      
      const profileData = data.profile_data as ProfileData;
      console.log('Extracted profile data:', profileData);
      
      // Validate that we have meaningful profile data
      if (!profileData || Object.keys(profileData).length === 0) {
        console.log('Profile data is empty or invalid');
        return null;
      }
      
      return profileData;
    },
    enabled: !!user?.id,
    retry: false, // Don't retry on error to avoid confusion
  });

  const [formData, setFormData] = useState<ProfileData>({});

  // Update formData when profileData is loaded
  useEffect(() => {
    console.log('useEffect triggered - profileDataResponse:', profileDataResponse);
    if (profileDataResponse && typeof profileDataResponse === 'object') {
      console.log('Setting form data from profileDataResponse:', profileDataResponse);
      setFormData(profileDataResponse);
    }
  }, [profileDataResponse]);

  // Debug effect to track formData changes
  useEffect(() => {
    console.log('Current formData state:', formData);
  }, [formData]);

  console.log('Component render - isLoading:', isLoading, 'error:', error, 'profileDataResponse:', profileDataResponse);

  // Helper function to get user initials
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Version history hooks for all text fields
  const descriptionHistory = useVersionHistory({
    fieldName: 'Description',
    initialValue: formData?.summary || ''
  });

  const meetIntroHistory = useVersionHistory({
    fieldName: 'Meet Intro',
    initialValue: formData?.meet_them || ''
  });

  const userManualHistory = useVersionHistory({
    fieldName: 'User Manual',
    initialValue: formData?.user_manual || ''
  });

  const sweetSpotHistory = useVersionHistory({
    fieldName: 'Sweet Spot',
    initialValue: formData?.sweetspot || ''
  });

  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Create Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Review Profile', description: 'Review your profile', status: 'current' }
  ];

  // Show popup on first load
  useEffect(() => {
    const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';
    if (!localStorage.getItem(AIGUIDE_KEY)) setShowAIGuide(true);
  }, []);

  // When guide is dismissed, remember for future visits
  const handleDismissGuide = () => {
    const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';
    localStorage.setItem(AIGUIDE_KEY, 'seen');
    setShowAIGuide(false);
  };

  const toggleEdit = (section: keyof EditStates) => {
    setEditStates(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Update version history for specific fields
    switch (field) {
      case 'summary':
        descriptionHistory.updateValue(value);
        break;
      case 'meet_them':
        meetIntroHistory.updateValue(value);
        break;
      case 'user_manual':
        userManualHistory.updateValue(value);
        break;
      case 'sweetspot':
        sweetSpotHistory.updateValue(value);
        break;
    }
  };

  const handleProfilePictureUpdate = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
    setHasChanges(true);
  };

  const handleArrayChange = (field: keyof ProfileData, index: number, value: string) => {
    const currentArray = formData[field] as string[];
    if (!currentArray) return;
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const addArrayItem = (field: keyof ProfileData) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData(prev => ({ ...prev, [field]: [...currentArray, ''] }));
    setHasChanges(true);
  };

  const removeArrayItem = (field: keyof ProfileData, index: number) => {
    const currentArray = formData[field] as string[];
    if (!currentArray) return;
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const openVersionHistory = (fieldName: string) => {
    setVersionHistorySidebar({ isOpen: true, fieldName });
  };

  const closeVersionHistory = () => {
    setVersionHistorySidebar({ isOpen: false, fieldName: '' });
  };

  const getVersionHistoryHook = (fieldName: string) => {
    switch (fieldName) {
      case 'Description':
        return descriptionHistory;
      case 'Meet Intro':
        return meetIntroHistory;
      case 'User Manual':
        return userManualHistory;
      case 'Sweet Spot':
        return sweetSpotHistory;
      default:
        return descriptionHistory; // fallback
    }
  };

  const handleVersionRevert = (versionId: string) => {
    const hook = getVersionHistoryHook(versionHistorySidebar.fieldName);
    hook.revertToVersion(versionId);
    
    // Update form data based on field
    switch (versionHistorySidebar.fieldName) {
      case 'Description':
        setFormData(prev => ({ ...prev, summary: hook.currentValue }));
        break;
      case 'Meet Intro':
        setFormData(prev => ({ ...prev, meet_them: hook.currentValue }));
        break;
      case 'User Manual':
        setFormData(prev => ({ ...prev, user_manual: hook.currentValue }));
        break;
      case 'Sweet Spot':
        setFormData(prev => ({ ...prev, sweetspot: hook.currentValue }));
        break;
    }
    
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_data: formData as Json })
        .eq('id', user?.id);

      if (error) throw error;

      setHasChanges(false);
      // Turn off all edit modes after saving
      setEditStates({
        basicInfo: false,
        description: false,
        keyRoles: false,
        focusAreas: false,
        industries: false,
        geographicalCoverage: false,
        stages: false,
        personalInterests: false,
        certifications: false,
        engagementOptions: false,
        meetIntro: false,
        personas: false,
        superpowers: false,
        sweetSpot: false,
        userManual: false,
        functionalSkills: false,
      });
      toast({
        title: "Profile Saved",
        description: "Your profile changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardChanges = () => {
    if (profileDataResponse) {
      setFormData(profileDataResponse);
    }
    setHasChanges(false);
    // Turn off all edit modes after discarding
    setEditStates({
      basicInfo: false,
      description: false,
      keyRoles: false,
      focusAreas: false,
      industries: false,
      geographicalCoverage: false,
      stages: false,
      personalInterests: false,
      certifications: false,
      engagementOptions: false,
      meetIntro: false,
      personas: false,
      superpowers: false,
      sweetSpot: false,
      userManual: false,
      functionalSkills: false,
    });
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    
    try {
      // Update onboarding status to completed
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_status: 'PROFILE_CONFIRMED' })
        .eq('id', user?.id);

      if (error) throw error;

      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to complete onboarding.",
        variant: "destructive",
      });
    }
  };

  const toggleFunctionalSkill = (skill: string) => {
    setExpandedFunctionalSkill(expandedFunctionalSkill === skill ? null : skill);
  };

  if (isLoading) {
    return (
      <DashboardLayout steps={steps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.error('Profile query error:', error);
    return (
      <DashboardLayout steps={steps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center text-red-600">
            <p>Error loading profile. Please try again.</p>
            <p className="text-sm mt-2">Error: {error.message}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if we have meaningful profile data
  if (!profileDataResponse || !formData.name) {
    return (
      <DashboardLayout steps={steps} currentStep={3}>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center">
            <p>No profile data found.</p>
            <p className="text-sm text-gray-600 mt-2">Please complete your profile creation first.</p>
            <Button 
              onClick={() => navigate('/dashboard/profile-creation')}
              className="mt-4"
            >
              Go to Profile Creation
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  console.log('Rendering ProfileSnapshot with formData:', formData);

  return (
    <DashboardLayout steps={steps} currentStep={3}>
      {/* AI Guide Dialog */}
      <Dialog open={showAIGuide} onOpenChange={handleDismissGuide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2">
                <WandSparkles className="text-primary h-5 w-5" />
                AI Suggestions for Your Profile
              </span>
            </DialogTitle>
            <DialogDescription>
              Get helpful suggestions based on your uploaded resume or LinkedIn PDF.<br/>
              <span className="mt-1 block">
                These are optional and can help you improve your profile. You have full control and can accept, ignore or dismiss any suggestion.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-primary/5 p-3 rounded text-sm my-2 flex gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <span>
              AI suggestions are based only on the documents and data you provide (such as PDF uploads). No changes are made without your review and approval.
            </span>
          </div>
          <DialogFooter>
            <Button onClick={handleDismissGuide}>Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="relative mb-4 inline-block">
                <Avatar className="h-32 w-32 shadow-lg">
                  <AvatarImage src={formData?.profilePicture} />
                  <AvatarFallback className="text-2xl bg-[#449889] text-white">
                    {getUserInitials(formData?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editStates.basicInfo ? (
                      <Input
                        value={formData?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold text-center"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{formData?.name || 'Name not available'}</h1>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('basicInfo')}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                {editStates.basicInfo ? (
                  <>
                    <Input
                      value={formData?.role || ''}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="text-lg text-center"
                    />
                    <Input
                      value={formData?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="text-sm text-center"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-lg text-gray-700">{formData?.role || 'Role not available'}</p>
                    <p className="text-sm text-gray-500">{formData?.location || 'Location not available'}</p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Description</Label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openVersionHistory('Description')}
                    title="View version history"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('description')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {editStates.description ? (
                <Textarea
                  value={descriptionHistory.currentValue}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  className="text-sm leading-relaxed"
                  rows={6}
                />
              ) : (
                <p className="text-sm leading-relaxed text-gray-700">
                  {descriptionHistory.currentValue || formData?.summary || 'Description not available'}
                </p>
              )}
            </div>

            {/* Key Roles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Key Roles</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('keyRoles')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.keyRoles ? (
                <div className="space-y-2">
                  {(formData?.highlights || []).map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('highlights', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('highlights')}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4" />
                    Add Role
                  </Button>
                </div>
              ) : (
                <ul className="space-y-1">
                  {(formData?.highlights && formData.highlights.length > 0 
                    ? formData.highlights 
                    : ['Key roles not available']
                  ).map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-700">• {highlight}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Focus Areas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Focus Areas</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('focusAreas')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.focusAreas ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(formData?.focus_areas || []).map((area, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={area}
                          onChange={(e) => handleArrayChange('focus_areas', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('focus_areas', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('focus_areas')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Area
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(formData?.focus_areas && formData.focus_areas.length > 0 
                    ? formData.focus_areas 
                    : ['Focus areas not available']
                  ).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Industries */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Industries</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('industries')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.industries ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(formData?.industries || []).map((industry, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={industry}
                          onChange={(e) => handleArrayChange('industries', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('industries', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('industries')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Industry
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(formData?.industries && formData.industries.length > 0 
                    ? formData.industries 
                    : ['Industries not available']
                  ).map((industry, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Geographical Coverage */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Geographical Coverage</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('geographicalCoverage')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.geographicalCoverage ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(formData?.geographical_coverage || []).map((region, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={region}
                          onChange={(e) => handleArrayChange('geographical_coverage', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('geographical_coverage', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('geographical_coverage')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Region
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(formData?.geographical_coverage && formData.geographical_coverage.length > 0 
                    ? formData.geographical_coverage 
                    : ['Geographical coverage not available']
                  ).map((region, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Stage */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Stage</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('stages')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.stages ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(formData?.stage_focus || []).map((stage, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={stage}
                          onChange={(e) => handleArrayChange('stage_focus', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('stage_focus', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('stage_focus')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(formData?.stage_focus && formData.stage_focus.length > 0 
                    ? formData.stage_focus 
                    : ['Stage focus not available']
                  ).map((stage, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {stage}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Personal Interests */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Personal Interests</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('personalInterests')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.personalInterests ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(formData?.personal_interests || []).map((interest, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={interest}
                          onChange={(e) => handleArrayChange('personal_interests', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('personal_interests', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('personal_interests')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interest
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(formData?.personal_interests && formData.personal_interests.length > 0 
                    ? formData.personal_interests 
                    : ['Personal interests not available']
                  ).map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Certifications</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('certifications')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.certifications ? (
                <div className="space-y-2">
                  {(formData?.certifications || []).map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={cert}
                        onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('certifications', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('certifications')}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              ) : (
                <ul className="space-y-1">
                  {(formData?.certifications && formData.certifications.length > 0 
                    ? formData.certifications 
                    : ['Certifications not available']
                  ).map((cert, index) => (
                    <li key={index} className="text-sm text-gray-700">• {cert}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Engagement Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Engagement Options</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEdit('engagementOptions')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {editStates.engagementOptions ? (
                <Textarea
                  value="Engagement options not available"
                  className="text-sm"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-gray-700">Engagement options not available</p>
              )}
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Section */}
            <div className="bg-teal-600 text-white rounded-lg">
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-xl font-semibold">Meet {formData?.name?.split(' ')[0] || 'Professional'}</h2>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openVersionHistory('Meet Intro')}
                    className="text-white hover:bg-white/20"
                    title="View version history"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('meetIntro')}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="px-4 pb-4">
                {editStates.meetIntro ? (
                  <Textarea
                    value={meetIntroHistory.currentValue}
                    onChange={(e) => handleInputChange('meet_them', e.target.value)}
                    className="text-sm leading-relaxed bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm leading-relaxed">
                    {meetIntroHistory.currentValue || formData?.meet_them || 'Introduction not available'}
                  </p>
                )}
              </div>
            </div>

            {/* Personas Section */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="bg-[#449889] text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Personas</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('personas')}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                {formData?.personas && formData.personas.length > 0 ? (
                  <Tabs defaultValue="0" className="w-full">
                    <TabsList className="grid w-full mb-6 bg-gray-100" style={{gridTemplateColumns: `repeat(${formData.personas.length}, minmax(0, 1fr))`}}>
                      {formData.personas.map((persona, index) => (
                        <TabsTrigger 
                          key={index} 
                          value={index.toString()} 
                          className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                        >
                          {persona.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {formData.personas.map((persona, index) => (
                      <TabsContent key={index} value={index.toString()} className="space-y-4">
                        <h4 className="font-medium">{persona.title}</h4>
                        <div className="text-sm leading-relaxed text-gray-700">
                          <ul className="space-y-2">
                            {persona.bullets?.map((bullet, bulletIndex) => (
                              <li key={bulletIndex}>• {bullet}</li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="text-sm text-gray-700">Personas not available</div>
                )}
              </div>
            </div>

            {/* Superpowers Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Superpowers</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('superpowers')}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  {formData?.superpowers && formData.superpowers.length > 0 ? (
                    formData.superpowers.map((superpower, index) => (
                      <div key={index}>
                        <Label className="font-medium text-gray-900">{superpower.title}</Label>
                        <p className="text-sm text-gray-700">{superpower.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-700">Superpowers not available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Sweet Spot Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Sweet Spot</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openVersionHistory('Sweet Spot')}
                      className="text-white hover:bg-white/20"
                      title="View version history"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEdit('sweetSpot')}
                      className="text-white hover:bg-white/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {editStates.sweetSpot ? (
                  <Textarea
                    value={sweetSpotHistory.currentValue}
                    onChange={(e) => handleInputChange('sweetspot', e.target.value)}
                    className="text-sm leading-relaxed"
                    rows={4}
                  />
                ) : (
                  <div className="text-sm leading-relaxed text-gray-700">
                    {sweetSpotHistory.currentValue || formData?.sweetspot || 'Sweet spot not available'}
                  </div>
                )}
              </div>
            </div>

            {/* Functional Skills */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Functional Skills</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('functionalSkills')}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {formData?.functional_skills && Object.keys(formData.functional_skills).length > 0 ? (
                  Object.entries(formData.functional_skills).map(([categoryName, skills]) => (
                    <div key={categoryName} className="border-b border-gray-200 pb-3">
                      <button 
                        className="flex justify-between items-center w-full text-left"
                        onClick={() => toggleFunctionalSkill(categoryName)}
                      >
                        <span className="font-medium text-gray-900">{categoryName}</span>
                        {expandedFunctionalSkill === categoryName ? 
                          <Minus className="h-5 w-5 text-gray-400" /> : 
                          <Plus className="h-5 w-5 text-gray-400" />
                        }
                      </button>
                      
                      {expandedFunctionalSkill === categoryName && (
                        <div className="mt-3 space-y-3">
                          <div className="space-y-2">
                            {skills?.map((skill, index) => (
                              <div key={index}>
                                <h5 className="font-medium text-sm">{skill.title}</h5>
                                <p className="text-sm text-gray-700">{skill.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-700">Functional skills not available</div>
                )}
              </div>
            </div>

            {/* User Manual */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">{formData?.name?.split(' ')[0] || 'Professional'}'s User Manual</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openVersionHistory('User Manual')}
                      className="text-white hover:bg-white/20"
                      title="View version history"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEdit('userManual')}
                      className="text-white hover:bg-white/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {editStates.userManual ? (
                  <Textarea
                    value={userManualHistory.currentValue}
                    onChange={(e) => handleInputChange('user_manual', e.target.value)}
                    className="text-sm leading-relaxed"
                    rows={8}
                  />
                ) : (
                  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {userManualHistory.currentValue || formData?.user_manual || 'User manual not available'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save/Discard Buttons */}
        {hasChanges && (
          <div className="flex justify-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Discard Changes
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/profile-creation')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSubmitting ? 'Processing...' : 'Complete & Go to Dashboard'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Version History Sidebar */}
      <VersionHistorySidebar
        isOpen={versionHistorySidebar.isOpen}
        onClose={closeVersionHistory}
        fieldName={versionHistorySidebar.fieldName}
        versions={getVersionHistoryHook(versionHistorySidebar.fieldName).versions}
        currentVersionId={getVersionHistoryHook(versionHistorySidebar.fieldName).currentVersionId}
        onRevert={handleVersionRevert}
        onSaveVersion={(summary) => getVersionHistoryHook(versionHistorySidebar.fieldName).saveVersion(summary)}
        onRenameVersion={(versionId, newSummary) => getVersionHistoryHook(versionHistorySidebar.fieldName).renameVersion(versionId, newSummary)}
      />
    </DashboardLayout>
  );
};

export default ProfileSnapshot;
