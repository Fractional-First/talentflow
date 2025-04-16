
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VersionEntry } from './VersionHistory';
import { History, Clock, CalendarClock, RotateCcw } from 'lucide-react';

interface FieldVersionHistory {
  fieldName: string;
  fieldIcon: React.ReactNode;
  versions: VersionEntry[];
  currentVersionId: string;
}

interface GlobalVersionHistoryProps {
  sectionVersions: FieldVersionHistory[];
  onRevert: (fieldName: string, versionId: string) => void;
}

// Helper to format dates in a consistent way
const formatDate = (date: Date) => {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper to group versions by day
const groupVersionsByDay = (allVersions: { field: string, fieldIcon: React.ReactNode, version: VersionEntry }[]) => {
  const grouped = new Map<string, typeof allVersions>();
  
  allVersions.forEach(item => {
    const date = item.version.timestamp;
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    
    grouped.get(dayKey)?.push(item);
  });
  
  // Sort each day's versions by timestamp (newest first)
  grouped.forEach((versions, day) => {
    versions.sort((a, b) => 
      b.version.timestamp.getTime() - a.version.timestamp.getTime()
    );
  });
  
  // Convert the map to an array of [day, versions] pairs, sorted by day (newest first)
  return Array.from(grouped.entries())
    .sort((a, b) => {
      const dayA = a[0].split('-').map(Number);
      const dayB = b[0].split('-').map(Number);
      
      // Compare years
      if (dayB[0] !== dayA[0]) return dayB[0] - dayA[0];
      // Compare months
      if (dayB[1] !== dayA[1]) return dayB[1] - dayA[1];
      // Compare days
      return dayB[2] - dayA[2];
    })
    .map(([day, versions]) => {
      // Get a proper date object for display
      const [year, month, dayOfMonth] = day.split('-').map(Number);
      const dateObj = new Date(year, month, dayOfMonth);
      
      return {
        day: dateObj,
        versions
      };
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

export const GlobalVersionHistory: React.FC<GlobalVersionHistoryProps> = ({ 
  sectionVersions,
  onRevert
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Flatten all versions from all fields into a single array with field information
  const allVersions = sectionVersions.flatMap(section => 
    section.versions.map(version => ({
      field: section.fieldName,
      fieldIcon: section.fieldIcon,
      version,
      isCurrent: version.id === section.currentVersionId
    }))
  );
  
  // Group versions by day
  const groupedVersions = groupVersionsByDay(allVersions);
  
  const formatDayHeader = (day: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (
      day.getDate() === now.getDate() &&
      day.getMonth() === now.getMonth() &&
      day.getFullYear() === now.getFullYear()
    ) {
      return 'Today';
    } else if (
      day.getDate() === yesterday.getDate() &&
      day.getMonth() === yesterday.getMonth() &&
      day.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      return day.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: now.getFullYear() !== day.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="ml-2 max-md:w-full"
        >
          <History className="mr-2 h-4 w-4" />
          Profile Change History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Profile Change History
          </DialogTitle>
          <DialogDescription>
            View and manage all changes made to your profile
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] mt-4">
          <div className="pr-4">
            {groupedVersions.length > 0 ? (
              <Accordion type="multiple" className="w-full" defaultValue={[groupedVersions[0]?.day.toString()]}>
                {groupedVersions.map(group => (
                  <AccordionItem key={group.day.toString()} value={group.day.toString()}>
                    <AccordionTrigger className="py-2">
                      <span className="text-sm font-medium flex items-center">
                        <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDayHeader(group.day)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 py-2">
                        {group.versions.map((item, index) => (
                          <div 
                            key={`${item.field}-${item.version.id}`}
                            className={`p-3 rounded-md border ${item.isCurrent ? 'bg-primary/5' : ''}`}
                          >
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
                                  {getSourceBadge(item.version.source)}
                                  
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
                                      setIsOpen(false);
                                    }}
                                  >
                                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                    Restore
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No profile changes recorded yet
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
