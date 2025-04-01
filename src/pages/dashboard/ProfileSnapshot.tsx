
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, User, Briefcase, GraduationCap, CheckCircle, Pencil } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ProfileSnapshot = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Create Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Review Profile', description: 'Review your profile', status: 'current' }
  ];
  
  const profile = {
    name: 'Alex Johnson',
    title: 'Senior Product Manager',
    company: 'TechCorp Inc.',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    summary: 'Experienced product manager with 7+ years of experience in technology companies. Strong background in user-centric design, agile methodologies, and product strategy. Passionate about building products that solve real user problems and drive business growth.',
    skills: ['Product Strategy', 'User Research', 'Agile Methodologies', 'Cross-functional Leadership', 'Data Analysis', 'Product Roadmapping'],
    experience: [
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
    education: [
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
    ]
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

  return (
    <DashboardLayout steps={steps} currentStep={3}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Profile Snapshot</StepCardTitle>
            <StepCardDescription>
              Review your professional profile before proceeding to the next step
            </StepCardDescription>
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
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Professional Summary</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile.summary}
                  </p>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-8 px-2 text-xs"
                    onClick={() => navigate('/dashboard/profile-creation')}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-8 px-2 text-xs"
                    onClick={() => navigate('/dashboard/profile-creation')}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Work Experience</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {profile.experience.map((exp, index) => (
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
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-8 px-2 text-xs"
                    onClick={() => navigate('/dashboard/profile-creation')}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Education</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {profile.education.map((edu, index) => (
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
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-8 px-2 text-xs"
                    onClick={() => navigate('/dashboard/profile-creation')}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
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
