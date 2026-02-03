import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef } from "react"

interface MSAModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tocItems = [
  { id: "definitions", number: "1", title: "Definitions" },
  { id: "scope", number: "2", title: "Scope of Agreement" },
  { id: "representations", number: "3", title: "Representations & Warranties" },
  { id: "ff-role", number: "4", title: "FF's Role & Responsibilities" },
  { id: "engagement-based", number: "5", title: "Engagement-Based Assignments" },
  { id: "candidate-conduct", number: "6", title: "Candidate Conduct, Obligations & Performance Standards" },
  { id: "commercial-terms", number: "7", title: "Commercial Terms for Engagement-Based and Direct-Hire Opportunities" },
  { id: "reserved", number: "8", title: "Reserved" },
  { id: "ecosystem", number: "9", title: "Ecosystem Partnership, Opportunity Flow & Referrals" },
  { id: "non-circumvention", number: "10", title: "Non-Circumvention" },
  { id: "ip", number: "11", title: "Intellectual Property" },
  { id: "confidentiality", number: "12", title: "Confidentiality" },
  { id: "data-protection", number: "13", title: "Data Protection" },
  { id: "limitation", number: "14", title: "Limitation of Liability" },
  { id: "term", number: "15", title: "Term, Termination & General Provisions" },
  { id: "schedule-1", number: "", title: "Schedule 1 – Statement of Work Template" },
]

