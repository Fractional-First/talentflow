
import { ReactNode } from 'react';

export interface VersionEntry {
  id: string;
  timestamp: Date;
  content: string | string[] | object;
  author?: string;
  source?: 'manual' | 'linkedin' | 'resume' | 'system';
  summary?: string;
}

export interface FieldVersionHistory {
  fieldName: string;
  fieldIcon: ReactNode;
  versions: VersionEntry[];
  currentVersionId: string;
}

export interface VersionWithField {
  field: string;
  fieldIcon: ReactNode;
  version: VersionEntry;
  isCurrent: boolean;
}

