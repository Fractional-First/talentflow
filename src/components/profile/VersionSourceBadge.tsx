
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VersionSourceBadgeProps {
  source?: string;
}

export const VersionSourceBadge: React.FC<VersionSourceBadgeProps> = ({ source }) => {
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

