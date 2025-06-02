
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
  X
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

const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';

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
  functionalSkills: {
    marketExpansion: string[];
    operationalEfficiency: string[];
    leadershipDevelopment: string[];
  };
}

const ProfileSnapshot = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [expandedFunctionalSkill, setExpandedFunctionalSkill] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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

  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Create Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Review Profile', description: 'Review your profile', status: 'current' }
  ];

  // Show popup on first load
  useEffect(() => {
    if (!localStorage.getItem(AIGUIDE_KEY)) setShowAIGuide(true);
  }, []);

  // When guide is dismissed, remember for future visits
  const handleDismissGuide = () => {
    localStorage.setItem(AIGUIDE_KEY, 'seen');
    setShowAIGuide(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSave = () => {
    setIsSubmitting(true);
    
    // Simulate save operation
    setTimeout(() => {
      setIsSubmitting(false);
      setHasChanges(false);
      toast({
        title: "Profile Saved",
        description: "Your profile changes have been saved successfully.",
      });
    }, 1000);
  };

  const handleDiscardChanges = () => {
    setFormData(originalData);
    setHasChanges(false);
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
                <Avatar className="h-48 w-48 border-4 border-white shadow-lg">
                  <AvatarImage src="/lovable-uploads/06e0df8d-b26a-472b-b073-64583b551789.png" alt={formData.name} />
                  <AvatarFallback className="text-4xl bg-teal-100 text-teal-700">
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-2xl font-bold text-center"
                />
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
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-sm leading-relaxed mt-2"
                rows={6}
              />
            </div>

            {/* Key Roles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Key Roles</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('keyRoles')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Focus Areas</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('focusAreas')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
            </div>

            {/* Industries */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Industries</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('industries')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
            </div>

            {/* Geographical Coverage */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Geographical Coverage</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('geographicalCoverage')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
            </div>

            {/* Stage */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Stage</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('stages')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
            </div>

            {/* Personal Interests */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Personal Interests</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('personalInterests')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold">Certifications</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('certifications')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
              </div>
            </div>

            {/* Engagement Options */}
            <div>
              <Label className="font-semibold">Engagement Options</Label>
              <Input
                value={formData.engagementOptions}
                onChange={(e) => handleInputChange('engagementOptions', e.target.value)}
                className="text-sm mt-2"
              />
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Reza Section */}
            <div className="bg-teal-600 text-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Meet Reza</h2>
              <Textarea
                value={formData.meetIntro}
                onChange={(e) => handleInputChange('meetIntro', e.target.value)}
                className="text-sm leading-relaxed bg-white/10 border-white/20 text-white placeholder:text-white/70"
                rows={4}
              />
            </div>

            {/* Personas Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Personas</h3>
              </div>
              
              <div className="p-4">
                <Tabs defaultValue="growth-architect" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="growth-architect" className="text-xs">Growth Architect</TabsTrigger>
                    <TabsTrigger value="venture-builder" className="text-xs">Venture Builder</TabsTrigger>
                    <TabsTrigger value="leadership-steward" className="text-xs">Leadership / Cultural Steward</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="growth-architect" className="space-y-4">
                    <Textarea
                      value={formData.growthArchitectContent}
                      onChange={(e) => handleInputChange('growthArchitectContent', e.target.value)}
                      className="text-sm leading-relaxed"
                      rows={8}
                    />
                  </TabsContent>
                  
                  <TabsContent value="venture-builder" className="space-y-4">
                    <Textarea
                      value={formData.ventureBuilderContent}
                      onChange={(e) => handleInputChange('ventureBuilderContent', e.target.value)}
                      className="text-sm leading-relaxed"
                      rows={4}
                    />
                  </TabsContent>
                  
                  <TabsContent value="leadership-steward" className="space-y-4">
                    <Textarea
                      value={formData.leadershipStewardContent}
                      onChange={(e) => handleInputChange('leadershipStewardContent', e.target.value)}
                      className="text-sm leading-relaxed"
                      rows={4}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Superpowers Section */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Superpowers</h3>
              </div>
              
              <div className="p-4">
                <Tabs defaultValue="superpowers" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="superpowers" className="text-xs">Superpowers</TabsTrigger>
                    <TabsTrigger value="sweet-spot" className="text-xs">Sweet Spot</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="superpowers" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium text-gray-900 mb-2 block">Strategic Problem-Solving</Label>
                        <Textarea
                          value={formData.strategicProblemSolving}
                          onChange={(e) => handleInputChange('strategicProblemSolving', e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label className="font-medium text-gray-900 mb-2 block">Conscious Leadership</Label>
                        <Textarea
                          value={formData.consciousLeadership}
                          onChange={(e) => handleInputChange('consciousLeadership', e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label className="font-medium text-gray-900 mb-2 block">Scaling Ventures</Label>
                        <Textarea
                          value={formData.scalingVentures}
                          onChange={(e) => handleInputChange('scalingVentures', e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sweet-spot" className="space-y-4">
                    <Textarea
                      value={formData.sweetSpotContent}
                      onChange={(e) => handleInputChange('sweetSpotContent', e.target.value)}
                      className="text-sm leading-relaxed"
                      rows={4}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Functional Skills */}
            <div className="bg-white rounded-lg border">
              <div className="bg-teal-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Functional Skills</h3>
              </div>
              
              <div className="p-4 space-y-3">
                {/* Market Expansion Strategy */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFunctionalSkill('market-expansion')}
                  >
                    <span className="font-medium text-gray-900">Market Expansion Strategy</span>
                    {expandedFunctionalSkill === 'market-expansion' ? 
                      <Minus className="h-5 w-5 text-gray-400" /> : 
                      <Plus className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                  
                  {expandedFunctionalSkill === 'market-expansion' && (
                    <div className="mt-3 space-y-3">
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
                    </div>
                  )}
                </div>

                {/* Operational Efficiency */}
                <div className="border-b border-gray-200 pb-3">
                  <button 
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFunctionalSkill('operational-efficiency')}
                  >
                    <span className="font-medium text-gray-900">Operational Efficiency</span>
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
                    <span className="font-medium text-gray-900">Leadership Development</span>
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
              <div className="bg-teal-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Reza's User Manual</h3>
              </div>
              
              <div className="p-4">
                <Textarea
                  value={formData.userManual}
                  onChange={(e) => handleInputChange('userManual', e.target.value)}
                  className="text-sm leading-relaxed"
                  rows={8}
                />
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
    </DashboardLayout>
  );
};

export default ProfileSnapshot;
