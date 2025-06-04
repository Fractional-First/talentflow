import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Save,
  X,
  Edit,
  History,
  WandSparkles,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { VersionHistorySidebar } from '@/components/profile/VersionHistorySidebar';
import { useVersionHistory } from '@/hooks/useVersionHistory';

interface ProfileData {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  keyRoles: string[];
  focusAreas: string[];
  industries: string[];
  geographicalCoverage: string[];
  stages: string[];
  personalInterests: string[];
  certifications: string[];
  engagementOptions: string;
  meetIntro: string;
  growthArchitectContent: string;
  ventureBuilderContent: string;
  leadershipStewardContent: string;
  strategicProblemSolving: string;
  consciousLeadership: string;
  scalingVentures: string;
  sweetSpotContent: string;
  userManual: string;
  profilePicture?: string;
  superpowerTitles: {
    strategicProblemSolving: string;
    consciousLeadership: string;
    scalingVentures: string;
  };
  functionalSkillTitles: {
    marketExpansion: string;
    operationalEfficiency: string;
    leadershipDevelopment: string;
  };
  functionalSkills: {
    marketExpansion: string[];
    operationalEfficiency: string[];
    leadershipDevelopment: string[];
  };
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
  superpowerTitles: boolean;
  functionalSkillTitles: boolean;
}

const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';

