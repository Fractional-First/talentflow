
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, ArrowLeft, FileText, Info, AlertCircle, Lock, Fingerprint } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Agreement = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAgreedMsa, setHasAgreedMsa] = useState(false);
  const [hasAgreedConfidentiality, setHasAgreedConfidentiality] = useState(false);
  const [hasAgreedNonCircumvention, setHasAgreedNonCircumvention] = useState(false);
  const [signature, setSignature] = useState('');
  const [date, setDate] = useState('');
  
  // Include all steps in the dashboard view
  const steps: Step[] = [
    { id: 1, name: 'Sign Up', description: 'Create your account', status: 'completed' },
    { id: 2, name: 'Profile', description: 'Enter your information', status: 'completed' },
    { id: 3, name: 'Profile Snapshot', description: 'Review your profile', status: 'completed' },
    { id: 4, name: 'Agreement', description: 'Sign legal documents', status: 'current' },
    { id: 5, name: 'Branding', description: 'Enhance your profile', status: 'upcoming' },
    { id: 6, name: 'Job Matching', description: 'Get matched to jobs', status: 'upcoming' }
  ];
  
  const handleContinue = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard/branding');
    }, 1000);
  };

  const isAgreementComplete = hasAgreedMsa && hasAgreedConfidentiality && 
    hasAgreedNonCircumvention && signature.trim() !== '' && date.trim() !== '';

  return (
    <DashboardLayout steps={steps} currentStep={4}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Legal Agreements</StepCardTitle>
            <StepCardDescription>
              Review and sign the necessary legal documents before proceeding
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Please read the Master Services Agreement carefully before proceeding. This agreement outlines the terms and conditions of our services.
                </p>
              </div>
            </div>
            
            <ScrollArea className="h-[400px] rounded-lg border p-4">
              <div className="space-y-4 text-sm">
                <h3 className="text-lg font-semibold">MASTER SERVICES AGREEMENT</h3>
                <p>This Master Services Agreement (the "Agreement") is entered into as of the date of your electronic acceptance, by and between TalentFlow Inc., a Delaware corporation ("Company"), and the individual or entity identified in the registration process ("Talent").</p>
                
                <h4 className="font-semibold mt-6">1. SERVICES</h4>
                <p>1.1 Subject to the terms and conditions of this Agreement, Company will provide Talent with access to the TalentFlow platform (the "Platform"), which facilitates connections between Talent and potential employers or clients ("Clients").</p>
                <p>1.2 Company will use reasonable efforts to match Talent with suitable opportunities based on the information provided by Talent during the onboarding process and subsequent updates to Talent's profile.</p>
                <p>1.3 Talent acknowledges that Company does not guarantee any minimum number of matches or opportunities.</p>
                
                <h4 className="font-semibold mt-6">2. TALENT OBLIGATIONS</h4>
                <p>2.1 Talent agrees to provide accurate, current, and complete information during the registration process and to update such information as necessary to keep it accurate, current, and complete.</p>
                <p>2.2 Talent agrees to maintain the confidentiality of their account credentials and is solely responsible for all activities that occur under their account.</p>
                <p>2.3 Talent agrees not to use the Platform for any purpose that is unlawful or prohibited by this Agreement.</p>
                
                <h4 className="font-semibold mt-6 bg-yellow-50 p-2">3. NON-CIRCUMVENTION</h4>
                <div className="bg-yellow-50 p-2">
                  <p>3.1 Talent agrees not to circumvent, avoid, bypass, or obviate Company, directly or indirectly, to avoid payment of fees in any transaction with Clients originally introduced by Company.</p>
                  <p>3.2 For a period of 12 months following introduction to a Client through the Platform, Talent agrees not to enter into any direct engagement with such Client without proper notification to Company and payment of applicable fees as specified in this Agreement.</p>
                  <p>3.3 Any attempt to circumvent Company by dealing directly with Clients introduced through the Platform in order to avoid fees will be considered a material breach of this Agreement.</p>
                </div>
                
                <h4 className="font-semibold mt-6">4. FEES</h4>
                <p>4.1 Basic access to the Platform is provided free of charge.</p>
                <p>4.2 Premium features and services may be offered for additional fees, which will be clearly disclosed before Talent elects to use such features or services.</p>
                <p>4.3 If Talent accepts employment or enters into a service agreement with a Client introduced through the Platform, Company may charge a placement fee as detailed in the fee schedule available on the Platform.</p>
                
                <h4 className="font-semibold mt-6 bg-yellow-50 p-2">5. CONFIDENTIALITY</h4>
                <div className="bg-yellow-50 p-2">
                  <p>5.1 "Confidential Information" means all non-public information disclosed by one party to the other party, whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.</p>
                  <p>5.2 Each party agrees to maintain the confidentiality of the other party's Confidential Information and to protect it with at least the same degree of care as it would protect its own Confidential Information, but in no case less than reasonable care.</p>
                  <p>5.3 Talent shall not disclose any Confidential Information of Company or Clients to any third party without express written permission.</p>
                  <p>5.4 This obligation of confidentiality will survive the termination of this Agreement for a period of three (3) years.</p>
                </div>
                
                <h4 className="font-semibold mt-6">6. TERM AND TERMINATION</h4>
                <p>6.1 This Agreement commences on the date of Talent's electronic acceptance and continues until terminated in accordance with the terms herein.</p>
                <p>6.2 Either party may terminate this Agreement at any time for any reason upon written notice to the other party.</p>
                <p>6.3 Upon termination, Talent's right to use the Platform will immediately cease, and Company may delete Talent's account and all associated information.</p>
                
                <h4 className="font-semibold mt-6">7. LIMITATION OF LIABILITY</h4>
                <p>7.1 IN NO EVENT SHALL COMPANY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, EVEN IF COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
                <p>7.2 COMPANY'S TOTAL CUMULATIVE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE AMOUNT OF FEES PAID BY TALENT TO COMPANY DURING THE SIX (6) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.</p>
                
                <h4 className="font-semibold mt-6">8. MISCELLANEOUS</h4>
                <p>8.1 This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous communications and proposals, whether oral or written.</p>
                <p>8.2 This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.</p>
                <p>8.3 Any dispute arising out of or relating to this Agreement shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association.</p>
                <p>8.4 If any provision of this Agreement is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable.</p>
                <p>8.5 This Agreement may not be assigned by Talent without the prior written approval of Company but may be assigned by Company without consent to a successor in interest.</p>
                
                <p className="mt-6">BY CLICKING "I AGREE" OR SIMILAR BUTTON, TALENT ACKNOWLEDGES THAT THEY HAVE READ THIS AGREEMENT, UNDERSTAND IT, AND AGREE TO BE BOUND BY ITS TERMS AND CONDITIONS.</p>
              </div>
            </ScrollArea>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="msa-agreement" 
                  checked={hasAgreedMsa}
                  onCheckedChange={(checked) => setHasAgreedMsa(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="msa-agreement"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have read and agree to the Master Services Agreement
                  </label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="confidentiality-agreement" 
                  checked={hasAgreedConfidentiality}
                  onCheckedChange={(checked) => setHasAgreedConfidentiality(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="confidentiality-agreement"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I specifically agree to the <span className="font-bold">confidentiality provisions</span> in Section 5
                  </label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="non-circumvention-agreement" 
                  checked={hasAgreedNonCircumvention}
                  onCheckedChange={(checked) => setHasAgreedNonCircumvention(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="non-circumvention-agreement"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I specifically agree to the <span className="font-bold">non-circumvention provisions</span> in Section 3
                  </label>
                </div>
              </div>
            </div>
          </StepCardContent>
        </StepCard>
        
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Digital Signature</StepCardTitle>
            <StepCardDescription>
              By signing below, you are electronically signing and agreeing to the Master Services Agreement.
            </StepCardDescription>
          </StepCardHeader>
          
          <StepCardContent>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Fingerprint className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Electronic Signature Authentication</h3>
              </div>
              <p className="text-sm mb-4">
                Your electronic signature below will be as legally binding as a physical signature. This Agreement constitutes the entire agreement between you and TalentFlow Inc. regarding your use of our services.
              </p>
              
              <Alert variant="default" className="mb-6">
                <Lock className="h-4 w-4" />
                <AlertTitle>Secure Signature Process</AlertTitle>
                <AlertDescription>
                  Your signature is protected with secure encryption and time-stamping for legal verification.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signature">Full Legal Name (Type for Electronic Signature)</Label>
                  <Input 
                    id="signature" 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full legal name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 max-w-xs"
                  />
                </div>
              </div>
            </div>
          </StepCardContent>
          
          <StepCardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/profile-snapshot')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button 
              onClick={handleContinue}
              disabled={isSubmitting || !isAgreementComplete}
              className={!isAgreementComplete ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isSubmitting ? 'Processing...' : 'Sign & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  );
};

export default Agreement;
