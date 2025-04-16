
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { History, CalendarClock } from 'lucide-react';
import { VersionHistoryItem } from './VersionHistoryItem';
import { groupVersionsByDay, formatDayHeader } from './utils/version-utils';
import { FieldVersionHistory, VersionWithField } from './types/version-types';

interface GlobalVersionHistoryProps {
  sectionVersions: FieldVersionHistory[];
  onRevert: (fieldName: string, versionId: string) => void;
}

export const GlobalVersionHistory: React.FC<GlobalVersionHistoryProps> = ({ 
  sectionVersions,
  onRevert
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Flatten all versions from all fields into a single array with field information
  const allVersions: VersionWithField[] = sectionVersions.flatMap(section => 
    section.versions.map(version => ({
      field: section.fieldName,
      fieldIcon: section.fieldIcon,
      version,
      isCurrent: version.id === section.currentVersionId
    }))
  );
  
  // Group versions by day
  const groupedVersions = groupVersionsByDay(allVersions);
  
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
                        {group.versions.map((item) => (
                          <VersionHistoryItem
                            key={`${item.field}-${item.version.id}`}
                            item={item}
                            onRevert={onRevert}
                            onClose={() => setIsOpen(false)}
                          />
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

