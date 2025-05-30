
import { useNavigate } from 'react-router-dom';
import { StepCard } from '@/components/StepCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const ProfileSummaryCard = () => {
  const navigate = useNavigate();
  
  // Mock profile data - in a real app, this would come from API/state
  const profile = {
    name: 'Alex Johnson',
    title: 'Senior Product Manager',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    about: 'Experienced product manager with 7+ years in technology companies. Strong background in user-centric design, agile methodologies, and product strategy.',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Cross-functional Leadership', 'Data Analysis']
  };
  
  return (
    <StepCard>
      <div className="md:flex gap-6">
        {/* Profile Left Section (Photo) */}
        <div className="md:w-1/4 p-6 flex flex-col items-center text-center border-r border-border/40">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              onClick={() => navigate('/dashboard/branding')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Profile Right Section (Info & Skills) */}
        <div className="md:w-3/4 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.title}</p>
              
              <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{profile.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Available immediately</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/profile-creation')}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit Profile
              </Button>
              <Button size="sm" onClick={() => navigate('/dashboard/waiting-room')}>
                View Job Status
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">About</h3>
              <p className="text-sm text-muted-foreground">{profile.about}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="bg-primary/5 text-primary px-2 py-1 rounded-md text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/profile-snapshot')}>
              View Full Profile
            </Button>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
