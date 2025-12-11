import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { BrandHeader } from '@/components/auth/BrandHeader';
import { ArrowRight, ArrowLeft, Linkedin, Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DemoCreateProfile() {
  const navigate = useNavigate();
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLinkedInSubmit = async () => {
    if (!linkedInUrl) {
      toast.error('Please enter your LinkedIn URL');
      return;
    }
    setIsGenerating(true);
    // Simulate profile generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success('Profile generated! (Demo mode)');
    navigate('/demo/edit-profile');
  };

  const handleResumeUpload = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success('Profile generated from resume! (Demo mode)');
    navigate('/demo/edit-profile');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <AuthBackground />
        <div className="w-full max-w-md mx-auto px-4 py-8 text-center">
          <Card>
            <CardContent className="py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generating Your Profile</h3>
              <p className="text-muted-foreground">
                Our AI is analyzing your experience and creating your executive profile...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthBackground />
      <div className="w-full max-w-md mx-auto px-4 py-8">
        {/* Demo Banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <span className="text-sm text-amber-800">
            <strong>Step 4 of 7</strong> — Create Profile
          </span>
        </div>

        <BrandHeader />
        
        <Card className="mt-8">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Your Profile</CardTitle>
            <CardDescription className="text-base">
              We'll generate your executive profile from LinkedIn or your resume
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* LinkedIn Option */}
            <div className="space-y-3">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
              />
              <Button onClick={handleLinkedInSubmit} className="w-full">
                Generate from LinkedIn
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Resume Upload Option */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Label>
              <Button variant="outline" onClick={handleResumeUpload} className="w-full">
                Upload PDF or Word Document
              </Button>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/demo/identity-verification')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/demo/edit-profile')}
                className="flex-1"
              >
                Skip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
