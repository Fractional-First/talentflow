
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil, Lock, Unlock } from 'lucide-react';
import { VersionHistory, VersionIndicator } from './VersionHistory';
import { VersionEntry } from './types/version-types';

interface VersionControlledSectionProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  versions: VersionEntry[];
  currentVersionId: string;
  onRevert: (versionId: string) => void;
  onEdit: () => void;
  children: React.ReactNode;
  isLocked?: boolean;
  onToggleLock?: () => void;
}

const VersionControlledSection: React.FC<VersionControlledSectionProps> = ({
  title,
  icon,
  versions,
  currentVersionId,
  onRevert,
  onEdit,
  children,
  isLocked = false,
  onToggleLock
}) => {
  const [showHistory, setShowHistory] = useState(false);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
          <VersionIndicator versions={versions} />
        </div>
        
        <div className="flex items-center gap-1">
          {onToggleLock && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onToggleLock}
              title={isLocked ? "Unlock this section" : "Lock this section"}
            >
              {isLocked ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <Unlock className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
            
          <VersionHistory
            versions={versions}
            currentVersion={currentVersionId}
            onRevert={onRevert}
            fieldName={typeof title === 'string' ? title : 'Section'}
            compareVersions={true}
          />
            
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={onEdit}
            disabled={isLocked}
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
      </div>
      
      {children}
      
      <Separator className="my-6" />
    </div>
  );
};

export default VersionControlledSection;
