import { useState, useEffect, useCallback } from 'react';
import { 
  AgreementState, 
  AccuracyWarrantAgreement,
  TermsOfServiceAgreement,
  FullMSAAgreement,
  SigningType,
  initialAgreementState 
} from '@/content/agreementContent';

const STORAGE_KEY = 'agreement_status';

export function useAgreementStatus() {
  const [state, setState] = useState<AgreementState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old state structure if needed
        if ('identity' in parsed || 'confidentiality' in parsed) {
          return initialAgreementState;
        }
        return parsed;
      } catch {
        return initialAgreementState;
      }
    }
    return initialAgreementState;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Phase 1: Accuracy Warrant
  const isWarrantAgreed = state.accuracyWarrant.agreed;
  const warrantAgreedAt = state.accuracyWarrant.agreedAt;

  const acceptWarrant = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const agreedAt = new Date().toISOString();
      setState(prev => ({
        ...prev,
        accuracyWarrant: { agreed: true, agreedAt }
      }));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Phase 2: Terms of Service
  const isTermsAccepted = state.termsOfService.agreed;
  const termsAcceptedAt = state.termsOfService.agreedAt;

  const acceptTerms = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const agreedAt = new Date().toISOString();
      setState(prev => ({
        ...prev,
        termsOfService: { agreed: true, agreedAt }
      }));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Phase 3: Full MSA (for future use)
  const isFullMSAComplete = state.fullMSA.agreed && state.fullMSA.completedAt;
  const fullMSACompletedAt = state.fullMSA.completedAt;

  const updateFullMSA = useCallback((data: Partial<FullMSAAgreement>) => {
    setState(prev => ({
      ...prev,
      fullMSA: { ...prev.fullMSA, ...data }
    }));
  }, []);

  const completeFullMSA = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const completedAt = new Date().toISOString();
      setState(prev => ({
        ...prev,
        fullMSA: { ...prev.fullMSA, completedAt }
      }));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Sign all at once
  const signAll = useCallback(async (signingType: SigningType, entityName?: string) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const now = new Date().toISOString();
      setState({
        accuracyWarrant: { agreed: true, agreedAt: now },
        termsOfService: { agreed: true, agreedAt: now },
        fullMSA: {
          agreed: true,
          signingType,
          entityName: entityName || '',
          completedAt: now
        }
      });
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Check if all agreements are complete
  const allComplete = isWarrantAgreed && isTermsAccepted && isFullMSAComplete;

  // Reset for demo
  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...initialAgreementState });
    window.location.reload();
  }, []);

  return {
    // State
    state,
    
    // Phase 1: Accuracy Warrant
    isWarrantAgreed,
    warrantAgreedAt,
    acceptWarrant,
    
    // Phase 2: Terms of Service
    isTermsAccepted,
    termsAcceptedAt,
    acceptTerms,
    
    // Phase 3: Full MSA
    fullMSA: state.fullMSA,
    isFullMSAComplete,
    fullMSACompletedAt,
    updateFullMSA,
    completeFullMSA,
    
    // Combined
    allComplete,
    signAll,
    isSubmitting,
    resetDemo
  };
}
