
import { Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface JobSearchStatusSectionProps {
  activelyLooking: boolean;
  setActivelyLooking: (value: boolean) => void;
}

const JobSearchStatusSection = ({
  activelyLooking,
  setActivelyLooking
}: JobSearchStatusSectionProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Job Search Status</h3>
          <p className="text-sm text-muted-foreground">Set your current job search status</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="actively-looking" 
          checked={activelyLooking}
          onCheckedChange={setActivelyLooking}
        />
        <label htmlFor="actively-looking" className="text-sm font-medium">
          {activelyLooking ? 'Actively Looking' : 'Passively Looking'}
        </label>
      </div>
    </div>
  );
};

export default JobSearchStatusSection;
