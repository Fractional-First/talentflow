import { CANDIDATE_AGREEMENT_CONTENT } from '@/content/candidateAgreement';

export function CandidateAgreementDocument() {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold mb-2">
          Client Agreement
        </h1>
        <p className="text-sm text-muted-foreground">
          Version {CANDIDATE_AGREEMENT_CONTENT.version} • 
          Last Updated: {CANDIDATE_AGREEMENT_CONTENT.lastUpdated}
        </p>
      </div>

      {CANDIDATE_AGREEMENT_CONTENT.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-foreground">{section.heading}</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
            {section.content}
          </p>
        </div>
      ))}

      <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Fractional First. All rights reserved.</p>
      </div>
    </div>
  );
}
