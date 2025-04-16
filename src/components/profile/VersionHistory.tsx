
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { 
  History, 
  Clock, 
  ChevronDown, 
  RotateCcw, 
  FileDiff, 
  CalendarClock,
  Eye
} from 'lucide-react';

export interface VersionEntry {
  id: string;
  timestamp: Date;
  content: string | string[] | object;
  author?: string;
  source?: 'manual' | 'linkedin' | 'resume' | 'system';
  summary?: string;
}

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
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return new Intl.RelativeTimeFormat('en', { style: 'short' }).format(
        -Math.round(diffInHours), 'hour'
      );
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined 
      });
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleRevert = (versionId: string) => {
    onRevert(versionId);
    setIsOpen(false);
    toast({
      title: "Version restored",
      description: `Reverted ${fieldName} to previous version.`,
    });
  };
  
  const getSourceBadge = (source?: string) => {
    switch(source) {
      case 'linkedin':
        return <Badge variant="outline" className="bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30">LinkedIn</Badge>;
      case 'resume':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Resume</Badge>;
      case 'manual':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Manual Edit</Badge>;
      default:
        return <Badge variant="outline" className="bg-muted text-muted-foreground">System</Badge>;
    }
  };
  
  const renderSimpleDiff = (currentContent: any, previousContent: any) => {
    if (typeof currentContent === 'string' && typeof previousContent === 'string') {
      if (currentContent.length > previousContent.length) {
        return <span className="text-xs">Content added</span>;
      } else if (currentContent.length < previousContent.length) {
        return <span className="text-xs">Content removed</span>;
      } else {
        return <span className="text-xs">Content changed</span>;
      }
    } else if (Array.isArray(currentContent) && Array.isArray(previousContent)) {
      const added = currentContent.length - previousContent.length;
      if (added > 0) {
        return <span className="text-xs">{added} item(s) added</span>;
      } else if (added < 0) {
        return <span className="text-xs">{Math.abs(added)} item(s) removed</span>;
      } else {
        return <span className="text-xs">Items changed</span>;
      }
    }
    
    return <span className="text-xs">Content updated</span>;
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs flex items-center"
          title="View version history"
        >
          <History className="h-3.5 w-3.5 mr-1.5" />
          History
          <ChevronDown className="h-3 w-3 ml-1.5 opacity-70" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2 border rounded-md p-2">
        <div className="text-sm font-medium mb-2 flex items-center">
          <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
          Version History
        </div>
        
        <ScrollArea className="h-[200px]">
          <div className="space-y-1">
            {versions.map((version, index) => (
              <div 
                key={version.id}
                className={`p-2 rounded-md text-sm ${version.id === currentVersion ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      {formatDate(version.timestamp)}
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {formatTime(version.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center mt-1 gap-2">
                      {getSourceBadge(version.source)}
                      
                      {index < versions.length - 1 && compareVersions && (
                        <div className="text-xs text-muted-foreground">
                          {renderSimpleDiff(version.content, versions[index + 1].content)}
                        </div>
                      )}
                    </div>
                    
                    {version.summary && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {version.summary}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    {version.id !== currentVersion && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleRevert(version.id)}
                        title="Restore this version"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    
                    {index < versions.length - 1 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            title="View changes"
                          >
                            <FileDiff className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                          <div className="font-medium text-sm mb-2">Changes</div>
                          <div className="text-xs">
                            {version.summary || 'Comparing with previous version'}
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between">
                            <div>
                              <div className="text-xs font-medium">Before</div>
                              <div className="text-xs text-muted-foreground mt-1 max-h-[100px] overflow-auto">
                                {JSON.stringify(versions[index + 1].content, null, 2)}
                              </div>
                            </div>
                            <Separator orientation="vertical" className="mx-2 h-auto" />
                            <div>
                              <div className="text-xs font-medium">After</div>
                              <div className="text-xs text-muted-foreground mt-1 max-h-[100px] overflow-auto">
                                {JSON.stringify(version.content, null, 2)}
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          title="View content"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="font-medium text-sm mb-2">Content</div>
                        <div className="text-xs text-muted-foreground mt-1 max-h-[200px] overflow-auto whitespace-pre-wrap">
                          {typeof version.content === 'string' 
                            ? version.content 
                            : JSON.stringify(version.content, null, 2)}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const VersionIndicator: React.FC<{ versions: VersionEntry[] }> = ({ versions }) => {
  if (versions.length <= 1) return null;

  return (
    <Badge 
      variant="outline" 
      className="text-xs font-normal bg-muted/30"
    >
      <History className="h-3 w-3 mr-1 inline-block" />
      {versions.length} versions
    </Badge>
  );
};
