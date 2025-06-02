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
  Phone,
  Plus,
  Minus
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

const AIGUIDE_KEY = 'aiSuggestionsGuideSeen';

const ProfileSnapshot = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [expandedFunctionalSkill, setExpandedFunctionalSkill] = useState<string | null>(null);

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
                  <AvatarImage src="/lovable-uploads/06e0df8d-b26a-472b-b073-64583b551789.png" alt="Reza Behnam" />
                  <AvatarFallback className="text-4xl bg-teal-100 text-teal-700">
                    RB
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reza Behnam</h1>
              <p className="text-lg text-gray-600 mb-1">Venture Builder, CEO</p>
              <p className="text-sm text-gray-500 mb-4">Holistic Leadership Coach</p>
              <p className="text-sm text-gray-500">Based in Southeast Asia</p>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                Reza is a seasoned, visionary venture builder and CEO with a proven track record of scaling startups and transforming enterprises in Southeast Asia and the US. He's a strategic problem-solver and an efficient operator with innovation and inspiration. With expertise in both entrepreneurship and leadership coaching, Reza empowers executives to integrate mindfulness and purpose into their organizations, fostering resilience and long-term success.
              </p>
            </div>

            {/* Key Roles */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Roles</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Founder/CEO, multiple B2B startups</p>
                <p>Venture Builder and APAC GTM Leader, Mach49</p>
                <p>Managing Director, Yahoo! SE Asia</p>
                <p>Venture Architect/Strategist, Vivint Corp</p>
                <p>Data Science, Strategy and FP&A Leader, Intel Corp</p>
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {['Strategy', 'Venture Building', 'Biz Transformation', 'Execution', 'Coaching', 'Startup Scaling', 'Mentorship'].map((area) => (
                  <Badge key={area} variant="outline" className="bg-teal-100 text-teal-700 border-teal-200">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Industries</h3>
              <div className="flex flex-wrap gap-2">
                {['Tech', 'VC', 'Digital Media', 'Leadership Coaching'].map((industry) => (
                  <Badge key={industry} variant="outline" className="bg-teal-100 text-teal-700 border-teal-200">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Geographical Coverage */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Geographical Coverage</h3>
              <div className="flex flex-wrap gap-2">
                {['Southeast Asia', 'United States', 'Middle East'].map((region) => (
                  <Badge key={region} variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Stage</h3>
              <div className="flex flex-wrap gap-2">
                {['Enterprise', 'Early Stage', 'Seed', 'Growth'].map((stage) => (
                  <Badge key={stage} variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    {stage}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Personal Interests */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Personal Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Travel', 'Polo', 'Mindfulness', 'Philosophy'].map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="block w-fit bg-gray-100 text-gray-700 border-gray-200">
                  Yoga and Meditation Teacher
                </Badge>
                <Badge variant="outline" className="block w-fit bg-gray-100 text-gray-700 border-gray-200">
                  Coaching
                </Badge>
              </div>
            </div>

            {/* Engagement Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Engagement Options</h3>
              <p className="text-sm text-gray-600">Fractional, Interim, Coach/Mentor</p>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Reza Section */}
            <div className="bg-teal-600 text-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Meet Reza</h2>
              <p className="text-sm leading-relaxed">
                Hello, I'm Reza! Over the years, I've built and scaled successful ventures, transformed businesses, and coached leaders to realize their potential. I'm passionate about blending business growth with conscious leadership where people are treated as a whole. When I'm not guiding ventures or building new companies, you'll find me practicing mindfulness or enjoying polo, a sport that connects me to my Persian heritage.
              </p>
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
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Reza is a dynamic leader with a unique blend of strategic vision and operational excellence, driving growth and innovation across Southeast Asia.
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">• Startup Leader:</span>
                        <span className="text-gray-600"> Led and scaled startups across Southeast Asia to successful exits, while serving as VC Partner, Operator, and Strategic Consultant.</span>
                      </div>
                      <div>
                        <span className="font-medium">• Expansion Specialist:</span>
                        <span className="text-gray-600"> Orchestrated Yahoo!'s expansion into six new Southeast Asian markets, unlocking regional opportunities.</span>
                      </div>
                      <div>
                        <span className="font-medium">• Value Creator:</span>
                        <span className="text-gray-600"> Delivered measurable impact through strategic leadership and operational excellence across startups and established enterprises.</span>
                      </div>
                      <div>
                        <span className="font-medium">• Sustainability Advocate:</span>
                        <span className="text-gray-600"> Integrating analytical thinking with mindful-based coaching to support sustainable growth and conscious leadership.</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="venture-builder" className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Content for Venture Builder persona will be displayed here.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="leadership-steward" className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Content for Leadership / Cultural Steward persona will be displayed here.
                    </p>
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
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Strategic Problem-Solving</h4>
                        <p className="text-gray-600">Connecting the dots. Crafting insights and tactical thinking. Driving business revenue growth and brand presence.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Conscious Leadership</h4>
                        <p className="text-gray-600">Mentoring leaders, integrating mindful leadership practices that enhance connection, productivity, positivity and organizational culture.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Scaling Ventures</h4>
                        <p className="text-gray-600">Leading startups, corporate ventures through planning, fundraising, governance, scaling, professionalization, optimization and, ultimately, exits.</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sweet-spot" className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Content for Sweet Spot will be displayed here.
                    </p>
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
                    <div className="mt-3 space-y-3 text-sm text-gray-600">
                      <div>
                        <strong>• Market Entry Expertise:</strong> Designed and executed strategies that expanded Yahoo's presence across six new countries in Southeast Asia.
                      </div>
                      <div>
                        <strong>• Scaling Across Borders:</strong> Guided startups and enterprises to navigate complex regulatory, cultural, and operational challenges when entering new regions.
                      </div>
                      <div>
                        <strong>• Tailored Strategies:</strong> Develops bespoke go-to-market plans that align with business objectives, leveraging local insights and global trends.
                      </div>
                      <div>
                        <strong>• Partnership Development:</strong> Establishes strategic alliances and partnerships to drive growth and strengthen market positioning.
                      </div>
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
                    <div className="mt-3 space-y-3 text-sm text-gray-600">
                      <div></div>
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
                    <div className="mt-3 space-y-3 text-sm text-gray-600">
                      <div></div>
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
              
              <div className="p-4 space-y-4 text-sm text-gray-700">
                <p>
                  Reza values direct communication, transparency, and early alignment on goals. He thrives in environments where challenges are addressed proactively and discussions are data-driven. Balancing creativity with analytical rigor, Reza integrates human-centric leadership with strategic execution to achieve impactful outcomes.
                </p>
                <p>
                  <strong>Reza's Ways of Working:</strong> He's at his best as part of high-IQ, high EQ teams. His art manifests in human interactions, leadership, the creativity of plans, design, communication, persuasion, and inspiration. The science manifests in data-backed analysis, planning and decision-making. The art requires space and freedom to explore.
                </p>
                <p>
                  Reza is a passionate, purpose-driven leader who values self-awareness and modeling through behavior. He works best with people who are respectful and self-aware.
                </p>
              </div>
            </div>
          </div>
        </div>

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
