
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { StepCardContent } from '@/components/StepCard';
import { useNavigate } from 'react-router-dom';

interface NextStepCardProps {
  title: string;
  description: string;
  path: string;
  buttonText: string;
  estimatedTime?: string;
}

export const NextStepCard = ({
  title,
  description,
  path,
  buttonText,
  estimatedTime
}: NextStepCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-muted-foreground mt-1">{description}</p>
          {estimatedTime && (
            <div className="flex items-center mt-2 bg-muted/40 inline-flex px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Estimated time: <strong>{estimatedTime}</strong></span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => navigate(path)}
          className="ml-4 shadow-soft"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
