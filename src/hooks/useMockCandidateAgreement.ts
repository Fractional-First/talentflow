import { useState, useEffect } from 'react';

export type TNCStatus = 'NOT_REQUIRED' | 'REQUIRED' | 'ACCEPTED';

export function useMockCandidateAgreement() {
  // Read initial state from localStorage (persists across page refreshes)
  const [tncStatus, setTncStatus] = useState<TNCStatus>(() => {
    const stored = localStorage.getItem('demo_tnc_status');
    return (stored as TNCStatus) || 'REQUIRED'; // Default to REQUIRED for demo
  });

  // Persist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('demo_tnc_status', tncStatus);
  }, [tncStatus]);

  const acceptAgreement = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Record acceptance
    setTncStatus('ACCEPTED');
    localStorage.setItem('demo_tnc_accepted_at', new Date().toISOString());
  };

  const resetDemo = () => {
    setTncStatus('REQUIRED');
    localStorage.removeItem('demo_tnc_accepted_at');
  };

  return {
    tncStatus,
    tncRequired: tncStatus === 'REQUIRED',
    tncAccepted: tncStatus === 'ACCEPTED',
    acceptAgreement,
    resetDemo,
    isAccepting: false
  };
}
