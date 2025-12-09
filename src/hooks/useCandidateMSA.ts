import { useState, useEffect, useCallback } from 'react';
import { 
  MSAWizardState, 
  MSAStage1Data, 
  MSAStage2Data, 
  MSAStage3Data, 
  initialMSAState 
} from '@/content/candidateMSA';

const STORAGE_KEY = 'candidate_msa_state';
const ACCEPTED_KEY = 'candidate_msa_accepted_at';

export type TNCStatus = 'NOT_REQUIRED' | 'REQUIRED' | 'ACCEPTED';

export function useCandidateMSA() {
  // Load initial state from localStorage
  const [state, setState] = useState<MSAWizardState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMSAState;
      }
    }
    return initialMSAState;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive TNC status from state
  const tncStatus: TNCStatus = state.completedAt ? 'ACCEPTED' : 'REQUIRED';
  const tncRequired = tncStatus === 'REQUIRED';
  const tncAccepted = tncStatus === 'ACCEPTED';
  const acceptedDate = state.completedAt;

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Stage 1 completion check
  const isStage1Complete = useCallback(() => {
    const { signingType, entityName, confirmed } = state.stage1;
    if (!signingType || !confirmed) return false;
    if (signingType === 'entity' && !entityName.trim()) return false;
    return true;
  }, [state.stage1]);

  // Stage 2 completion check
  const isStage2Complete = useCallback(() => {
    const { confidentialityAgreed, nonCircumventionAgreed, workBoundariesAgreed } = state.stage2;
    return confidentialityAgreed && nonCircumventionAgreed && workBoundariesAgreed;
  }, [state.stage2]);

  // Stage 3 completion check
  const isStage3Complete = useCallback(() => {
    const { fullMSAAgreed, signingConfirmed } = state.stage3;
    return fullMSAAgreed && signingConfirmed;
  }, [state.stage3]);

  // Update stage 1 data
  const updateStage1 = useCallback((data: Partial<MSAStage1Data>) => {
    setState(prev => ({
      ...prev,
      stage1: { ...prev.stage1, ...data }
    }));
  }, []);

  // Update stage 2 data
  const updateStage2 = useCallback((data: Partial<MSAStage2Data>) => {
    setState(prev => ({
      ...prev,
      stage2: { ...prev.stage2, ...data }
    }));
  }, []);

  // Update stage 3 data
  const updateStage3 = useCallback((data: Partial<MSAStage3Data>) => {
    setState(prev => ({
      ...prev,
      stage3: { ...prev.stage3, ...data }
    }));
  }, []);

  // Navigate to next stage
  const goToNextStage = useCallback(() => {
    setState(prev => {
      if (prev.currentStage < 3) {
        return { ...prev, currentStage: (prev.currentStage + 1) as 1 | 2 | 3 };
      }
      return prev;
    });
  }, []);

  // Navigate to previous stage
  const goToPreviousStage = useCallback(() => {
    setState(prev => {
      if (prev.currentStage > 1) {
        return { ...prev, currentStage: (prev.currentStage - 1) as 1 | 2 | 3 };
      }
      return prev;
    });
  }, []);

  // Go to specific stage
  const goToStage = useCallback((stage: 1 | 2 | 3) => {
    setState(prev => ({ ...prev, currentStage: stage }));
  }, []);

  // Submit final acceptance
  const acceptAgreement = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const completedAt = new Date().toISOString();
      setState(prev => ({
        ...prev,
        completedAt
      }));
      localStorage.setItem(ACCEPTED_KEY, completedAt);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Reset for demo purposes
  const resetDemo = useCallback(() => {
    setState(initialMSAState);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACCEPTED_KEY);
  }, []);

  return {
    // State
    state,
    currentStage: state.currentStage,
    stage1: state.stage1,
    stage2: state.stage2,
    stage3: state.stage3,
    
    // Status
    tncStatus,
    tncRequired,
    tncAccepted,
    acceptedDate,
    isSubmitting,
    
    // Completion checks
    isStage1Complete,
    isStage2Complete,
    isStage3Complete,
    
    // Actions
    updateStage1,
    updateStage2,
    updateStage3,
    goToNextStage,
    goToPreviousStage,
    goToStage,
    acceptAgreement,
    resetDemo
  };
}
