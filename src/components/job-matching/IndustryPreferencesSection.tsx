
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface IndustryPreferencesSectionProps {
  industryPreferences: string[];
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>;
}

const IndustryPreferencesSection = ({
  industryPreferences,
  setIndustryPreferences
}: IndustryPreferencesSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Industry Preferences</h3>
          <p className="text-sm text-muted-foreground">Select your preferred industries</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 px-4">
        {industryPreferences.map(industry => (
          <Badge key={industry} variant="outline">
            {industry}
            <button 
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => setIndustryPreferences(prev => prev.filter(i => i !== industry))}
            >
              ×
            </button>
          </Badge>
        ))}
        <Button variant="outline" size="sm">+ Add Industry</Button>
      </div>
    </div>
  );
};

export default IndustryPreferencesSection;
