
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  History, 
  RotateCcw, 
  Save, 
  Edit3, 
  Check, 
  X,
  Clock,
  User
} from 'lucide-react';
import { VersionEntry } from './types/version-types';
import { VersionSourceBadge } from './VersionSourceBadge';
import { formatDate } from './utils/version-utils';

interface VersionHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  versions: VersionEntry[];
  currentVersionId: string;
  onRevert: (versionId: string) => void;
  onSaveVersion: (summary?: string) => void;
  onRenameVersion: (versionId: string, newSummary: string) => void;
}

export const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({
  isOpen,
  onClose,
  fieldName,
  versions,
  currentVersionId,
  onRevert,
  onSaveVersion,
  onRenameVersion
}) => {
  const [revertDialog, setRevertDialog] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<string | null>(null);
  const [editingSummary, setEditingSummary] = useState('');
  const [saveVersionSummary, setSaveVersionSummary] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleRevert = (versionId: string) => {
    onRevert(versionId);
    setRevertDialog(null);
    onClose();
  };

  const handleRename = (versionId: string) => {
    if (editingSummary.trim()) {
      onRenameVersion(versionId, editingSummary.trim());
    }
    setEditingVersion(null);
    setEditingSummary('');
  };

  const handleSaveVersion = () => {
    onSaveVersion(saveVersionSummary.trim() || undefined);
    setSaveVersionSummary('');
    setShowSaveDialog(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </SheetTitle>
            <SheetDescription>
              View and manage versions of {fieldName}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Button 
              onClick={() => setShowSaveDialog(true)}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Current Version
            </Button>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3 pr-4">
                {versions.map((version) => (
                  <div 
                    key={version.id}
                    className={`p-3 rounded-lg border ${
                      version.id === currentVersionId ? 'bg-primary/5 border-primary' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingVersion === version.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingSummary}
                              onChange={(e) => setEditingSummary(e.target.value)}
                              className="text-sm"
                              placeholder="Version summary"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleRename(version.id)}
                              disabled={!editingSummary.trim()}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingVersion(null);
                                setEditingSummary('');
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium truncate">
                              {version.summary || 'Untitled version'}
                            </h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingVersion(version.id);
                                setEditingSummary(version.summary || '');
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(version.timestamp)}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <VersionSourceBadge source={version.source} />
                          {version.id === currentVersionId && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {version.id !== currentVersionId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRevertDialog(version.id)}
                          className="ml-2"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Revert Confirmation Dialog */}
      <Dialog open={!!revertDialog} onOpenChange={() => setRevertDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this version? Your current changes will be lost unless you save them first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevertDialog(null)}>
              Cancel
            </Button>
            <Button onClick={() => revertDialog && handleRevert(revertDialog)}>
              Restore Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Version Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current Version</DialogTitle>
            <DialogDescription>
              Give this version a descriptive name to help you identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={saveVersionSummary}
              onChange={(e) => setSaveVersionSummary(e.target.value)}
              placeholder="Enter version summary (optional)"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVersion}>
              Save Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
