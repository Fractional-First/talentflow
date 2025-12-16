export const AGREEMENT_VERSION = 'vDecember2025';

export const AGREEMENT_CONTENT = {
  version: AGREEMENT_VERSION,
  
  // Phase 1: Accuracy Warrant (Profile Creation)
  accuracyWarrant: {
    label: 'The information I\'m about to provide is accurate and reflects me.',
    confirmedLabel: 'I have confirmed my information is accurate.'
  },
  
  // Phase 2: Terms of Service (Pre-Job Search)
  termsOfService: {
    title: 'Terms of Service',
    description: 'To unlock job matching, please review and agree to the following terms.',
    sections: {
      confidentiality: {
        title: 'Confidentiality',
        icon: 'shield',
        summary: 'Keep all client and FF information strictly confidential (5-year term).',
        content: 'You will keep all FF and Client information strictly confidential, use it only for FF opportunities, and return/destroy it on request. Obligations last 5 years generally and indefinitely for trade secrets and personal data.',
        msaSection: '2'
      },
      nonCircumvention: {
        title: 'Non-Circumvention',
        icon: 'handshake',
        summary: '24-month commitment to work through Fractional First.',
        content: 'You will not bypass FF to engage directly with any introduced Client or related entity, nor route senior/executive-level opportunities around FF (unless expressly permitted in an SOW). Any such opportunities must be disclosed to FF within 3 business days.',
        msaSection: '3'
      },
      workBoundaries: {
        title: 'Work Boundaries',
        icon: 'briefcase',
        summary: 'Maintain professional conduct at all times.',
        content: 'Act professionally. No conflicts. Comply with client policies. Don\'t harm FF\'s reputation.',
        msaSection: '4'
      }
    },
    checkboxLabel: 'I agree to the Confidentiality, Non-Circumvention, and Work Boundaries terms outlined above.',
    submitButton: 'Accept & Unlock Matching'
  },
  
  // Phase 3: Full MSA (Opportunity-Triggered) - Keep for future
  fullMSA: {
    title: 'Master Candidate Agreement',
    description: 'Complete your agreement to proceed with this opportunity.',
    intro: 'By accepting below you agree to the complete Master Candidate Agreement, including:',
    summary: [
      'Independent contractor status',
      'Engagement rules, payments, and IP assignment',
      'Ecosystem participation and Good Leaver release'
    ],
    signingOptions: {
      individual: 'I am signing as an individual',
      entity: 'I am signing as personnel of an entity'
    },
    checkboxes: {
      fullMSA: `I have read and accept the full Master Candidate Agreement (${AGREEMENT_VERSION}).`,
      signingConfirm: 'I confirm this signing selection is accurate.'
    },
    submitButton: 'Accept & Join Fractional First',
    document: {
      title: 'MASTER CANDIDATE AGREEMENT',
      subtitle: 'Fractional First — Candidate Master Services Agreement',
      sections: [
        {
          id: '1',
          heading: '1. Purpose and Scope',
          content: `This Agreement governs your participation as a candidate in the Fractional First talent network. By accepting this agreement, you acknowledge your understanding of the terms under which Fractional First may introduce you to potential client opportunities.`
        },
        {
          id: '2',
          heading: '2. Confidentiality',
          content: `You agree to maintain strict confidentiality of all client information, business strategies, organizational structures, and any proprietary information disclosed to you during the introduction and evaluation process.

This obligation extends to:
• All client names and identifying information
• Business challenges and strategic objectives
• Financial information and projections
• Organizational charts and team structures
• Any information marked as confidential or proprietary

The confidentiality obligation remains in effect for a period of five (5) years from the date of disclosure, and indefinitely for trade secrets and personal data.`
        },
        {
          id: '3',
          heading: '3. Non-Circumvention',
          content: `For a period of twenty-four (24) months following an introduction facilitated by Fractional First, you agree not to circumvent the platform by engaging directly with the introduced client without Fractional First's involvement.

You will not route senior/executive-level opportunities around FF (unless expressly permitted in an SOW). Any such opportunities must be disclosed to FF within 3 business days.`
        },
        {
          id: '4',
          heading: '4. Work Boundaries & Professional Conduct',
          content: `As a registered candidate in the Fractional First network, you agree to:

• Act professionally in all client interactions
• Avoid conflicts of interest
• Comply with client policies
• Not harm Fractional First's reputation
• Disclose any potential conflicts prior to client introductions`
        },
        {
          id: '5',
          heading: '5. Independent Contractor Status',
          content: `You acknowledge and agree that:

• You are an independent contractor and not an employee of Fractional First
• No employment relationship exists or is created by this agreement
• You are responsible for your own tax obligations and benefits
• You maintain control over how you perform services for clients`
        },
        {
          id: '6',
          heading: '6. Engagement Rules, Payments, and IP Assignment',
          content: `Any contractual relationship, terms of engagement, and compensation arrangements are negotiated directly between you and the client. Fractional First acts solely as an introduction facilitator.

You retain all rights to your professional experience, skills, and general knowledge. However, any materials, documents, or work products created specifically for a client engagement are subject to the terms of your independent agreement with that client.`
        },
        {
          id: '7',
          heading: '7. Ecosystem Participation',
          content: `By joining the Fractional First talent network, you agree to:

• Respond promptly to introduction opportunities (within 48 hours)
• Maintain accurate availability status and work preferences
• Provide feedback on client introductions and outcomes
• Honor commitments made during the evaluation and negotiation process`
        },
        {
          id: '8',
          heading: '8. Good Leaver Release',
          content: `Either party may terminate this agreement at any time with written notice. Upon termination:

• Your profile will be deactivated from the talent network
• Ongoing client introductions will be concluded per their existing terms
• Confidentiality obligations continue for 5 years
• Non-circumvention obligations continue for 24 months for active introductions`
        },
        {
          id: '9',
          heading: '9. Limitation of Liability',
          content: `Fractional First makes no guarantees regarding the number or frequency of client introductions, the suitability of any particular opportunity, the outcome of client engagements, or payment terms.

Fractional First's total liability under this agreement is limited to direct damages not exceeding $500 USD.`
        },
        {
          id: '10',
          heading: '10. Data Privacy',
          content: `By accepting this agreement, you consent to Fractional First's collection, storage, and use of your professional information for the purposes of creating and maintaining your candidate profile, matching you with relevant client opportunities, and improving platform services.

Your data will be handled in accordance with applicable data protection laws and Fractional First's Privacy Policy.`
        }
      ]
    }
  }
};

export type SigningType = 'individual' | 'entity';

// Phase 1: Accuracy Warrant
export interface AccuracyWarrantAgreement {
  agreed: boolean;
  agreedAt?: string;
}

// Phase 2: Terms of Service (Confidentiality + Non-Circumvention + Work Boundaries)
export interface TermsOfServiceAgreement {
  agreed: boolean;
  agreedAt?: string;
}

// Phase 3: Full MSA (for future opportunity-triggered signing)
export interface FullMSAAgreement {
  agreed: boolean;
  signingType: SigningType | null;
  entityName: string;
  completedAt?: string;
}

export interface AgreementState {
  accuracyWarrant: AccuracyWarrantAgreement;
  termsOfService: TermsOfServiceAgreement;
  fullMSA: FullMSAAgreement;
}

export const initialAgreementState: AgreementState = {
  accuracyWarrant: {
    agreed: false
  },
  termsOfService: {
    agreed: false
  },
  fullMSA: {
    agreed: false,
    signingType: null,
    entityName: ''
  }
};