export const MSAModal = ({ open, onOpenChange }: MSAModalProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        const elementTop = element.offsetTop - 20
        scrollContainer.scrollTo({ top: elementTop, behavior: 'smooth' })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            Master Candidate Agreement
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            December 2025
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="py-6 space-y-8 text-sm leading-relaxed">
            {/* Table of Contents */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">TABLE OF CONTENTS</h2>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left py-1 text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    {item.number && `${item.number}. `}{item.title}
                  </button>
                ))}
              </nav>
            </section>

            {/* Preamble */}
            <section className="space-y-4">
              <p className="text-muted-foreground">
                This Master Candidate Agreement ("Agreement") is entered into between Digital.Direction Singapore Services Pte. Ltd. (UEN: 200710712W), operating as Fractional First ("FF"), and the individual or entity accepting this Agreement ("Candidate").
              </p>
              <p className="text-muted-foreground">
                By accepting this Agreement, the Candidate agrees to the following terms.
              </p>
            </section>

            {/* Section 1: Definitions */}
            <section id="definitions" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">1. DEFINITIONS</h2>
              <p className="text-muted-foreground">For purposes of this Agreement:</p>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>1.1 "Affiliate"</strong> means any entity that directly or indirectly controls, is controlled by, or is under common control with a party.</p>
                
                <p><strong>1.2 "Assignment"</strong> means any fractional, interim, advisory, consulting, project-based, or specialist engagement facilitated by FF and documented through a Statement of Work ("SOW"). Assignments apply only to Engagement-Based Assignments and do not include Direct-Hire Opportunities.</p>
                
                <p><strong>1.3 "Beneficiary Entity"</strong> means any entity benefiting from an Assignment, whether known or unknown to the Candidate at the time of introduction.</p>
                
                <p><strong>1.4 "Client"</strong> means any existing, former, or prospective organisation with which FF has engaged, is engaging, or intends to engage regarding leadership, advisory, or placement opportunities, including pipeline, evaluation-stage, and outreach-stage organisations, and their Affiliates, subsidiaries, portfolio companies, Beneficiary Entities, and related entities.</p>
                
                <p><strong>1.5 "Disclosed Client"</strong> means any Client (including its Affiliates, subsidiaries, parent entities, Portfolio Companies, Beneficiary Entities, and related organisations) whose identity:</p>
                <ul className="list-none ml-4 space-y-1">
                  <li>(a) FF discloses, mentions, or discusses with the Candidate; or</li>
                  <li>(b) the Candidate independently learns is a Client of FF.</li>
                </ul>
                
                <p><strong>1.6 "Exempt Client"</strong> means a Disclosed Client for which the Candidate:</p>
                <ul className="list-none ml-4 space-y-1">
                  <li>(a) notifies FF in writing within three (3) business days of becoming aware of the Disclosed Client;</li>
                  <li>(b) provides reasonable documentary evidence of a bona fide professional relationship that was active within the preceding twelve (12) months; and</li>
                  <li>(c) receives written confirmation from FF that the Disclosed Client qualifies as an Exempt Client.</li>
                </ul>
                
                <p><strong>1.7 "Internal Stakeholder"</strong> means any Client personnel, board member, investor, family office representative, or decision-maker associated with a Client.</p>
                
                <p><strong>1.8 "Opportunity"</strong> includes any potential role, mandate, project, consulting scope, advisory engagement, leadership requirement, or hiring need.</p>
                
                <p><strong>1.9 "Opportunity Flow"</strong> has the meaning set out in Section 9.2.</p>
                
                <p><strong>1.10 "Direct-Hire Opportunity"</strong> means any full-time, part-time, permanent, long-term, or other employment-based, whether arising directly or indirectly from FF's introductions, Opportunity Flow, conversions from Engagement-Based Assignments, ecosystem participation, or any interaction facilitated by FF, including any role or engagement in which the Candidate provides services directly to the Client (or its affiliates) outside a Statement of Work governed by FF.</p>
                <p className="ml-4">Direct-Hire Opportunities are not governed by Statements of Work and are subject to FF's client-borne placement or conversion fee arrangements.</p>
                
                <p><strong>1.11 "Engagement-Based Assignments"</strong> means any fractional, interim, advisory, consulting, project-based, specialist scopes, or other non-employment-based contract relationships facilitated by FF. These Assignments are governed by Statements of Work ("SOWs") issued by FF.</p>
                
                <p><strong>1.12 "SOW" or "Statement of Work"</strong> means a written schedule, agreement, or confirmation setting out the commercial terms of an Assignment substantially in the form set out in Schedule 1.</p>
                
                <p><strong>1.13 "Work Product"</strong> has the meaning set out in Section 11.1.</p>
                
                <p><strong>1.14 "Candidate Personnel"</strong> Where the Candidate is a legal entity or other business form, "Candidate Personnel" means the natural-person personnel of that entity or other business form who is agreed between the parties to perform the services under any Assignment. A reference to Candidate includes, where relevant, a reference to Candidate Personnel, jointly and severally.</p>
              </div>
            </section>

            {/* Section 2: Scope of Agreement */}
            <section id="scope" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">2. SCOPE OF AGREEMENT</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>2.1 Master Relationship</strong></p>
                <p>This Agreement governs all Assignments, Opportunities, introductions, interactions, referrals, and engagements facilitated by FF.</p>
                
                <p><strong>2.2 Non-Employment</strong></p>
                <p>Nothing in this Agreement creates an employment, partnership, joint venture, or agency relationship between the Candidate and FF.</p>
                
                <p><strong>2.3 No Agency or Placement Guarantee</strong></p>
                <p>The Candidate acknowledges that FF does not act as an agent or representative of the Candidate in securing employment or engagements and does not guarantee any Assignment, Direct-Hire Opportunity, role, or outcome. Any decision to offer employment or enter into an engagement is made solely by the relevant Client, and the Candidate participates on a voluntary basis.</p>
              </div>
            </section>

            {/* Section 3: Representations & Warranties */}
            <section id="representations" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">3. REPRESENTATIONS & WARRANTIES</h2>
              <p className="text-muted-foreground">The Candidate represents and warrants that:</p>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>3.1 Accuracy of Information</strong></p>
                <p>All information provided to FF or Clients is accurate, complete, and not misleading.</p>
                
                <p><strong>3.2 Capability & Experience</strong></p>
                <p>The Candidate possesses the skills, experience, and qualifications to perform Assignments with professional competence.</p>
                
                <p><strong>3.3 No Conflicts</strong></p>
                <p>The Candidate is free to enter into this Agreement and performing Assignments will not breach any contractual or legal obligations, including any prior agreement that would prevent the Candidate from disclosing or assigning ideas, inventions, computer software, trade secrets, or other intellectual property to a Client.</p>
                
                <p><strong>3.4 Professional Conduct</strong></p>
                <p>The Candidate will act ethically, lawfully, and in a manner that upholds FF's reputation with Clients.</p>
                
                <p><strong>3.5 Compliance with Laws</strong></p>
                <p>The Candidate shall comply with all applicable laws, regulations, and professional standards.</p>
                
                <p><strong>3.6 Background and Qualifications</strong></p>
                <ul className="list-none ml-4 space-y-1">
                  <li>(a) The Candidate is properly qualified and holds all necessary permits, licences, visas, and other authorisations under applicable laws to perform the Assignments contemplated by this Agreement.</li>
                  <li>(b) The Candidate has not been convicted of, pleaded guilty to, or charged with any offence involving dishonesty, fraud, corruption, or bribery in any jurisdiction.</li>
                </ul>
              </div>
            </section>

            {/* Section 4: FF's Role & Responsibilities */}
            <section id="ff-role" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">4. FF'S ROLE & RESPONSIBILITIES</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>4.1 Platform & Introductions</strong></p>
                <p>FF provides curated introductions, opportunity routing, ecosystem access, and Assignment facilitation.</p>
                
                <p><strong>4.2 Communications Management</strong></p>
                <p>FF may communicate with Clients on behalf of the Candidate regarding availability, scope, fit, engagement terms, and performance.</p>
                
                <p><strong>4.3 Commercial Handling</strong></p>
                <p>FF may facilitate discussions with Clients regarding scope, rates, and engagement terms, draft SOWs, and coordinate invoicing and payments where relevant. FF does not act as the Candidate's agent in negotiating employment or engagement terms.</p>
                
                <p><strong>4.4 Client Decisions Outside of FF's Control</strong></p>
                <p>FF is not responsible for Client decisions, budget changes, hiring freezes, or termination of Assignments.</p>
                
                <p><strong>4.5 FF Not Liable for Client Acts or Omissions</strong></p>
                <p>FF is not liable for any acts, omissions, or errors of any Client (whether wilful, negligent, or otherwise), including any claims, actions, proceedings, losses, liabilities, costs, expenses, or damages suffered or incurred by the Candidate arising out of or in connection with the Client's conduct.</p>
              </div>
            </section>

            {/* Section 5: Engagement-Based Assignments */}
            <section id="engagement-based" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">5. ENGAGEMENT-BASED ASSIGNMENTS</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>5.1 Nature of Engagement-Based Assignments</strong></p>
                <p>The Candidate performs services under the Client's direction and supervision. FF acts solely as an introducer, quality-assurance, and payment-collection facilitator and agent, and is not responsible for the Candidate's performance, deliverables, or any acts or omissions of the Candidate or Client.</p>
                
                <p><strong>5.2 Statements of Work (SOWs)</strong></p>
                <p>Each Engagement-Based Assignment shall be documented in an SOW specifying the scope, deliverables, fees, duration, reporting lines, and commercial terms.</p>
                
                <p><strong>5.3 Acceptance or Decline of Assignments</strong></p>
                <p>The Candidate may accept or decline an Engagement-Based Assignment. Upon acceptance, the Candidate must fulfil the Assignment with diligence, professionalism, and in good faith.</p>
                
                <p><strong>5.4 Changes to Scope</strong></p>
                <p>The Candidate shall notify FF of any material changes in the scope of services that the Client may require, including those that may affect the commercial terms of the SOW. These changes are not binding on FF, unless FF agrees otherwise.</p>
                
                <p><strong>5.5 Multi-Assignment Capability</strong></p>
                <p>The Candidate may perform multiple Engagement-Based Assignments concurrently, provided that performance standards are maintained and no conflict of interest arises.</p>
                
                <p><strong>5.6 Applicability of Sections</strong></p>
                <p>Sections 1–4 and Sections 6–15 apply equally to all Assignments and all Direct-Hire Opportunities. Section 7.1 applies to Engagement-Based Assignments. Sections 7.2 and 7.3 apply to Direct-Hire Opportunities.</p>
              </div>
            </section>

            {/* Section 6: Candidate Conduct */}
            <section id="candidate-conduct" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">6. CANDIDATE CONDUCT, OBLIGATIONS, & PERFORMANCE STANDARDS</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>6.1 Professional Conduct and Cooperation</strong></p>
                <p>The Candidate shall act professionally, respectfully, and in good faith throughout all interactions with FF, Clients, and related parties, including introductions, evaluations, interviews, negotiations, and performance of Assignments. The Candidate shall respond promptly to FF communications, provide requested information, and collaborate in Opportunity development and Client processes.</p>
                
                <p><strong>6.2 Notification</strong></p>
                <p>The Candidate shall promptly notify FF of direct Client outreach, potential conversions, conflicts, or changes affecting availability or performance.</p>
                
                <p><strong>6.3 Participation in Processes</strong></p>
                <p>If the Candidate chooses to pursue an Opportunity, the Candidate shall route all communications, discussions, interviews, meetings, and negotiations exclusively through FF (unless FF consents otherwise) and participate in reasonable Client processes.</p>
                
                <p><strong>6.4 Performance Standards</strong></p>
                <p>For accepted Assignments, the Candidate shall perform services diligently and competently in accordance with the SOW, maintain clear communication, escalate issues promptly, and comply with all Client policies and applicable laws.</p>
                
                <p><strong>6.5 No Bypass or Harm to FF</strong></p>
                <p>The Candidate shall not circumvent FF's processes, undermine its commercial structures, or engage in conduct that harms FF's reputation, ecosystem, or relationships.</p>
                
                <p><strong>6.6 Candidate Personnel</strong></p>
                <p>Where the Candidate is a legal entity or other business form:</p>
                <ul className="list-none ml-4 space-y-1">
                  <li>(a) the Candidate shall procure that each Candidate Personnel performs and complies with all of the Candidate's obligations under this Agreement;</li>
                  <li>(b) the Candidate and each Candidate Personnel shall be jointly and severally liable for performance of this Agreement;</li>
                  <li>(c) the Candidate shall not change the Candidate Personnel assigned to any Assignment without FF's prior written consent;</li>
                  <li>(d) the Candidate shall indemnify FF against all losses, costs, expenses, and liabilities that FF may suffer or incur arising out of or in connection with any act or omission of the Candidate Personnel; and</li>
                  <li>(e) each Candidate Personnel shall indemnify FF against all losses, costs, expenses, and liabilities that FF may suffer or incur arising out of or in connection with any breach by the Candidate of this Agreement.</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Commercial Terms */}
            <section id="commercial-terms" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">7. COMMERCIAL TERMS FOR ENGAGEMENT-BASED AND DIRECT-HIRE OPPORTUNITIES</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>7.1 Engagement-Based Assignments</strong></p>
                <p>Fees, invoicing, expenses, and payment terms shall be as set out in the applicable SOW. FF typically pre-invoices Clients monthly in advance based on agreed forecasts or projections and reconciles any over- or under-utilisation in subsequent months.</p>
                <p>The Candidate shall submit invoices to FF in accordance with the SOW, typically at the completion of each month (or other agreed period) once the services delivered in that period are clear.</p>
                <p>Payment is structured as follows:</p>
                <ul className="list-none ml-4 space-y-2">
                  <li>(a) <strong>Client Payment Contingency:</strong> FF's obligation to pay the Candidate is contingent upon FF receiving cleared funds from the Client for the corresponding services. The Candidate acknowledges that FF acts as a payment collection and disbursement agent, not as a principal payor.</li>
                  <li>(b) <strong>Payment Timing:</strong> Subject to subsection (a), FF shall pay the Candidate within fifteen (15) business days after the later of:
                    <ul className="list-none ml-4 mt-1 space-y-1">
                      <li>(i) receipt of the Candidate's valid invoice;</li>
                      <li>(ii) the end of the relevant service period; and</li>
                      <li>(iii) expiry of the seven (7) business-day Client dispute window.</li>
                    </ul>
                  </li>
                  <li>(c) <strong>Client Delays or Disputes:</strong> If the Client delays payment, disputes any amount, or reduces payment, FF may proportionally delay, reduce, or withhold the corresponding payment to the Candidate until the matter is resolved and cleared funds are received from the Client.</li>
                  <li>(d) <strong>Dispute Resolution Facilitation:</strong> FF may, at its sole discretion, facilitate resolution of payment disputes by reviewing both parties' positions and documentation. FF's determination as to the amount ultimately payable by the Client shall be final and binding for purposes of determining the amount payable to the Candidate under this Agreement.</li>
                  <li>(e) <strong>Direct Client Pursuit:</strong> Nothing in this Section prevents the Candidate from pursuing any claim directly against the Client for services rendered, provided such pursuit does not breach Sections 9, 10, or 12 of this Agreement.</li>
                </ul>
                <p>FF may deduct applicable withholding or similar taxes without gross-up. The Candidate shall not negotiate alternative commercial arrangements directly with Clients without FF's approval.</p>
                
                <p><strong>7.2 Direct-Hire Opportunities</strong></p>
                <p>The Candidate being considered for Direct-Hire Opportunities shall not interfere with FF's placement fees, negotiate independently, or accept offers from any Disclosed Client without FF's knowledge and prior written consent. All communications, interviews, discussions, and negotiations relating to any Direct-Hire Opportunity must be coordinated through FF.</p>
                
                <p><strong>7.3 Conversion of Engagement-Based Assignments Into Direct-Hire Opportunities</strong></p>
                <p>If an Engagement-Based Assignment results in, or is converted into, a full-time, part-time, permanent, long-term, or employment-based role with a Client or any Internal Stakeholder, such outcome is deemed a Direct-Hire Opportunity. In such cases:</p>
                <ul className="list-none ml-4 space-y-1">
                  <li>(a) FF's client-borne placement-fee arrangements apply automatically to any such conversion.</li>
                  <li>(b) The Candidate must notify FF in writing within five (5) business days of the Client or any Internal Stakeholder first raising the possibility of conversion, whether directly or indirectly, and must provide details of the nature of the discussions and the Candidate's interest level.</li>
                  <li>(c) If the Candidate declines the opportunity and timely notifies FF per subsection (b), the Candidate may continue or conclude the Assignment per the SOW, and has no further obligation regarding that specific conversion discussion.</li>
                  <li>(d) If the Candidate expresses interest or wishes to explore the opportunity, all subsequent discussions, interviews, and negotiations must occur exclusively through FF.</li>
                  <li>(e) If the Candidate fails to notify FF within the timeframe specified in subsection (b), or provides incomplete or misleading information, such failure shall constitute a material breach of this Agreement. If the Candidate subsequently accepts a Direct-Hire Opportunity with that Client within the non-circumvention period, the Candidate shall:
                    <ul className="list-none ml-4 mt-1 space-y-1">
                      <li>(i) immediately notify FF of the acceptance; and</li>
                      <li>(ii) cooperate fully with FF in FF's efforts to collect its placement fee from the Client, including providing written confirmation of the engagement terms and start date.</li>
                    </ul>
                  </li>
                  <li>(f) For the avoidance of doubt, FF's entitlement to its placement fee from the Client arises regardless of whether the Candidate complied with the notification requirements in this Section 7.3, and the Candidate's breach does not affect FF's right to pursue such fee from the Client.</li>
                </ul>
                
                <p><strong>7.4 Cross-Reference</strong></p>
                <p>For clarity, the applicability of sections to Engagement-Based Assignments and Direct-Hire Opportunities is set out in Section 5.6.</p>
              </div>
            </section>

            {/* Section 8: Reserved */}
            <section id="reserved" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">8. RESERVED</h2>
              <p className="text-muted-foreground italic">Intentionally left blank</p>
            </section>

            {/* Section 9: Ecosystem */}
            <section id="ecosystem" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">9. ECOSYSTEM PARTNERSHIP, OPPORTUNITY FLOW & REFERRALS</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>9.1 Ecosystem Participation</strong></p>
                <p>The Candidate participates in FF's curated ecosystem of senior operators. This enables collaboration, opportunity routing, and multi-party coordination. This does not create a partnership, joint venture, employment, or fiduciary relationship.</p>
                
                <p><strong>9.2 Definition of Opportunity Flow</strong></p>
                <p>"Opportunity Flow" means any indication—direct or indirect—that a Client, Internal Stakeholder, Beneficiary Entity, or related organisation may require senior leadership or executive-level services (including C-level, VP-level, or equivalent fractional, interim, advisory, consulting, project-based, or full-time roles; anticipated leadership gaps; executive project or advisory needs; portfolio-level leadership discussions; or "you should meet…" referrals at executive level). For the avoidance of doubt, Opportunity Flow does not include mid-level, junior, or non-executive roles.</p>
                
                <p><strong>9.3 Duty to Disclose and Route Opportunity Flow</strong></p>
                <p>The obligations in this Section apply only to Opportunity Flow as defined in Section 9.2. The Candidate must use reasonable efforts to notify FF of all such Opportunity Flow upon becoming aware of it and route Client needs through FF.</p>
                
                <p><strong>9.4 Referral Exclusivity</strong></p>
                <p>The Candidate shall not introduce or recommend consultants, operators, talent providers, recruiters, or any other third-party service providers to Clients without FF's prior approval.</p>
                
                <p><strong>9.5 Duty to Refer New Client Leads and Cross-Engagement Continuity</strong></p>
                <p>If the Candidate becomes aware of organisations seeking leadership or advisory support, the Candidate shall use reasonable efforts to notify FF and, where appropriate, make a warm introduction.</p>
                
                <p><strong>9.6 Exception for Specific Assignments</strong></p>
                <p>Notwithstanding this Section 9, if the applicable SOW for an Engagement-Based Assignment expressly states that the Candidate is not required to route certain or all hiring opportunities or Opportunity Flow through FF (for example, where the Candidate's role is primarily to lead talent acquisition or executive search for the Client), the Candidate shall be exempted from those routing and disclosure obligations to the extent specified in the SOW.</p>
              </div>
            </section>

            {/* Section 10: Non-Circumvention */}
            <section id="non-circumvention" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">10. NON-CIRCUMVENTION</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>10.1 Core Obligation</strong></p>
                <p>The Candidate shall not circumvent, bypass, or dilute FF's commercial rights in relation to any introduction, Opportunity, or Assignment facilitated directly or indirectly by FF.</p>
                
                <p><strong>10.2 Scope of Protection</strong></p>
                <p>This Section applies to Assignments, Direct-Hire Opportunities, renewals, extensions, expansions, engagements with Internal Stakeholders, Beneficiary Entities, portfolio companies, affiliates, subsidiaries, related entities, referrals, derivative opportunities, and any Opportunity Flow.</p>
                
                <p><strong>10.3 Duration</strong></p>
                <p>This non-circumvention obligation applies for a period of twenty-four (24) months from the later of:</p>
                <ul className="list-none ml-4 space-y-1">
                  <li>(a) the date on which the organisation became a Disclosed Client; and</li>
                  <li>(b) the date of the last FF-facilitated interaction between the Candidate and that Disclosed Client, including the completion date of any prior engagement.</li>
                </ul>
                <p className="mt-2">You acknowledge that the Client has agreed to pay Fractional First a conversion fee or other applicable fee in the event that you enter into a direct employment or engagement relationship with the Client (or any of its affiliates) during the restricted period described above.</p>
                
                <p><strong>10.4 Anti-Collusion and Intermediary Circumvention</strong></p>
                <p>The Candidate shall not encourage or participate in arrangements intended to avoid FF's commercial involvement or use intermediaries or alternative structures to bypass FF.</p>
                
                <p><strong>10.5 Cooperation and Consequences</strong></p>
                <p>The Candidate shall cooperate with FF to verify compliance. Breach entitles FF to its full commercial entitlement (including lost placement or conversion fees), indemnity for losses (including lost fees), and injunctive relief.</p>
              </div>
            </section>

            {/* Section 11: Intellectual Property */}
            <section id="ip" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">11. INTELLECTUAL PROPERTY</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>11.1 Ownership and Assignment of Work Product</strong></p>
                <p>All outputs created by the Candidate during an Assignment ("Work Product") belong to the relevant Client upon creation. The Candidate assigns to the Client all rights in Work Product, including intellectual property rights (or grants a perpetual, irrevocable, royalty-free licence where full assignment is not possible). The Candidate waives moral rights to the extent permitted by law.</p>
                
                <p><strong>11.2 Pre-Existing Materials and Warranties</strong></p>
                <p>If pre-existing materials are incorporated in a Work Product, the Candidate grants the Client a perpetual licence to use them as so incorporated. The Candidate warrants that Work Product is original or properly licensed, does not infringe third-party rights, and contains no harmful code.</p>
                
                <p><strong>11.3 Indemnity</strong></p>
                <p>The Candidate indemnifies FF against claims or losses arising from breaches of this Section.</p>
              </div>
            </section>

            {/* Section 12: Confidentiality */}
            <section id="confidentiality" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">12. CONFIDENTIALITY</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>12.1 Definition and Obligations</strong></p>
                <p>"Confidential Information" includes all non-public information disclosed by FF, Clients, or related entities. The Candidate shall maintain strict confidentiality, use it solely for Assignment purposes, limit access, and notify FF of any unauthorised disclosure.</p>
                
                <p><strong>12.2 Exclusions and Required Disclosure</strong></p>
                <p>Confidential Information excludes information that is publicly available (without breach), lawfully obtained from third parties, or independently developed. If legally compelled to disclose, the Candidate shall give FF advance notice (where permitted) and limit disclosure. Notwithstanding the exclusions in this paragraph, the identity of any Client and the existence, nature, scope, or terms of any Opportunity, Assignment, or engagement with a Client shall remain Confidential Information unless and until such information is publicly disclosed by FF or the Client itself.</p>
                
                <p><strong>12.3 Survival</strong></p>
                <p>Confidentiality obligations survive for five (5) years after termination, and indefinitely for trade secrets, proprietary methodologies, personal data, and ecosystem structural information. Upon request or termination, the Candidate shall promptly return or destroy all Confidential Information, except as required to retain for compliance with applicable laws or data retention policies (in which case this Section shall continue to apply to the retained information). Nothing in this Agreement grants any rights, by license or otherwise, to Confidential Information.</p>
              </div>
            </section>

            {/* Section 13: Data Protection */}
            <section id="data-protection" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">13. DATA PROTECTION</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>13.1 Compliance and Handling</strong></p>
                <p>The Candidate shall comply with all applicable data protection laws (including Singapore's PDPA) and process personal data only for legitimate Assignment purposes with appropriate security measures.</p>
                
                <p><strong>13.2 Breach Notification and Return/Destruction</strong></p>
                <p>The Candidate shall notify FF immediately of any data breach and, upon request or termination, return or securely destroy all personal data. The Candidate is liable for losses arising from breaches.</p>
              </div>
            </section>

            {/* Section 14: Limitation of Liability */}
            <section id="limitation" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">14. LIMITATION OF LIABILITY</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>14.1 FF Not Responsible for Client Conduct</strong></p>
                <p>FF is not liable for Client decisions, conduct, delays, changes in strategy, non-payment, or termination of Assignments, nor for the Candidate's performance, deliverables, or any acts or omissions of the Candidate.</p>
                
                <p><strong>14.2 No Consequential Loss and Liability Cap</strong></p>
                <p>FF is not liable for indirect, incidental, special, or consequential damages. FF's total liability is capped at the fees paid by FF to the Candidate in the three (3) months preceding the claim.</p>
                
                <p><strong>14.3 Non-Excludable Liability</strong></p>
                <p>Nothing limits liability for death or personal injury caused by negligence or fraud, or matters that cannot be excluded by law.</p>
              </div>
            </section>

            {/* Section 15: Term, Termination & General Provisions */}
            <section id="term" className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">15. TERM, TERMINATION & GENERAL PROVISIONS</h2>
              
              <div className="space-y-3 text-muted-foreground">
                <p><strong>15.1 Term and Termination for Convenience</strong></p>
                <p>This Agreement takes effect upon acceptance and continues until terminated by either party on Thirty (30) days' written notice.</p>
                
                <p><strong>15.2 Immediate Termination by FF</strong></p>
                <p>FF may terminate immediately (with a five (5) business day cure period where the breach is curable) for material breaches, misconduct, unethical behaviour, inadequate performance, or conduct harming FF's reputation or relationships.</p>
                
                <p><strong>15.3 Obligations on Termination</strong></p>
                <p>Upon termination, ongoing Assignments conclude per their SOW, the Candidate shall return/destroy confidential materials and assist with transition if required. Payment and survival obligations remain enforceable.</p>
                
                <p><strong>15.4 Survival</strong></p>
                <p>Sections 1, 8–14, 15.3–15.4, and confidentiality/indefinite protections survive termination.</p>
                
                <p><strong>15.5 Governing Law and Jurisdiction</strong></p>
                <p>This Agreement is governed by Singapore law. The Parties submit to the non-exclusive jurisdiction of the Singapore courts (exclusive if the Candidate is Singapore-based).</p>
                
                <p><strong>15.6 Dispute Resolution, Notices, Assignment, and Miscellaneous</strong></p>
                <p>Notices may be by email. The Candidate may not assign this Agreement without FF's consent; FF may assign to any Affiliate.</p>
                
                <p><strong>15.7 Force Majeure</strong></p>
                <p>Neither party shall be liable for any failure or delay in performing its obligations under this Agreement (except for payment obligations) to the extent such failure or delay is caused by events beyond its reasonable control, including acts of God, war, riot, civil commotion, epidemic, pandemic, fire, flood, storm, or governmental regulation. The affected party shall promptly notify the other and use reasonable efforts to mitigate the effects.</p>
                
                <p><strong>15.8 Updates to Terms</strong></p>
                <p>FF may update this Agreement from time to time by providing reasonable notice to the Candidate. Any update shall apply prospectively only and shall not affect accrued rights or existing Assignments unless expressly agreed. Continued participation in Assignments or Direct-Hire Opportunities after the effective date of an update constitutes acceptance of the updated terms.</p>
              </div>
            </section>

            {/* Schedule 1 – Statement of Work Template */}
            <section id="schedule-1" className="space-y-6">
              <h2 className="text-lg font-bold text-foreground">SCHEDULE 1 – STATEMENT OF WORK TEMPLATE</h2>
              
              <div className="space-y-4 text-muted-foreground">
                <div className="text-center space-y-2">
                  <p className="font-semibold text-foreground">STATEMENT OF WORK (SOW)</p>
                  <p className="font-medium">Fractional First – Engagement-Based Assignment</p>
                </div>
                
                <p>This Statement of Work ("SOW") is entered into as of __________________ ("Effective Date") and forms part of the Master Candidate Agreement between Digital.Direction Singapore Services Pte. Ltd., operating as Fractional First ("FF"), and the Candidate.</p>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-foreground">1. Parties</p>
                    <div className="ml-4 space-y-1">
                      <p><strong>Fractional First:</strong> Digital.Direction Singapore Services Pte. Ltd. (operating as Fractional First)</p>
                      <p><strong>Candidate:</strong> ______________________________</p>
                      <p><strong>(If entity) Candidate Personnel:</strong> ______________________________</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">2. Client</p>
                    <div className="ml-4 space-y-1">
                      <p><strong>Client Name / Entity:</strong> ______________________________</p>
                      <p><strong>Client Address:</strong> ______________________________</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">3. Engagement Details</p>
                    <div className="ml-4 space-y-2">
                      <p><strong>Role / Title:</strong> ______________________________</p>
                      <p><strong>Nature:</strong> ☐ Fractional ☐ Interim ☐ Advisory ☐ Consulting ☐ Project-Based ☐ Other: ________</p>
                      <p><strong>Scope of Services / Key Deliverables:</strong></p>
                      <div className="border border-border rounded p-3 min-h-[60px] bg-muted/30"></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">4. Term</p>
                    <div className="ml-4 space-y-1">
                      <p><strong>Start Date:</strong> __________________</p>
                      <p><strong>End Date (if fixed):</strong> __________________ OR ☐ Ongoing until terminated on ____ days' notice</p>
                      <p><strong>Expected Time Commitment:</strong> __________________</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">5. Reporting & Communication</p>
                    <div className="ml-4">
                      <p><strong>Reports to:</strong> ______________________________</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">6. Commercial Terms</p>
                    <div className="ml-4 space-y-1">
                      <p><strong>Rate:</strong> ______________________________ (all rates exclude GST, if applicable)</p>
                      <p><strong>Invoicing / Payment Terms:</strong> ______________________________</p>
                      <p><strong>Expenses:</strong> ☐ Reimbursable (with approval) ☐ Not reimbursable</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">7. Location & Arrangements</p>
                    <div className="ml-4 space-y-1">
                      <p><strong>Primary Location:</strong> ☐ Remote ☐ On-site ☐ Hybrid</p>
                      <p><strong>Travel Required:</strong> ______________________________</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">8. Additional Terms (if any):</p>
                    <div className="ml-4">
                      <div className="border border-border rounded p-3 min-h-[60px] bg-muted/30"></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border">
                  <p className="font-semibold text-foreground text-center mb-6">Accepted and Agreed</p>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="font-semibold text-foreground">Fractional First</p>
                      <p>By: __________________</p>
                      <p>Name: __________________</p>
                      <p>Title: __________________</p>
                      <p>Date: __________________</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="font-semibold text-foreground">Candidate</p>
                      <p>By: __________________</p>
                      <p>Name: __________________</p>
                      <p>Date: __________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <div className="px-6 py-4 border-t border-border flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
