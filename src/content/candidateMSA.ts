export const MSA_VERSION = 'vDecember2025';

export const MSA_CONTENT = {
  version: MSA_VERSION,
  
  stage1: {
    title: 'Identity & Eligibility',
    description: 'We need to confirm your details and how you\'ll contract with us.',
    keyConfirmations: [
      'All information you provide is accurate and complete.',
      'You are eligible to work on engagements in the relevant jurisdictions.',
      'You agree to complete any reasonable profile assessments if requested.'
    ],
    signingOptions: {
      individual: 'As an individual',
      entity: 'As personnel of an entity'
    },
    checkboxLabel: 'I confirm the above and that I am free to enter this Agreement without conflicts.',
    continueButton: 'Continue to Confidentiality & Non-Circumvention'
  },
  
  stage2: {
    title: 'Confidentiality & Non-Circumvention',
    description: 'To share client names and opportunities, you must agree to protect our ecosystem.',
    sections: {
      confidentiality: {
        title: 'Confidentiality',
        content: 'You will keep all FF and Client information strictly confidential, use it only for FF opportunities, and return/destroy it on request. Obligations last 5 years generally and indefinitely for trade secrets and personal data.'
      },
      nonCircumvention: {
        title: 'Non-Circumvention (24 months)',
        content: 'You will not bypass FF to engage directly with any introduced Client or related entity, nor route senior/executive-level opportunities around FF (unless expressly permitted in an SOW). Any such opportunities must be disclosed to FF within 3 business days.'
      },
      workBoundaries: {
        title: 'Work Boundaries',
        content: 'Act professionally. No conflicts. Comply with client policies. Don\'t harm FF\'s reputation.'
      }
    },
    checkboxes: {
      confidentiality: 'I agree to the Confidentiality obligations.',
      nonCircumvention: 'I agree to the 24-month Non-Circumvention obligations (including senior opportunity routing).',
      workBoundaries: 'I agree to the Work Boundaries and professional conduct requirements.'
    },
    postAcceptanceNote: 'After acceptance, client names and opportunities will be visible.',
    continueButton: 'Continue to Full Agreement'
  },
  
  stage3: {
    title: 'Full Master Candidate Agreement',
    description: 'You\'re ready to join!',
    intro: 'By accepting below you agree to the complete Master Candidate Agreement, including:',
    summary: [
      'Independent contractor status',
      'Engagement rules, payments, and IP assignment',
      'Ecosystem participation and Good Leaver release'
    ],
    checkboxes: {
      fullMSA: `I have read and accept the full Master Candidate Agreement (${MSA_VERSION}).`,
      individual: 'I confirm I am signing as an individual.',
      entity: 'I confirm I am signing as entity personnel.'
    },
    submitButton: 'Accept & Join Fractional First'
  },

  fullMSA: {
    title: 'MASTER CANDIDATE AGREEMENT',
    subtitle: 'Fractional First — Candidate Master Services Agreement',
    sections: [
      {
        heading: '1. Purpose and Scope',
        content: `This Agreement governs your participation as a candidate in the Fractional First talent network. By accepting this agreement, you acknowledge your understanding of the terms under which Fractional First may introduce you to potential client opportunities.`
      },
      {
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
        heading: '3. Non-Circumvention',
        content: `For a period of twenty-four (24) months following an introduction facilitated by Fractional First, you agree not to circumvent the platform by engaging directly with the introduced client without Fractional First's involvement.

You will not route senior/executive-level opportunities around FF (unless expressly permitted in an SOW). Any such opportunities must be disclosed to FF within 3 business days.`
      },
      {
        heading: '4. Work Boundaries & Professional Conduct',
        content: `As a registered candidate in the Fractional First network, you agree to:

• Act professionally in all client interactions
• Avoid conflicts of interest
• Comply with client policies
• Not harm Fractional First's reputation
• Disclose any potential conflicts prior to client introductions`
      },
      {
        heading: '5. Independent Contractor Status',
        content: `You acknowledge and agree that:

• You are an independent contractor and not an employee of Fractional First
• No employment relationship exists or is created by this agreement
• You are responsible for your own tax obligations and benefits
• You maintain control over how you perform services for clients`
      },
      {
        heading: '6. Engagement Rules, Payments, and IP Assignment',
        content: `Any contractual relationship, terms of engagement, and compensation arrangements are negotiated directly between you and the client. Fractional First acts solely as an introduction facilitator.

You retain all rights to your professional experience, skills, and general knowledge. However, any materials, documents, or work products created specifically for a client engagement are subject to the terms of your independent agreement with that client.`
      },
      {
        heading: '7. Ecosystem Participation',
        content: `By joining the Fractional First talent network, you agree to:

• Respond promptly to introduction opportunities (within 48 hours)
• Maintain accurate availability status and work preferences
• Provide feedback on client introductions and outcomes
• Honor commitments made during the evaluation and negotiation process`
      },
      {
        heading: '8. Good Leaver Release',
        content: `Either party may terminate this agreement at any time with written notice. Upon termination:

• Your profile will be deactivated from the talent network
• Ongoing client introductions will be concluded per their existing terms
• Confidentiality obligations continue for 5 years
• Non-circumvention obligations continue for 24 months for active introductions`
      },
      {
        heading: '9. Limitation of Liability',
        content: `Fractional First makes no guarantees regarding the number or frequency of client introductions, the suitability of any particular opportunity, the outcome of client engagements, or payment terms.

Fractional First's total liability under this agreement is limited to direct damages not exceeding $500 USD.`
      },
      {
        heading: '10. Data Privacy',
        content: `By accepting this agreement, you consent to Fractional First's collection, storage, and use of your professional information for the purposes of creating and maintaining your candidate profile, matching you with relevant client opportunities, and improving platform services.

Your data will be handled in accordance with applicable data protection laws and Fractional First's Privacy Policy.`
      }
    ]
  }
};

export type SigningType = 'individual' | 'entity';

export interface MSAStage1Data {
  signingType: SigningType | null;
  entityName: string;
  confirmed: boolean;
}

export interface MSAStage2Data {
  confidentialityAgreed: boolean;
  nonCircumventionAgreed: boolean;
  workBoundariesAgreed: boolean;
}

export interface MSAStage3Data {
  fullMSAAgreed: boolean;
  signingConfirmed: boolean;
}

export interface MSAWizardState {
  currentStage: 1 | 2 | 3;
  stage1: MSAStage1Data;
  stage2: MSAStage2Data;
  stage3: MSAStage3Data;
  completedAt?: string;
}

export const initialMSAState: MSAWizardState = {
  currentStage: 1,
  stage1: {
    signingType: null,
    entityName: '',
    confirmed: false
  },
  stage2: {
    confidentialityAgreed: false,
    nonCircumventionAgreed: false,
    workBoundariesAgreed: false
  },
  stage3: {
    fullMSAAgreed: false,
    signingConfirmed: false
  }
};
