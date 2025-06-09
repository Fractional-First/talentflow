
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, User, Briefcase, MapPin, Calendar, GraduationCap, Award, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  currentPosition: string;
  company: string;
  yearsExperience: string;
  industry: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  certifications: string;
  careerGoals: string;
  linkedinUrl?: string;
}

const ProfileSnapshot = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('profile_data, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive"
          });
          return;
        }

        if (profile?.profile_data) {
          const data = profile.profile_data as any;
          if (data.formData) {
            setProfileData({
              firstName: data.formData.firstName || '',
              lastName: data.formData.lastName || '',
              email: profile.email || '',
              currentPosition: data.formData.currentPosition || '',
              company: data.formData.company || '',
              yearsExperience: data.formData.yearsExperience || '',
              industry: data.formData.industry || '',
              location: data.formData.location || '',
              summary: data.formData.summary || '',
              skills: data.formData.skills || '',
              education: data.formData.education || '',
              certifications: data.formData.certifications || '',
              careerGoals: data.formData.careerGoals || '',
              linkedinUrl: data.formData.linkedinUrl || ''
            });
          }
        }
      } catch (error) {
        console.error('Error in loadProfileData:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  const handleConfirmProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_status: 'PROFILE_CONFIRMED' })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating onboarding status:', error);
        toast({
          title: "Error",
          description: "Failed to confirm profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Profile Confirmed",
        description: "Your profile has been confirmed successfully!",
        variant: "default"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error in handleConfirmProfile:', error);
      toast({
        title: "Error",
        description: "Failed to confirm profile",
        variant: "destructive"
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const parseSkillsArray = (skills: string) => {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>No profile data found</p>
            <Button onClick={() => navigate('/dashboard/profile-creation')} className="mt-4">
              Create Profile
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Review Your Profile</h1>
            <p className="text-muted-foreground mt-1">
              Please review your AI-generated profile and confirm the details are accurate.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/profile-creation')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <StepCard>
          {/* Profile Header */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {profileData.firstName && profileData.lastName 
                    ? getInitials(profileData.firstName, profileData.lastName)
                    : <User className="h-8 w-8" />
                  }
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-lg text-muted-foreground">{profileData.currentPosition}</p>
                
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{profileData.company}</span>
                  </div>
                  {profileData.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{profileData.yearsExperience} years experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Summary */}
            {profileData.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{profileData.summary}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profileData.skills && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Key Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parseSkillsArray(profileData.skills).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience & Industry */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm"><strong>Industry:</strong> {profileData.industry}</p>
                  <p className="text-sm mt-1"><strong>Years:</strong> {profileData.yearsExperience}</p>
                </CardContent>
              </Card>

              {profileData.education && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{profileData.education}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Certifications & Career Goals */}
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.certifications && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{profileData.certifications}</p>
                  </CardContent>
                </Card>
              )}

              {profileData.careerGoals && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Career Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{profileData.careerGoals}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-muted/30">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate('/dashboard/profile-creation')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button onClick={handleConfirmProfile} className="ml-auto">
                Confirm Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              By confirming, you agree that this profile accurately represents your professional background.
            </p>
          </div>
        </StepCard>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSnapshot;
