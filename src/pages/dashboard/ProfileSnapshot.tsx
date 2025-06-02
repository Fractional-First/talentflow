import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
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
  Phone
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import VersionControlledSection from '@/components/profile/VersionControlledSection';
import { GlobalVersionHistory } from '@/components/profile/GlobalVersionHistory';
import { VersionEntry } from '@/components/profile/types/version-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to generate timestamps within the last month
const getRandomPastDate = (maxDaysAgo = 30) => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - daysAgo);
  pastDate.setHours(now.getHours() - hoursAgo);
  pastDate.setMinutes(now.getMinutes() - minutesAgo);
  
  return pastDate;
};

const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';

const ProfileSnapshot = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Create Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Review Profile', description: 'Review your profile', status: 'current' }
  ];

  // Version history for basic info
  const [basicInfoVersions, setBasicInfoVersions] = useState<VersionEntry[]>([
    {
      id: 'basic-1',
      timestamp: new Date(),
      content: {
        name: 'Alex Johnson',
        title: 'Senior Product Manager',
        company: 'TechCorp Inc.',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
      },
      source: 'manual',
      summary: 'Initial profile creation'
    }
  ]);
  
  // Version history for summary
  const [summaryVersions, setSummaryVersions] = useState<VersionEntry[]>([
    {
      id: 'summary-1',
      timestamp: getRandomPastDate(30),
      content: 'Experienced product manager with 7+ years of experience in technology companies. Strong background in user-centric design, agile methodologies, and product strategy. Passionate about building products that solve real user problems and drive business growth.',
      source: 'resume',
      summary: 'Imported from resume'
    }
  ]);
  
  // Version history for skills
  const [skillsVersions, setSkillsVersions] = useState<VersionEntry[]>([
    {
      id: 'skills-1',
      timestamp: getRandomPastDate(20),
      content: ['Product Strategy', 'User Research', 'Agile Methodologies', 'Cross-functional Leadership', 'Data Analysis', 'Product Roadmapping'],
      source: 'linkedin',
      summary: 'Imported from LinkedIn'
    },
    {
      id: 'skills-2',
      timestamp: getRandomPastDate(25),
      content: ['Product Strategy', 'User Research', 'Agile Methodologies', 'Cross-functional Leadership'],
      source: 'manual',
      summary: 'Initial skills entry'
    }
  ]);
  
  // Version history for experience
  const [experienceVersions, setExperienceVersions] = useState<VersionEntry[]>([
    {
      id: 'exp-1',
      timestamp: getRandomPastDate(10),
      content: [
        {
          title: 'Senior Product Manager',
          company: 'TechCorp Inc.',
          duration: 'Jan 2020 - Present'
        },
        {
          title: 'Product Manager',
          company: 'InnovateSoft',
          duration: 'Mar 2017 - Dec 2019'
        }
      ],
      source: 'linkedin',
      summary: 'Updated from LinkedIn'
    },
    {
      id: 'exp-2',
      timestamp: getRandomPastDate(15),
      content: [
        {
          title: 'Product Manager',
          company: 'InnovateSoft',
          duration: 'Mar 2017 - Dec 2019'
        }
      ],
      source: 'manual',
      summary: 'Initial experience entry'
    }
  ]);
  
  // Version history for education
  const [educationVersions, setEducationVersions] = useState<VersionEntry[]>([
    {
      id: 'edu-1',
      timestamp: getRandomPastDate(5),
      content: [
        {
          degree: 'MBA, Product Management',
          school: 'University of Technology',
          year: '2016'
        },
        {
          degree: 'BS, Computer Science',
          school: 'State University',
          year: '2014'
        }
      ],
      source: 'manual',
      summary: 'Added education history'
    }
  ]);

  // ---- [AI SUGGESTION FEATURE] State for per-section AI suggestions ----
  // In a real app these would be backend-generated suggestions.
  const sectionKeys = ['summary', 'skills', 'experience', 'education'];
  const aiSuggestionsInit: any = {
    summary: {
      suggestion: "Consider adding more about your leadership experience and impact on key projects.",
      accepted: false,
      dismissed: false
    },
    skills: {
      suggestion: "Highlight your experience with product analytics platforms like Amplitude or Mixpanel.",
      accepted: false,
      dismissed: false
    },
    experience: {
      suggestion: "Mention your role leading the migration project to cloud infrastructure.",
      accepted: false,
      dismissed: false
    },
    education: {
      suggestion: "",
      accepted: false,
      dismissed: false
    }
  };
  const [aiSuggestions, setAISuggestions] = useState(aiSuggestionsInit);

  // State for displaying highlights if an AI suggestion is accepted.
  const [highlightedSections, setHighlightedSections] = useState<Record<string, boolean>>({});

  // Guide dialog display state
  const [showAIGuide, setShowAIGuide] = useState(false);

  // Show popup on first load
  useEffect(() => {
    if (!localStorage.getItem(AIGUIDE_KEY)) setShowAIGuide(true);
  }, []);

  // When guide is dismissed, remember for future visits
  const handleDismissGuide = () => {
    localStorage.setItem(AIGUIDE_KEY, 'seen');
    setShowAIGuide(false);
  };

  // Handler: Accept AI suggestion
  const handleAcceptAISuggestion = (section: string) => {
    setAISuggestions((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], accepted: true, dismissed: false }
    }));
    setHighlightedSections(prev => ({ ...prev, [section]: true }));
    toast({
      title: "AI suggestion applied",
      description: "This section has been updated using an AI suggestion. Please review or adjust as needed.",
    });
    setTimeout(() => setHighlightedSections(prev => ({ ...prev, [section]: false })), 2500);
  };

  // Handler: Dismiss AI suggestion
  const handleDismissAISuggestion = (section: string) => {
    setAISuggestions((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], accepted: false, dismissed: true }
    }));
    setHighlightedSections(prev => ({ ...prev, [section]: false }));
  };

  // Current version IDs
  const [currentVersionIds, setCurrentVersionIds] = useState({
    basicInfo: 'basic-1',
    summary: 'summary-1',
    skills: 'skills-1',
    experience: 'exp-1',
    education: 'edu-1'
  });
  
  // Access current data based on currentVersionIds
  const getCurrentBasicInfo = () => {
    const version = basicInfoVersions.find(v => v.id === currentVersionIds.basicInfo);
    return version?.content as any;
  };
  
  const getCurrentSummary = () => {
    const version = summaryVersions.find(v => v.id === currentVersionIds.summary);
    return version?.content as string;
  };
  
  const getCurrentSkills = () => {
    const version = skillsVersions.find(v => v.id === currentVersionIds.skills);
    return version?.content as string[];
  };
  
  const getCurrentExperience = () => {
    const version = experienceVersions.find(v => v.id === currentVersionIds.experience);
    return version?.content as any[];
  };
  
  const getCurrentEducation = () => {
    const version = educationVersions.find(v => v.id === currentVersionIds.education);
    return version?.content as any[];
  };
  
  // Handlers for version management
  const handleRevertBasicInfo = (versionId: string) => {
    setCurrentVersionIds(prev => ({ ...prev, basicInfo: versionId }));
    toast({
      title: "Basic info restored",
      description: "Reverted to previous version of your basic information",
    });
  };
  
  const handleRevertSummary = (versionId: string) => {
    setCurrentVersionIds(prev => ({ ...prev, summary: versionId }));
    toast({
      title: "Summary restored",
      description: "Reverted to previous version of your professional summary",
    });
  };
  
  const handleRevertSkills = (versionId: string) => {
    setCurrentVersionIds(prev => ({ ...prev, skills: versionId }));
    toast({
      title: "Skills restored",
      description: "Reverted to previous version of your skills",
    });
  };
  
  const handleRevertExperience = (versionId: string) => {
    setCurrentVersionIds(prev => ({ ...prev, experience: versionId }));
    toast({
      title: "Experience restored",
      description: "Reverted to previous version of your work experience",
    });
  };
  
  const handleRevertEducation = (versionId: string) => {
    setCurrentVersionIds(prev => ({ ...prev, education: versionId }));
    toast({
      title: "Education restored",
      description: "Reverted to previous version of your education history",
    });
  };
  
  // Global history revert handler
  const handleGlobalRevert = (fieldName: string, versionId: string) => {
    switch (fieldName) {
      case 'Basic Information':
        handleRevertBasicInfo(versionId);
        break;
      case 'Professional Summary':
        handleRevertSummary(versionId);
        break;
      case 'Skills':
        handleRevertSkills(versionId);
        break;
      case 'Work Experience':
        handleRevertExperience(versionId);
        break;
      case 'Education':
        handleRevertEducation(versionId);
        break;
    }
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

  // Get current data based on selected versions
  const profile = {
    ...getCurrentBasicInfo(),
    summary: getCurrentSummary(),
    skills: getCurrentSkills(),
    experience: getCurrentExperience(),
    education: getCurrentEducation()
  };

  // Prepare data for global version history
  const allSectionVersions = [
    {
      fieldName: 'Basic Information',
      fieldIcon: <User className="h-4 w-4 text-primary" />,
      versions: basicInfoVersions,
      currentVersionId: currentVersionIds.basicInfo
    },
    {
      fieldName: 'Professional Summary',
      fieldIcon: <User className="h-4 w-4 text-primary" />,
      versions: summaryVersions,
      currentVersionId: currentVersionIds.summary
    },
    {
      fieldName: 'Skills',
      fieldIcon: <CheckCircle className="h-4 w-4 text-primary" />,
      versions: skillsVersions,
      currentVersionId: currentVersionIds.skills
    },
    {
      fieldName: 'Work Experience',
      fieldIcon: <Briefcase className="h-4 w-4 text-primary" />,
      versions: experienceVersions,
      currentVersionId: currentVersionIds.experience
    },
    {
      fieldName: 'Education',
      fieldIcon: <GraduationCap className="h-4 w-4 text-primary" />,
      versions: educationVersions,
      currentVersionId: currentVersionIds.education
    }
  ];

  // Helper: render AI Suggestion feature per section
  const renderAISuggestionButton = (section: string, disabled?: boolean) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => setAISuggestions((prev: any) => ({
              ...prev,
              [section]: { ...prev[section], dismissed: false }
            }))}
            disabled={
              !aiSuggestions[section]?.suggestion ||
              aiSuggestions[section]?.accepted
            }
            aria-label="Show AI suggestion"
            type="button"
          >
            <WandSparkles
              className={`h-4 w-4 ${
                aiSuggestions[section]?.suggestion && !aiSuggestions[section]?.accepted && !aiSuggestions[section]?.dismissed
                  ? 'text-primary animate-pulse'
                  : 'text-muted-foreground'
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Show AI suggestion to improve this section
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Helper: render AI suggestion UI if available and not accepted/dismissed
  const renderAISuggestionPanel = (section: string) => {
    const suggestion = aiSuggestions[section]?.suggestion;
    if (!suggestion || aiSuggestions[section]?.accepted || aiSuggestions[section]?.dismissed) return null;
    return (
      <div className="mt-2 border-l-2 border-primary/30 bg-primary/5 p-2 rounded-sm text-xs animate-fade-in flex gap-2 items-start">
        <WandSparkles className="h-3 w-3 mt-0.5 text-primary/60" />
        <div className="flex-1">
          <span className="text-primary/80 mr-1 text-[0.9em]">AI Suggestion:</span>
          <span className="text-muted-foreground/90">{suggestion}</span>
          <div className="mt-1.5 flex gap-2">
            <Button size="sm" variant="ghost" className="h-7 text-xs px-2 hover:bg-primary/10 text-primary/80" onClick={() => handleAcceptAISuggestion(section)}>
              Accept
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs px-2 hover:bg-muted/20 text-muted-foreground/80" onClick={() => handleDismissAISuggestion(section)}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Render highlight for accepted suggestions in a section
  const highlightClass = (section: string) =>
    highlightedSections[section]
      ? 'bg-green-50 border border-green-300 animate-fade-in'
      : '';

  return (
    <DashboardLayout steps={steps} currentStep={3}>
      {/* [AI SUGGESTION FEATURE] Onboarding popup */}
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

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Main Profile Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-32"></div>
          
          <CardContent className="relative px-8 pb-8">
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-start gap-8 -mt-16">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src="/lovable-uploads/e6be1987-5c07-4a8d-ac51-3ad8aef10da5.png" alt={profile.name} />
                    <AvatarFallback className="text-2xl bg-teal-100 text-teal-700">
                      {profile.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    onClick={() => navigate('/dashboard/branding')}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Basic Info */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">{profile.title}</p>
                  <p className="text-sm text-gray-500 mb-4">{profile.company}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-teal-600" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-teal-600" />
                      <span>{profile.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 mt-8 lg:mt-0">
                {/* Introduction Section */}
                <div className="bg-teal-50 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Meet {profile.name.split(' ')[0]}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
                  </div>
                  
                  {/* Role Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="bg-white border-teal-200 text-teal-700">
                      Growth Architect
                    </Badge>
                    <Badge variant="outline" className="bg-white border-teal-200 text-teal-700">
                      Venture Builder
                    </Badge>
                    <Badge variant="outline" className="bg-white border-teal-200 text-teal-700">
                      Leadership / Cultural Steward
                    </Badge>
                  </div>
                </div>

                {/* Experience Highlights */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Experience Highlights</h3>
                  <div className="space-y-4">
                    {profile.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-teal-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{exp.title}</h4>
                            <p className="text-teal-600">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">{exp.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-lg border p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Core Competencies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="h-6 w-6 text-teal-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Strategic Problem-Solving</h4>
                      <p className="text-sm text-gray-600">Connecting the dots. Crafting insights and tactical thinking. Driving business revenue growth and brand presence.</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <User className="h-6 w-6 text-teal-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Conscious Leadership</h4>
                      <p className="text-sm text-gray-600">Mentoring leaders, integrating mindful leadership practices that enhance connection, productivity, positivity and organizational culture.</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Scaling Ventures</h4>
                      <p className="text-sm text-gray-600">Leading startups, corporate ventures through planning, fundraising, governance, scaling, professionalization, optimization and, ultimately, exits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Founder/CEO, multiple B2B startups</p>
                <p className="font-medium">Venture Builder and APAC GTM Leader, Mach49</p>
                <p className="font-medium">Managing Director, Yahoo! SE Asia</p>
                <p className="font-medium">Venture Architect/Strategist, Vivint Corp</p>
                <p className="font-medium">Data Science, Strategy and FP&A Leader, Intel Corp</p>
              </div>
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Strategy', 'Venture Building', 'Biz Transformation', 'Execution', 'Coaching', 'Startup Scaling', 'Mentorship'].map((area) => (
                  <Badge key={area} variant="secondary" className="bg-gray-100 text-gray-700">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Tech', 'VC', 'Digital Media', 'Leadership Coaching'].map((industry) => (
                  <Badge key={industry} variant="secondary" className="bg-teal-100 text-teal-700">
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Functional Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-white bg-teal-600 -m-6 mb-6 p-6 rounded-t-lg">
              Functional Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="market-expansion">
                <AccordionTrigger className="text-left">Market Expansion Strategy</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Market Entry Expertise:</strong> Designed and executed strategies that expanded Yahoo's presence across six new countries in Southeast Asia.
                    </div>
                    <div>
                      <strong>Scaling Across Borders:</strong> Guided startups and enterprises to navigate complex regulatory, cultural, and operational challenges when entering new regions.
                    </div>
                    <div>
                      <strong>Tailored Strategies:</strong> Develops bespoke go-to-market plans that align with business objectives, leveraging local insights and global trends.
                    </div>
                    <div>
                      <strong>Partnership Development:</strong> Establishes strategic alliances and partnerships to drive growth and strengthen market positioning.
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="operational-efficiency">
                <AccordionTrigger className="text-left">Operational Efficiency</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">Details about operational efficiency expertise...</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="leadership-development">
                <AccordionTrigger className="text-left">Leadership Development</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600">Details about leadership development expertise...</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* User Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-white bg-teal-600 -m-6 mb-6 p-6 rounded-t-lg">
              {profile.name.split(' ')[0]}'s User Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <p>
              {profile.name.split(' ')[0]} values direct communication, transparency, and early alignment on goals. He thrives 
              in environments where challenges are addressed proactively and discussions are data-driven. Balancing creativity with analytical rigor, {profile.name.split(' ')[0]} integrates human-centric 
              leadership with strategic execution to achieve impactful outcomes.
            </p>
            <p>
              <strong>{profile.name.split(' ')[0]}'s Ways of Working:</strong> He's at his best as part of high-IQ, high EQ teams. His art manifests in human 
              interactions, leadership, the creativity of plans, design, communication, persuasion, and 
              inspiration. The science manifests in data-backed analysis, planning and decision-making. 
              The art requires space and freedom to explore.
            </p>
            <p>
              {profile.name.split(' ')[0]} is a passionate, purpose-driven leader who values self-awareness and modeling 
              through behavior. He works best with people who are respectful and self-aware.
            </p>
          </CardContent>
        </Card>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Geographical Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Geographical Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Southeast Asia</Badge>
                <Badge variant="secondary">United States</Badge>
                <Badge variant="secondary">Middle East</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Enterprise</Badge>
                <Badge variant="secondary">Early Stage</Badge>
                <Badge variant="secondary">Seed</Badge>
                <Badge variant="secondary">Growth</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Personal Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Travel</Badge>
                <Badge variant="outline">Polo</Badge>
                <Badge variant="outline">Mindfulness</Badge>
                <Badge variant="outline">Philosophy</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="block w-fit">Yoga and Meditation Teacher</Badge>
                <Badge variant="outline" className="block w-fit">Coaching</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Fractional, Interim, Coach/Mentor</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
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
