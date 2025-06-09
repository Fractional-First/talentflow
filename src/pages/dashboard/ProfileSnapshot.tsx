
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, User, Briefcase, MapPin, Calendar, GraduationCap, Award, Target, Star, Users, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Persona {
  title: string;
  bullets: string[];
}

interface Superpower {
  title: string;
  description: string;
}

interface FunctionalSkill {
  title: string;
  description: string;
}

interface FunctionalSkills {
  [category: string]: FunctionalSkill[];
}

interface NonObviousRole {
  title: string;
  description: string;
}

interface ProfileData {
  name: string;
  role: string;
  summary: string;
  location: string;
  personas: Persona[];
  meet_them: string;
  sweetspot: string;
  highlights: string[];
  industries: string[];
  focus_areas: string[];
  stage_focus: string[];
  superpowers: Superpower[];
  user_manual: string;
  certifications: string[];
  non_obvious_role: NonObviousRole;
  functional_skills: FunctionalSkills;
  personal_interests: string[];
  geographical_coverage: string[];
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
          .select('profile_data')
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
          setProfileData(profile.profile_data as ProfileData);
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

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
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
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                <p className="text-lg text-muted-foreground">{profileData.role}</p>
                
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  {profileData.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{profileData.geographical_coverage.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Summary */}
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

            {/* Sweet Spot */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Sweet Spot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{profileData.sweetspot}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Key Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {profileData.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Superpowers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Superpowers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.superpowers.map((superpower, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm">{superpower.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{superpower.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Industries & Focus Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Industries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.industries.map((industry, index) => (
                      <Badge key={index} variant="secondary">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.focus_areas.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Professional Personas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.personas.map((persona, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-sm mb-2">{persona.title}</h4>
                      <ul className="space-y-1">
                        {persona.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Stage Focus */}
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {profileData.certifications.map((cert, index) => (
                        <li key={index} className="text-sm">{cert}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Stage Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.stage_focus.map((stage, index) => (
                      <Badge key={index} variant="secondary">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Meet Them */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Meet {profileData.name.split(' ')[0]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{profileData.meet_them}</p>
              </CardContent>
            </Card>
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
