
import { useNavigate } from 'react-router-dom';
import { StepCard } from '@/components/StepCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Briefcase, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ProfileData {
  name: string;
  title: string;
  company: string;
  location: string;
  about: string;
  skills: string[];
}

interface ProfileSummaryCardProps {
  readonly?: boolean;
}

export const ProfileSummaryCard = ({ readonly = false }: ProfileSummaryCardProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Alex Johnson',
    title: 'Senior Product Manager',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    about: 'Experienced product manager with 7+ years in technology companies. Strong background in user-centric design, agile methodologies, and product strategy.',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Cross-functional Leadership', 'Data Analysis']
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('profile_data, profile_version')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading profile data:', error);
            return;
          }

          if (profileData?.profile_data) {
            const data = profileData.profile_data as any;
            if (data.formData) {
              setProfile({
                name: `${data.formData.firstName || ''} ${data.formData.lastName || ''}`.trim() || 'User',
                title: data.formData.currentPosition || 'Professional',
                company: data.formData.company || 'Company',
                location: 'Location', // You may want to add location to the form
                about: data.formData.summary || 'Professional summary not provided.',
                skills: data.formData.skills ? data.formData.skills.split(',').map((s: string) => s.trim()) : []
              });
            }
          }
        }
      } catch (error) {
        console.error('Error in loadProfileData:', error);
      }
    };

    loadProfileData();
  }, []);
  
  return (
    <StepCard className={cn(readonly && "bg-muted/30")}>
      {readonly && (
        <div className="flex items-center gap-2 p-4 border-b bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Profile Complete</span>
        </div>
      )}
      
      <div className="md:flex gap-6">
        {/* Profile Left Section (Photo) */}
        <div className="md:w-1/4 p-6 flex flex-col items-center text-center border-r border-border/40">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!readonly && (
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={() => navigate('/dashboard/branding')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
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
            
            {!readonly && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/profile-creation')}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit Profile
                </Button>
                <Button size="sm" onClick={() => navigate('/dashboard/waiting-room')}>
                  View Job Status
                </Button>
              </div>
            )}
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
          
          {!readonly && (
            <div className="mt-6 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/profile-snapshot')}>
                View Full Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </StepCard>
  );
};
