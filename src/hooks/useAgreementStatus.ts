import { useState, useEffect, useCallback } from 'react';
import { 
  AgreementState, 
  IdentityAgreement, 
  ConfidentialityAgreement, 
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
        return JSON.parse(stored);
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

  // Stage 1: Identity verification
  const isIdentityVerified = state.identity.verified;
  const identityVerifiedAt = state.identity.verifiedAt;

  const verifyIdentity = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const verifiedAt = new Date().toISOString();
      setState(prev => ({
        ...prev,
        identity: { verified: true, verifiedAt }
      }));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Stage 2: Confidentiality
  const isConfidentialityComplete = 
    state.confidentiality.confidentialityAgreed &&
    state.confidentiality.nonCircumventionAgreed &&
    state.confidentiality.workBoundariesAgreed;
  const confidentialityCompletedAt = state.confidentiality.completedAt;

  const updateConfidentiality = useCallback((data: Partial<ConfidentialityAgreement>) => {
    setState(prev => ({
      ...prev,
      confidentiality: { ...prev.confidentiality, ...data }
    }));
  }, []);

  const completeConfidentiality = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const completedAt = new Date().toISOString();
      setState(prev => ({
        ...prev,
        confidentiality: { ...prev.confidentiality, completedAt }
      }));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Stage 3: Full MSA
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
        identity: { verified: true, verifiedAt: now },
        confidentiality: {
          confidentialityAgreed: true,
          nonCircumventionAgreed: true,
          workBoundariesAgreed: true,
          completedAt: now
        },
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
  const allComplete = isIdentityVerified && isConfidentialityComplete && isFullMSAComplete;

  // Reset for demo
  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...initialAgreementState });
    window.location.reload();
  }, []);

  return {
    // State
    state,
    
    // Stage 1: Identity
    isIdentityVerified,
    identityVerifiedAt,
    verifyIdentity,
    
    // Stage 2: Confidentiality
    confidentiality: state.confidentiality,
    isConfidentialityComplete,
    confidentialityCompletedAt,
    updateConfidentiality,
    completeConfidentiality,
    
    // Stage 3: Full MSA
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
