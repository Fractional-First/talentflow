
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IndustrySelector } from './IndustrySelector';

interface IndustryPreferencesSectionProps {
  industryPreferences: string[];
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>;
}

const IndustryPreferencesSection = ({
  industryPreferences,
  setIndustryPreferences
}: IndustryPreferencesSectionProps) => {
  const clearIndustryPreferences = () => {
    setIndustryPreferences([]);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Industry Preferences</h3>
          <p className="text-sm text-muted-foreground">Select your preferred industries</p>
        </div>
      </div>
      
      <div className="space-y-4 px-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm">Preferred Industries</label>
            {industryPreferences.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearIndustryPreferences}>
                Clear all
              </Button>
            )}
          </div>
          <IndustrySelector
            selectedIndustries={industryPreferences}
            onIndustriesChange={setIndustryPreferences}
            placeholder="Select industries you'd like to work in..."
            maxSelections={20}
          />
        </div>
      </div>
    </div>
  );
};

export default IndustryPreferencesSection;
