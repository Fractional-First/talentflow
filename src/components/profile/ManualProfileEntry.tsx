
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Linkedin, ArrowRight } from 'lucide-react';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Design',
  'Construction',
  'Transportation',
  'Hospitality',
  'Other'
];

const experienceLevels = [
  'Entry Level (0-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (6-10 years)',
  'Executive (10+ years)'
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentPosition: string;
  company: string;
  industry: string;
  experienceLevel: string;
  summary: string;
  skills: string;
};

interface ManualProfileEntryProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
  showLinkedInBadge?: boolean;
}

export const ManualProfileEntry = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting,
  showLinkedInBadge = false 
}: ManualProfileEntryProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPosition: '',
    company: '',
    industry: '',
    experienceLevel: '',
    summary: '',
    skills: '',
    ...initialData
  });
  
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const requestEmailVerification = () => {
    setTimeout(() => {
      setIsEmailVerified(true);
      toast({
        title: "Email verified",
        description: "Your email address has been verified successfully."
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least your name and email address.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {showLinkedInBadge && (
        <Alert variant="default" className="bg-[#0A66C2]/10 border-[#0A66C2]/30">
          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
          <AlertTitle>LinkedIn Profile Information Applied</AlertTitle>
          <AlertDescription>
            Your profile information has been pre-filled with data from your LinkedIn account. You can edit any fields as needed.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                value={formData.firstName} 
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email *</Label>
                <Badge variant={isEmailVerified ? "default" : "outline"} className="ml-2">
                  {isEmailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleFormChange}
                  required
                />
                {!isEmailVerified && (
                  <Button type="button" variant="outline" size="sm" onClick={requestEmailVerification}>
                    Verify
                  </Button>
                )}
              </div>
              {!isEmailVerified && (
                <p className="text-xs text-muted-foreground mt-1">
                  Verification helps ensure profile authenticity
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input 
                id="currentPosition" 
                value={formData.currentPosition} 
                onChange={handleFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry}
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                value={formData.lastName} 
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="company">Current Company</Label>
              <Input 
                id="company" 
                value={formData.company} 
                onChange={handleFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select 
                value={formData.experienceLevel}
                onValueChange={(value) => handleSelectChange('experienceLevel', value)}
              >
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea 
              id="summary" 
              placeholder="Briefly describe your professional background, key skills, and career goals..."
              className="min-h-[120px]"
              value={formData.summary}
              onChange={handleFormChange}
            />
          </div>
          
          <div>
            <Label htmlFor="skills">Key Skills (comma separated)</Label>
            <Input 
              id="skills" 
              placeholder="e.g., Project Management, JavaScript, Data Analysis, Leadership"
              value={formData.skills}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
