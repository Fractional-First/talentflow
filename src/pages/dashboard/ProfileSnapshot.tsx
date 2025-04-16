
import { useState } from 'react';
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
  History
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import VersionControlledSection from '@/components/profile/VersionControlledSection';
import { GlobalVersionHistory } from '@/components/profile/GlobalVersionHistory';
import { VersionEntry } from '@/components/profile/VersionHistory';

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
  
  // Section lock state
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    summary: false,
    skills: false,
    experience: false,
    education: false
  });
  
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
  
  // Toggle section lock
  const toggleSectionLock = (section: keyof typeof lockedSections) => {
    setLockedSections(prev => ({ 
      ...prev, 
      [section]: !prev[section] 
    }));
    
    toast({
      title: lockedSections[section] ? "Section unlocked" : "Section locked",
      description: lockedSections[section] 
        ? "This section can now be modified" 
        : "This section is now protected from automatic updates",
    });
  };
  
  const handleAddMockVersion = () => {
    // Add a new mock version for demonstration purposes
    const newSkillsVersion: VersionEntry = {
      id: `skills-${generateId()}`,
      timestamp: new Date(),
      content: [...getCurrentSkills(), 'AI/ML Product Management'],
      source: 'manual',
      summary: 'Added AI/ML skill'
    };
    
    setSkillsVersions(prev => [newSkillsVersion, ...prev]);
    setCurrentVersionIds(prev => ({ ...prev, skills: newSkillsVersion.id }));
    
    toast({
      title: "Skills updated",
      description: "Added new skill: AI/ML Product Management",
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

  return (
    <DashboardLayout steps={steps} currentStep={3}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <StepCardTitle>Profile Snapshot</StepCardTitle>
                <StepCardDescription>
                  Review your professional profile before proceeding to the next step
                </StepCardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddMockVersion}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Add Demo Change
                </Button>
                
                <GlobalVersionHistory 
                  sectionVersions={allSectionVersions}
                  onRevert={handleGlobalRevert}
                />
              </div>
            </div>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 animate-scale-in">
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-medium">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.title}</p>
                <p className="text-sm text-muted-foreground">{profile.company}</p>
                
                <div className="mt-4 space-y-1 text-sm w-full">
                  <p>{profile.email}</p>
                  <p>{profile.phone}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate('/dashboard/profile-creation')}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit Basic Info
                </Button>
              </div>
              
              <div className="md:w-2/3 space-y-6">
                <VersionControlledSection
                  title="Professional Summary"
                  icon={<User className="h-4 w-4 text-primary" />}
                  versions={summaryVersions}
                  currentVersionId={currentVersionIds.summary}
                  onRevert={handleRevertSummary}
                  onEdit={() => navigate('/dashboard/profile-creation')}
                  isLocked={lockedSections.summary}
                  onToggleLock={() => toggleSectionLock('summary')}
                >
                  <p className="text-sm text-muted-foreground">
                    {profile.summary}
                  </p>
                </VersionControlledSection>
                
                <VersionControlledSection
                  title="Skills"
                  icon={<CheckCircle className="h-4 w-4 text-primary" />}
                  versions={skillsVersions}
                  currentVersionId={currentVersionIds.skills}
                  onRevert={handleRevertSkills}
                  onEdit={() => navigate('/dashboard/profile-creation')}
                  isLocked={lockedSections.skills}
                  onToggleLock={() => toggleSectionLock('skills')}
                >
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </VersionControlledSection>
                
                <VersionControlledSection
                  title="Work Experience"
                  icon={<Briefcase className="h-4 w-4 text-primary" />}
                  versions={experienceVersions}
                  currentVersionId={currentVersionIds.experience}
                  onRevert={handleRevertExperience}
                  onEdit={() => navigate('/dashboard/profile-creation')}
                  isLocked={lockedSections.experience}
                  onToggleLock={() => toggleSectionLock('experience')}
                >
                  <div className="space-y-3">
                    {profile.experience.map((exp: any, index: number) => (
                      <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{exp.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </VersionControlledSection>
                
                <VersionControlledSection
                  title="Education"
                  icon={<GraduationCap className="h-4 w-4 text-primary" />}
                  versions={educationVersions}
                  currentVersionId={currentVersionIds.education}
                  onRevert={handleRevertEducation}
                  onEdit={() => navigate('/dashboard/profile-creation')}
                  isLocked={lockedSections.education}
                  onToggleLock={() => toggleSectionLock('education')}
                >
                  <div className="space-y-3">
                    {profile.education.map((edu: any, index: number) => (
                      <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.15 + 0.3}s` }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.school}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </VersionControlledSection>
              </div>
            </div>
          </StepCardContent>
        </StepCard>
        
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Confirm Your Profile</StepCardTitle>
            <StepCardDescription>
              This profile information will be used for job matching and presenting your candidacy to potential employers.
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm">
                By proceeding, you confirm that the information provided in your profile is accurate and up-to-date. You can always come back and edit your profile later.
              </p>
            </div>
          </StepCardContent>
          
          <StepCardFooter className="flex justify-between pt-6">
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
            >
              {isSubmitting ? 'Processing...' : 'Complete & Go to Dashboard'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSnapshot;
