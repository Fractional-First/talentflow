
import React from 'react';
import { Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VersionSourceBadge } from './VersionSourceBadge';
import { formatDate } from './utils/version-utils';
import { VersionWithField } from './types/version-types';
import { Badge } from '@/components/ui/badge';

interface VersionHistoryItemProps {
  item: VersionWithField;
  onRevert: (fieldName: string, versionId: string) => void;
  onClose: () => void;
}

export const VersionHistoryItem: React.FC<VersionHistoryItemProps> = ({ 
  item, 
  onRevert,
  onClose
}) => {
  return (
    <div className={`p-3 rounded-md border ${item.isCurrent ? 'bg-primary/5' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium flex items-center text-sm">
            {item.fieldIcon}
            <span className="ml-2">{item.field}</span>
            {item.isCurrent && (
              <Badge variant="outline" className="ml-2 text-xs bg-primary/10 border-primary/30">
                Current
              </Badge>
            )}
          </div>
          
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {formatDate(item.version.timestamp)}
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <VersionSourceBadge source={item.version.source} />
            
            {item.version.summary && (
              <p className="text-xs text-muted-foreground">
                {item.version.summary}
              </p>
            )}
          </div>
        </div>
        
        <div>
          {!item.isCurrent && (
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                onRevert(item.field, item.version.id);
                onClose();
              }}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Restore
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

