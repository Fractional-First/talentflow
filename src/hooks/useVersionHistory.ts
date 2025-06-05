
import { useState, useCallback, useRef, useEffect } from 'react';
import { VersionEntry } from '@/components/profile/types/version-types';

interface UseVersionHistoryProps {
  fieldName: string;
  initialValue: any;
  autoSaveInterval?: number; // milliseconds
}

export const useVersionHistory = ({ 
  fieldName, 
  initialValue, 
  autoSaveInterval = 30000 // 30 seconds default
}: UseVersionHistoryProps) => {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>('');
  const [currentValue, setCurrentValue] = useState(initialValue);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const lastSavedValueRef = useRef(initialValue);

  // Create initial version
  useEffect(() => {
    const initialVersion: VersionEntry = {
      id: `${fieldName}-initial-${Date.now()}`,
      timestamp: new Date(),
      content: initialValue,
      author: 'User',
      source: 'manual',
      summary: 'Initial version'
    };
    setVersions([initialVersion]);
    setCurrentVersionId(initialVersion.id);
  }, [fieldName, initialValue]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Only auto-save if value has changed significantly
    const currentStr = typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue);
    const lastSavedStr = typeof lastSavedValueRef.current === 'string' ? lastSavedValueRef.current : JSON.stringify(lastSavedValueRef.current);
    
    if (currentStr !== lastSavedStr && currentStr.trim() !== '') {
      autoSaveTimerRef.current = setTimeout(() => {
        saveVersion('Auto-saved version', 'system');
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [currentValue, autoSaveInterval]);

  const saveVersion = useCallback((summary?: string, source: 'manual' | 'system' = 'manual') => {
    const newVersion: VersionEntry = {
      id: `${fieldName}-${Date.now()}`,
      timestamp: new Date(),
      content: currentValue,
      author: 'User',
      source,
      summary: summary || `Updated ${fieldName}`
    };

    setVersions(prev => [newVersion, ...prev]);
    setCurrentVersionId(newVersion.id);
    lastSavedValueRef.current = currentValue;

    // Clear auto-save timer since we just saved
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, [fieldName, currentValue]);

  const revertToVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setCurrentValue(version.content);
      setCurrentVersionId(versionId);
      lastSavedValueRef.current = version.content;
    }
  }, [versions]);

  const updateValue = useCallback((newValue: any) => {
    setCurrentValue(newValue);
  }, []);

  const renameVersion = useCallback((versionId: string, newSummary: string) => {
    setVersions(prev => prev.map(version => 
      version.id === versionId 
        ? { ...version, summary: newSummary }
        : version
    ));
  }, []);

  return {
    versions,
    currentVersionId,
    currentValue,
    updateValue,
    saveVersion,
    revertToVersion,
    renameVersion
  };
};