const ProfileSnapshot = () => {
  const navigate = useNavigate();
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
    superpowerTitles: false,
    functionalSkillTitles: false,
  });

  const [originalData] = useState<ProfileData>({
    name: 'Reza Behnam',
    title: 'Venture Builder, CEO',
    subtitle: 'Holistic Leadership Coach',
    location: 'Based in Southeast Asia',
    description: 'Reza is a seasoned, visionary venture builder and CEO with a proven track record of scaling startups and transforming enterprises in Southeast Asia and the US. He\'s a strategic problem-solver and an efficient operator with innovation and inspiration. With expertise in both entrepreneurship and leadership coaching, Reza empowers executives to integrate mindfulness and purpose into their organizations, fostering resilience and long-term success.',
    keyRoles: [
      'Founder/CEO, multiple B2B startups',
      'Venture Builder and APAC GTM Leader, Mach49',
      'Managing Director, Yahoo! SE Asia',
      'Venture Architect/Strategist, Vivint Corp',
      'Data Science, Strategy and FP&A Leader, Intel Corp'
    ],
    focusAreas: ['Strategy', 'Venture Building', 'Biz Transformation', 'Execution', 'Coaching', 'Startup Scaling', 'Mentorship'],
    industries: ['Tech', 'VC', 'Digital Media', 'Leadership Coaching'],
    geographicalCoverage: ['Southeast Asia', 'United States', 'Middle East'],
    stages: ['Enterprise', 'Early Stage', 'Seed', 'Growth'],
    personalInterests: ['Travel', 'Polo', 'Mindfulness', 'Philosophy'],
    certifications: ['Yoga and Meditation Teacher', 'Coaching'],
    engagementOptions: 'Fractional, Interim, Coach/Mentor',
    meetIntro: 'Hello, I\'m Reza! Over the years, I\'ve built and scaled successful ventures, transformed businesses, and coached leaders to realize their potential. I\'m passionate about blending business growth with conscious leadership where people are treated as a whole. When I\'m not guiding ventures or building new companies, you\'ll find me practicing mindfulness or enjoying polo, a sport that connects me to my Persian heritage.',
    growthArchitectContent: 'Reza is a dynamic leader with a unique blend of strategic vision and operational excellence, driving growth and innovation across Southeast Asia.\n\n• Startup Leader: Led and scaled startups across Southeast Asia to successful exits, while serving as VC Partner, Operator, and Strategic Consultant.\n• Expansion Specialist: Orchestrated Yahoo!\'s expansion into six new Southeast Asian markets, unlocking regional opportunities.\n• Value Creator: Delivered measurable impact through strategic leadership and operational excellence across startups and established enterprises.\n• Sustainability Advocate: Integrating analytical thinking with mindful-based coaching to support sustainable growth and conscious leadership.',
    ventureBuilderContent: 'Content for Venture Builder persona will be displayed here.',
    leadershipStewardContent: 'Content for Leadership / Cultural Steward persona will be displayed here.',
    strategicProblemSolving: 'Connecting the dots. Crafting insights and tactical thinking. Driving business revenue growth and brand presence.',
    consciousLeadership: 'Mentoring leaders, integrating mindful leadership practices that enhance connection, productivity, positivity and organizational culture.',
    scalingVentures: 'Leading startups, corporate ventures through planning, fundraising, governance, scaling, professionalization, optimization and, ultimately, exits.',
    sweetSpotContent: 'Content for Sweet Spot will be displayed here.',
    userManual: 'Reza values direct communication, transparency, and early alignment on goals. He thrives in environments where challenges are addressed proactively and discussions are data-driven. Balancing creativity with analytical rigor, Reza integrates human-centric leadership with strategic execution to achieve impactful outcomes.\n\nReza\'s Ways of Working: He\'s at his best as part of high-IQ, high EQ teams. His art manifests in human interactions, leadership, the creativity of plans, design, communication, persuasion, and inspiration. The science manifests in data-backed analysis, planning and decision-making. The art requires space and freedom to explore.\n\nReza is a passionate, purpose-driven leader who values self-awareness and modeling through behavior. He works best with people who are respectful and self-aware.',
    profilePicture: '/lovable-uploads/06e0df8d-b26a-472b-b073-64583b551789.png',
    superpowerTitles: {
      strategicProblemSolving: 'Strategic Problem-Solving',
      consciousLeadership: 'Conscious Leadership',
      scalingVentures: 'Scaling Ventures'
    },
    functionalSkillTitles: {
      marketExpansion: 'Market Expansion Strategy',
      operationalEfficiency: 'Operational Efficiency',
      leadershipDevelopment: 'Leadership Development'
    },
    functionalSkills: {
      marketExpansion: [
        '• Market Entry Expertise: Designed and executed strategies that expanded Yahoo\'s presence across six new countries in Southeast Asia.',
        '• Scaling Across Borders: Guided startups and enterprises to navigate complex regulatory, cultural, and operational challenges when entering new regions.',
        '• Tailored Strategies: Develops bespoke go-to-market plans that align with business objectives, leveraging local insights and global trends.',
        '• Partnership Development: Establishes strategic alliances and partnerships to drive growth and strengthen market positioning.'
      ],
      operationalEfficiency: [],
      leadershipDevelopment: []
    }
  });

  const [formData, setFormData] = useState<ProfileData>(originalData);

  // Version history hooks for all text fields
  const descriptionHistory = useVersionHistory({
    fieldName: 'Description',
    initialValue: originalData.description
  });

  const meetIntroHistory = useVersionHistory({
    fieldName: 'Meet Intro',
    initialValue: originalData.meetIntro
  });

  const userManualHistory = useVersionHistory({
    fieldName: 'User Manual',
    initialValue: originalData.userManual
  });

  const growthArchitectHistory = useVersionHistory({
    fieldName: 'Growth Architect',
    initialValue: originalData.growthArchitectContent
  });

  const ventureBuilderHistory = useVersionHistory({
    fieldName: 'Venture Builder',
    initialValue: originalData.ventureBuilderContent
  });

  const leadershipStewardHistory = useVersionHistory({
    fieldName: 'Leadership Steward',
    initialValue: originalData.leadershipStewardContent
  });

  const strategicProblemSolvingHistory = useVersionHistory({
    fieldName: 'Strategic Problem Solving',
    initialValue: originalData.strategicProblemSolving
  });

  const consciousLeadershipHistory = useVersionHistory({
    fieldName: 'Conscious Leadership',
    initialValue: originalData.consciousLeadership
  });

  const scalingVenturesHistory = useVersionHistory({
    fieldName: 'Scaling Ventures',
    initialValue: originalData.scalingVentures
  });

  const sweetSpotHistory = useVersionHistory({
    fieldName: 'Sweet Spot',
    initialValue: originalData.sweetSpotContent
  });

  const engagementOptionsHistory = useVersionHistory({
    fieldName: 'Engagement Options',
    initialValue: originalData.engagementOptions
  });

  // Version history hooks for superpower titles
  const strategicProblemSolvingTitleHistory = useVersionHistory({
    fieldName: 'Strategic Problem-Solving Title',
    initialValue: originalData.superpowerTitles.strategicProblemSolving
  });

  const consciousLeadershipTitleHistory = useVersionHistory({
    fieldName: 'Conscious Leadership Title',
    initialValue: originalData.superpowerTitles.consciousLeadership
  });

  const scalingVenturesTitleHistory = useVersionHistory({
    fieldName: 'Scaling Ventures Title',
    initialValue: originalData.superpowerTitles.scalingVentures
  });

  // Version history hooks for functional skill titles
  const marketExpansionTitleHistory = useVersionHistory({
    fieldName: 'Market Expansion Title',
    initialValue: originalData.functionalSkillTitles.marketExpansion
  });

  const operationalEfficiencyTitleHistory = useVersionHistory({
    fieldName: 'Operational Efficiency Title',
    initialValue: originalData.functionalSkillTitles.operationalEfficiency
  });

  const leadershipDevelopmentTitleHistory = useVersionHistory({
    fieldName: 'Leadership Development Title',
    initialValue: originalData.functionalSkillTitles.leadershipDevelopment
  });

  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Create Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Review Profile', description: 'Review your profile', status: 'current' }
  ];

  useEffect(() => {
    if (!localStorage.getItem(AIGUIDE_KEY)) setShowAIGuide(true);
  }, []);

  const handleDismissGuide = () => {
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
      case 'description':
        descriptionHistory.updateValue(value);
        break;
      case 'meetIntro':
        meetIntroHistory.updateValue(value);
        break;
      case 'userManual':
        userManualHistory.updateValue(value);
        break;
      case 'growthArchitectContent':
        growthArchitectHistory.updateValue(value);
        break;
      case 'ventureBuilderContent':
        ventureBuilderHistory.updateValue(value);
        break;
      case 'leadershipStewardContent':
        leadershipStewardHistory.updateValue(value);
        break;
      case 'strategicProblemSolving':
        strategicProblemSolvingHistory.updateValue(value);
        break;
      case 'consciousLeadership':
        consciousLeadershipHistory.updateValue(value);
        break;
      case 'scalingVentures':
        scalingVenturesHistory.updateValue(value);
        break;
      case 'sweetSpotContent':
        sweetSpotHistory.updateValue(value);
        break;
      case 'engagementOptions':
        engagementOptionsHistory.updateValue(value);
        break;
    }
  };

  const handleSuperpowerTitleChange = (titleKey: keyof ProfileData['superpowerTitles'], value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      superpowerTitles: { 
        ...prev.superpowerTitles, 
        [titleKey]: value 
      } 
    }));
    setHasChanges(true);

    // Update version history for title changes
    switch (titleKey) {
      case 'strategicProblemSolving':
        strategicProblemSolvingTitleHistory.updateValue(value);
        break;
      case 'consciousLeadership':
        consciousLeadershipTitleHistory.updateValue(value);
        break;
      case 'scalingVentures':
        scalingVenturesTitleHistory.updateValue(value);
        break;
    }
  };

  const handleFunctionalSkillTitleChange = (titleKey: keyof ProfileData['functionalSkillTitles'], value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      functionalSkillTitles: { 
        ...prev.functionalSkillTitles, 
        [titleKey]: value 
      } 
    }));
    setHasChanges(true);

    // Update version history for title changes
    switch (titleKey) {
      case 'marketExpansion':
        marketExpansionTitleHistory.updateValue(value);
        break;
      case 'operationalEfficiency':
        operationalEfficiencyTitleHistory.updateValue(value);
        break;
      case 'leadershipDevelopment':
        leadershipDevelopmentTitleHistory.updateValue(value);
        break;
    }
  };

  const handleProfilePictureUpdate = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
    setHasChanges(true);
  };

  const handleArrayChange = (field: keyof ProfileData, index: number, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
    setHasChanges(true);
  };

  const addArrayItem = (field: keyof ProfileData) => {
    const currentArray = formData[field] as string[];
    setFormData(prev => ({ ...prev, [field]: [...currentArray, ''] }));
    setHasChanges(true);
  };

  const removeArrayItem = (field: keyof ProfileData, index: number) => {
    const currentArray = formData[field] as string[];
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
      case 'Growth Architect':
        return growthArchitectHistory;
      case 'Venture Builder':
        return ventureBuilderHistory;
      case 'Leadership Steward':
        return leadershipStewardHistory;
      case 'Strategic Problem Solving':
        return strategicProblemSolvingHistory;
      case 'Conscious Leadership':
        return consciousLeadershipHistory;
      case 'Scaling Ventures':
        return scalingVenturesHistory;
      case 'Sweet Spot':
        return sweetSpotHistory;
      case 'Engagement Options':
        return engagementOptionsHistory;
      case 'Strategic Problem-Solving Title':
        return strategicProblemSolvingTitleHistory;
      case 'Conscious Leadership Title':
        return consciousLeadershipTitleHistory;
      case 'Scaling Ventures Title':
        return scalingVenturesTitleHistory;
      case 'Market Expansion Title':
        return marketExpansionTitleHistory;
      case 'Operational Efficiency Title':
        return operationalEfficiencyTitleHistory;
      case 'Leadership Development Title':
        return leadershipDevelopmentTitleHistory;
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
        setFormData(prev => ({ ...prev, description: hook.currentValue }));
        break;
      case 'Meet Intro':
        setFormData(prev => ({ ...prev, meetIntro: hook.currentValue }));
        break;
      case 'User Manual':
        setFormData(prev => ({ ...prev, userManual: hook.currentValue }));
        break;
      case 'Growth Architect':
        setFormData(prev => ({ ...prev, growthArchitectContent: hook.currentValue }));
        break;
      case 'Venture Builder':
        setFormData(prev => ({ ...prev, ventureBuilderContent: hook.currentValue }));
        break;
      case 'Leadership Steward':
        setFormData(prev => ({ ...prev, leadershipStewardContent: hook.currentValue }));
        break;
      case 'Strategic Problem Solving':
        setFormData(prev => ({ ...prev, strategicProblemSolving: hook.currentValue }));
        break;
      case 'Conscious Leadership':
        setFormData(prev => ({ ...prev, consciousLeadership: hook.currentValue }));
        break;
      case 'Scaling Ventures':
        setFormData(prev => ({ ...prev, scalingVentures: hook.currentValue }));
        break;
      case 'Sweet Spot':
        setFormData(prev => ({ ...prev, sweetSpotContent: hook.currentValue }));
        break;
      case 'Engagement Options':
        setFormData(prev => ({ ...prev, engagementOptions: hook.currentValue }));
        break;
      case 'Strategic Problem-Solving Title':
        setFormData(prev => ({ 
          ...prev, 
          superpowerTitles: { 
            ...prev.superpowerTitles, 
            strategicProblemSolving: hook.currentValue 
          } 
        }));
        break;
      case 'Conscious Leadership Title':
        setFormData(prev => ({ 
          ...prev, 
          superpowerTitles: { 
            ...prev.superpowerTitles, 
            consciousLeadership: hook.currentValue 
          } 
        }));
        break;
      case 'Scaling Ventures Title':
        setFormData(prev => ({ 
          ...prev, 
          superpowerTitles: { 
            ...prev.superpowerTitles, 
            scalingVentures: hook.currentValue 
          } 
        }));
        break;
      case 'Market Expansion Title':
        setFormData(prev => ({ 
          ...prev, 
          functionalSkillTitles: { 
            ...prev.functionalSkillTitles, 
            marketExpansion: hook.currentValue 
          } 
        }));
        break;
      case 'Operational Efficiency Title':
        setFormData(prev => ({ 
          ...prev, 
          functionalSkillTitles: { 
            ...prev.functionalSkillTitles, 
            operationalEfficiency: hook.currentValue 
          } 
        }));
        break;
      case 'Leadership Development Title':
        setFormData(prev => ({ 
          ...prev, 
          functionalSkillTitles: { 
            ...prev.functionalSkillTitles, 
            leadershipDevelopment: hook.currentValue 
          } 
        }));
        break;
    }
    
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSubmitting(true);
    
    // Simulate save operation
    setTimeout(() => {
      setIsSubmitting(false);
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
        superpowerTitles: false,
        functionalSkillTitles: false,
      });
      toast({
        title: "Profile Saved",
        description: "Your profile changes have been saved successfully.",
      });
    }, 1000);
  };

  const handleDiscardChanges = () => {
    setFormData(originalData);
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
      superpowerTitles: false,
      functionalSkillTitles: false,
    });
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  const handleContinue = () => {
    setIsSubmitting(true);
    
    // Mark onboarding as complete and navigate to dashboard
    localStorage.setItem('onboardingComplete', 'true');
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

  const toggleFunctionalSkill = (skill: string) => {
    setExpandedFunctionalSkill(expandedFunctionalSkill === skill ? null : skill);
  };

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
                <ProfilePictureUpload
                  currentImage={formData.profilePicture}
                  userName={formData.name}
                  onImageUpdate={handleProfilePictureUpdate}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editStates.basicInfo ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold text-center"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{formData.name}</h1>
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
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-lg text-center"
                    />
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      className="text-sm text-center"
                    />
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="text-sm text-center"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-lg text-gray-700">{formData.title}</p>
                    <p className="text-sm text-gray-600">{formData.subtitle}</p>
                    <p className="text-sm text-gray-500">{formData.location}</p>
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="text-sm leading-relaxed"
                  rows={6}
                />
              ) : (
                <p className="text-sm leading-relaxed text-gray-700">{descriptionHistory.currentValue}</p>
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
                  {formData.keyRoles.map((role, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={role}
                        onChange={(e) => handleArrayChange('keyRoles', index, e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('keyRoles', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('keyRoles')}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              ) : (
                <ul className="space-y-1">
                  {formData.keyRoles.map((role, index) => (
                    <li key={index} className="text-sm text-gray-700">• {role}</li>
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
                    {formData.focusAreas.map((area, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={area}
                          onChange={(e) => handleArrayChange('focusAreas', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('focusAreas', index)}
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
                    onClick={() => addArrayItem('focusAreas')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Area
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.focusAreas.map((area, index) => (
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
                    {formData.industries.map((industry, index) => (
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
                  {formData.industries.map((industry, index) => (
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
                    {formData.geographicalCoverage.map((region, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={region}
                          onChange={(e) => handleArrayChange('geographicalCoverage', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('geographicalCoverage', index)}
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
                    onClick={() => addArrayItem('geographicalCoverage')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Region
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.geographicalCoverage.map((region, index) => (
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
                    {formData.stages.map((stage, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={stage}
                          onChange={(e) => handleArrayChange('stages', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('stages', index)}
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
                    onClick={() => addArrayItem('stages')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.stages.map((stage, index) => (
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
                    {formData.personalInterests.map((interest, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Input
                          value={interest}
                          onChange={(e) => handleArrayChange('personalInterests', index, e.target.value)}
                          className="text-xs h-8 w-32"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('personalInterests', index)}
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
                    onClick={() => addArrayItem('personalInterests')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interest
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.personalInterests.map((interest, index) => (
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
                  {formData.certifications.map((cert, index) => (
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
                  {formData.certifications.map((cert, index) => (
                    <li key={index} className="text-sm text-gray-700">• {cert}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Engagement Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Engagement Options</Label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openVersionHistory('Engagement Options')}
                    title="View version history"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEdit('engagementOptions')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {editStates.engagementOptions ? (
                <Textarea
                  value={engagementOptionsHistory.currentValue}
                  onChange={(e) => handleInputChange('engagementOptions', e.target.value)}
                  className="text-sm"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-gray-700">{engagementOptionsHistory.currentValue}</p>
              )}
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Reza Section */}
            <div className="bg-teal-600 text-white rounded-lg">
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-xl font-semibold">Meet Reza</h2>
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
                    onChange={(e) => handleInputChange('meetIntro', e.target.value)}
                    className="text-sm leading-relaxed bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{meetIntroHistory.currentValue}</p>
                )}
              </div>
            </div>

            {/* Personas Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
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
                <Tabs defaultValue="growth-architect" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="growth-architect" className="text-xs">Growth Architect</TabsTrigger>
                    <TabsTrigger value="venture-builder" className="text-xs">Venture Builder</TabsTrigger>
                    <TabsTrigger value="leadership-steward" className="text-xs">Leadership / Cultural Steward</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="growth-architect" className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Growth Architect</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openVersionHistory('Growth Architect')}
                        title="View version history"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                    {editStates.personas ? (
                      <Textarea
                        value={growthArchitectHistory.currentValue}
                        onChange={(e) => handleInputChange('growthArchitectContent', e.target.value)}
                        className="text-sm leading-relaxed"
                        rows={8}
                      />
                    ) : (
                      <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                        {growthArchitectHistory.currentValue}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="venture-builder" className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Venture Builder</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openVersionHistory('Venture Builder')}
                        title="View version history"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                    {editStates.personas ? (
                      <Textarea
                        value={ventureBuilderHistory.currentValue}
                        onChange={(e) => handleInputChange('ventureBuilderContent', e.target.value)}
                        className="text-sm leading-relaxed"
                        rows={4}
                      />
                    ) : (
                      <div className="text-sm leading-relaxed text-gray-700">
                        {ventureBuilderHistory.currentValue}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="leadership-steward" className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Leadership / Cultural Steward</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openVersionHistory('Leadership Steward')}
                        title="View version history"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                    {editStates.personas ? (
                      <Textarea
                        value={leadershipStewardHistory.currentValue}
                        onChange={(e) => handleInputChange('leadershipStewardContent', e.target.value)}
                        className="text-sm leading-relaxed"
                        rows={4}
                      />
                    ) : (
                      <div className="text-sm leading-relaxed text-gray-700">
                        {leadershipStewardHistory.currentValue}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Superpowers Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Superpowers</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEdit('superpowerTitles')}
                      className="text-white hover:bg-white/20"
                      title="Edit titles"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {editStates.superpowerTitles ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={strategicProblemSolvingTitleHistory.currentValue}
                            onChange={(e) => handleSuperpowerTitleChange('strategicProblemSolving', e.target.value)}
                            className="font-medium text-gray-900"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVersionHistory('Strategic Problem-Solving Title')}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Label className="font-medium text-gray-900">{strategicProblemSolvingTitleHistory.currentValue}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVersionHistory('Strategic Problem Solving')}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {editStates.superpowers ? (
                      <Textarea
                        value={strategicProblemSolvingHistory.currentValue}
                        onChange={(e) => handleInputChange('strategicProblemSolving', e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{strategicProblemSolvingHistory.currentValue}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {editStates.superpowerTitles ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={consciousLeadershipTitleHistory.currentValue}
                            onChange={(e) => handleSuperpowerTitleChange('consciousLeadership', e.target.value)}
                            className="font-medium text-gray-900"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVersionHistory('Conscious Leadership Title')}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Label className="font-medium text-gray-900">{consciousLeadershipTitleHistory.currentValue}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVersionHistory('Conscious Leadership')}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {editStates.superpowers ? (
                      <Textarea
                        value={consciousLeadershipHistory.currentValue}
                        onChange={(e) => handleInputChange('consciousLeadership', e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{consciousLeadershipHistory.currentValue}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {editStates.superpowerTitles ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={scalingVenturesTitleHistory.currentValue}
                            onChange={(e) => handleSuperpowerTitleChange('scalingVentures', e.target.value)}
                            className="font-medium text-gray-900"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVersionHistory('Scaling Ventures Title')}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Label className="font-medium text-gray-900">{scalingVenturesTitleHistory.currentValue}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openVersionHistory('Scaling Ventures')}
                            title="View version history"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {editStates.superpowers ? (
                      <Textarea
                        value={scalingVenturesHistory.currentValue}
                        onChange={(e) => handleInputChange('scalingVentures', e.target.value)}
                        className="text-sm"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{scalingVenturesHistory.currentValue}</p>
                    )}
                  </div>
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
                    onChange={(e) => handleInputChange('sweetSpotContent', e.target.value)}
                    className="text-sm leading-relaxed"
                    rows={4}
                  />
                ) : (
                  <div className="text-sm leading-relaxed text-gray-700">
                    {sweetSpotHistory.currentValue}
                  </div>
                )}
              </div>
            </div>

            {/* Functional Skills */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Functional Skills</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEdit('functionalSkillTitles')}
                      className="text-white hover:bg-white/20"
                      title="Edit titles"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
              </div>
              
              <div className="p-4 space-y-3">
                {/* Market Expansion Strategy */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFunctionalSkill('market-expansion')}
                  >
                    {editStates.functionalSkillTitles ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={marketExpansionTitleHistory.currentValue}
                          onChange={(e) => handleFunctionalSkillTitleChange('marketExpansion', e.target.value)}
                          className="font-medium text-gray-900"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVersionHistory('Market Expansion Title');
                          }}
                          title="View version history"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">{marketExpansionTitleHistory.currentValue}</span>
                    )}
                    {expandedFunctionalSkill === 'market-expansion' ? 
                      <Minus className="h-5 w-5 text-gray-400" /> : 
                      <Plus className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                  
                  {expandedFunctionalSkill === 'market-expansion' && (
                    <div className="mt-3 space-y-3">
                      {editStates.functionalSkills ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Market Expansion Skills</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSkills = [...formData.functionalSkills.marketExpansion, ''];
                                setFormData(prev => ({ 
                                  ...prev, 
                                  functionalSkills: { 
                                    ...prev.functionalSkills, 
                                    marketExpansion: newSkills 
                                  } 
                                }));
                                setHasChanges(true);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {formData.functionalSkills.marketExpansion.map((skill, index) => (
                            <div key={index} className="flex gap-2">
                              <Textarea
                                value={skill}
                                onChange={(e) => {
                                  const newSkills = [...formData.functionalSkills.marketExpansion];
                                  newSkills[index] = e.target.value;
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    functionalSkills: { 
                                      ...prev.functionalSkills, 
                                      marketExpansion: newSkills 
                                    } 
                                  }));
                                  setHasChanges(true);
                                }}
                                className="text-sm"
                                rows={2}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newSkills = formData.functionalSkills.marketExpansion.filter((_, i) => i !== index);
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    functionalSkills: { 
                                      ...prev.functionalSkills, 
                                      marketExpansion: newSkills 
                                    } 
                                  }));
                                  setHasChanges(true);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="space-y-2">
                          {formData.functionalSkills.marketExpansion.map((skill, index) => (
                            <p key={index} className="text-sm text-gray-700">{skill}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Operational Efficiency */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFunctionalSkill('operational-efficiency')}
                  >
                    {editStates.functionalSkillTitles ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={operationalEfficiencyTitleHistory.currentValue}
                          onChange={(e) => handleFunctionalSkillTitleChange('operationalEfficiency', e.target.value)}
                          className="font-medium text-gray-900"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVersionHistory('Operational Efficiency Title');
                          }}
                          title="View version history"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">{operationalEfficiencyTitleHistory.currentValue}</span>
                    )}
                    {expandedFunctionalSkill === 'operational-efficiency' ? 
                      <Minus className="h-5 w-5 text-gray-400" /> : 
                      <Plus className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                  
                  {expandedFunctionalSkill === 'operational-efficiency' && (
                    <div className="mt-3 space-y-3">
                      <Label className="text-sm">Add operational efficiency skills here</Label>
                    </div>
                  )}
                </div>

                {/* Leadership Development */}
                <div>
                  <button 
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFunctionalSkill('leadership-development')}
                  >
                    {editStates.functionalSkillTitles ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={leadershipDevelopmentTitleHistory.currentValue}
                          onChange={(e) => handleFunctionalSkillTitleChange('leadershipDevelopment', e.target.value)}
                          className="font-medium text-gray-900"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVersionHistory('Leadership Development Title');
                          }}
                          title="View version history"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">{leadershipDevelopmentTitleHistory.currentValue}</span>
                    )}
                    {expandedFunctionalSkill === 'leadership-development' ? 
                      <Minus className="h-5 w-5 text-gray-400" /> : 
                      <Plus className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                  
                  {expandedFunctionalSkill === 'leadership-development' && (
                    <div className="mt-3 space-y-3">
                      <Label className="text-sm">Add leadership development skills here</Label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Manual */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">Reza's User Manual</h3>
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
                    onChange={(e) => handleInputChange('userManual', e.target.value)}
                    className="text-sm leading-relaxed"
                    rows={8}
                  />
                ) : (
                  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                    {userManualHistory.currentValue}
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
