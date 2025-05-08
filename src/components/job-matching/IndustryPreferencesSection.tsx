
import { useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface IndustryPreferencesSectionProps {
  industryPreferences: string[];
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>;
}

const IndustryPreferencesSection = ({
  industryPreferences,
  setIndustryPreferences
}: IndustryPreferencesSectionProps) => {
  const [open, setOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState("");
  
  const handleAddIndustry = () => {
    if (newIndustry.trim() && !industryPreferences.includes(newIndustry.trim())) {
      setIndustryPreferences([...industryPreferences, newIndustry.trim()]);
      setNewIndustry("");
      setOpen(false);
    }
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
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add Industry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Industry Preference</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input 
                value={newIndustry} 
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Enter industry name" 
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddIndustry()}
              />
              <Button onClick={handleAddIndustry}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default IndustryPreferencesSection;
