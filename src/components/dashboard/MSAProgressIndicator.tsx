import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MSAProgressIndicatorProps {
  currentStage: 1 | 2 | 3;
  stage1Complete: boolean;
  stage2Complete: boolean;
}

const stages = [
  { number: 1, title: 'Identity' },
  { number: 2, title: 'Confidentiality' },
  { number: 3, title: 'Agreement' }
];

export function MSAProgressIndicator({ 
  currentStage, 
  stage1Complete, 
  stage2Complete 
}: MSAProgressIndicatorProps) {
  const isStageComplete = (stageNum: number) => {
    if (stageNum === 1) return stage1Complete && currentStage > 1;
    if (stageNum === 2) return stage2Complete && currentStage > 2;
    return false;
  };

  const isStageActive = (stageNum: number) => stageNum === currentStage;
  const isStagePending = (stageNum: number) => stageNum > currentStage;

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line behind circles */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border mx-12" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary mx-12 transition-all duration-500"
          style={{ 
            width: currentStage === 1 ? '0%' : currentStage === 2 ? 'calc(50% - 3rem)' : 'calc(100% - 6rem)' 
          }}
        />

        {stages.map((stage) => (
          <div key={stage.number} className="flex flex-col items-center z-10">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                isStageComplete(stage.number) && 'bg-primary text-primary-foreground',
                isStageActive(stage.number) && !isStageComplete(stage.number) && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                isStagePending(stage.number) && 'bg-muted text-muted-foreground border-2 border-border'
              )}
            >
              {isStageComplete(stage.number) ? (
                <Check className="w-5 h-5" />
              ) : (
                stage.number
              )}
            </div>
            <span 
              className={cn(
                'mt-2 text-xs font-medium transition-colors',
                isStageActive(stage.number) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {stage.title}
            </span>
          </div>
        ))}
      </div>

      {/* Progress text */}
      <div className="text-center mt-4">
        <span className="text-sm text-muted-foreground">
          Progress: {currentStage}/3
        </span>
      </div>
    </div>
  );
}
