
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IndustrySelector from './IndustrySelector';
import { useIndustries } from '@/hooks/useIndustries';

interface IndustryPreferencesSectionProps {
  industryPreferences: string[];
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>;
}

const IndustryPreferencesSection = ({
  industryPreferences,
  setIndustryPreferences
}: IndustryPreferencesSectionProps) => {
  const { data: industries = [] } = useIndustries();

  const clearIndustryPreferences = () => {
    setIndustryPreferences([]);
  };

  const addIndustry = (industryId: string) => {
    if (!industryPreferences.includes(industryId)) {
      setIndustryPreferences([...industryPreferences, industryId]);
    }
  };

  const removeIndustry = (industryId: string) => {
    setIndustryPreferences(industryPreferences.filter(id => id !== industryId));
  };

  const getIndustryName = (industryId: string) => {
    return industries.find(industry => industry.id === industryId)?.name || '';
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <h3 className="font-medium">Industry Preferences</h3>
          <p className="text-sm text-muted-foreground">Select your preferred industries</p>
        </div>
        {industryPreferences.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearIndustryPreferences}>
            Clear all
          </Button>
        )}
      </div>
      
      <div className="space-y-4 px-4">
        <div>
          <label className="text-sm mb-2 block">Add Industry</label>
          <IndustrySelector
            selectedIndustry=""
            onIndustryChange={addIndustry}
            placeholder="Select an industry to add..."
            excludeIndustries={industryPreferences}
          />
        </div>

        {/* Selected industries display */}
        {industryPreferences.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm">Selected Industries ({industryPreferences.length})</label>
            <div className="flex flex-wrap gap-2">
              {industryPreferences.map((industryId) => (
                <Badge key={industryId} variant="outline" className="flex items-center gap-1">
                  <span>{getIndustryName(industryId)}</span>
                  <button 
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => removeIndustry(industryId)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryPreferencesSection;
