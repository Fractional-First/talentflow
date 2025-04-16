
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { History } from 'lucide-react';
import { VersionWithField, VersionEntry } from './types/version-types';
import { VersionHistoryItem } from './VersionHistoryItem';

// Version Indicator component for showing a quick status about versions
export const VersionIndicator: React.FC<{ versions: VersionEntry[] }> = ({ versions }) => {
  if (versions.length <= 1) return null;
  
  return (
    <span className="text-xs text-muted-foreground border rounded-full px-2 py-0.5 bg-muted/30">
      {versions.length} versions
    </span>
  );
};

// VersionHistory component for displaying version history in a popover
interface VersionHistoryProps {
  versions: VersionEntry[];
  currentVersion: string;
  onRevert: (versionId: string) => void;
  fieldName: string;
  compareVersions?: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ 
  versions, 
  currentVersion, 
  onRevert, 
  fieldName,
  compareVersions = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (versions.length <= 1) return null;
  
  // Convert to VersionWithField format for consistent rendering
  const versionItems: VersionWithField[] = versions.map(version => ({
    field: fieldName,
    fieldIcon: <History className="h-4 w-4 text-primary" />,
    version,
    isCurrent: version.id === currentVersion
  }));
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
          title="View version history"
        >
          <History className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-3" align="end">
        <div className="font-medium mb-2">Version History</div>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-3">
            {versionItems.map((item) => (
              <VersionHistoryItem
                key={item.version.id}
                item={item}
                onRevert={onRevert}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
