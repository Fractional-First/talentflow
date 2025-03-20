
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { Step } from '@/components/OnboardingProgress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, ArrowLeft, FileText, Shield, Info, AlertCircle, Lock, LucideCheck, Fingerprint } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Agreement = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAgreedMsa, setHasAgreedMsa] = useState(false);
  const [hasAgreedConfidentiality, setHasAgreedConfidentiality] = useState(false);
  const [hasAgreedNonCircumvention, setHasAgreedNonCircumvention] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [signature, setSignature] = useState('');
  const [date, setDate] = useState('');
  
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
    hasAgreedNonCircumvention && hasReadPrivacy && signature.trim() !== '' && date.trim() !== '';

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
            <Tabs defaultValue="msa" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="msa" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Master Services Agreement
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="msa" className="mt-6">
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
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-6">
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                    </p>
                  </div>
                </div>
                
                <ScrollArea className="h-[400px] rounded-lg border p-4">
                  <div className="space-y-4 text-sm">
                    <h3 className="text-lg font-semibold">PRIVACY POLICY</h3>
                    <p>Effective Date: January 1, 2023</p>
                    <p>TalentFlow Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our talent onboarding platform and related services (collectively, the "Services").</p>
                    
                    <h4 className="font-semibold mt-6">1. INFORMATION WE COLLECT</h4>
                    <p>We collect information that you provide directly to us, information we collect automatically when you use the Services, and information from third-party sources.</p>
                    
                    <p className="font-medium mt-4">1.1 Information You Provide to Us</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Account Information: When you register for an account, we collect your name, email address, password, and other information you provide during the registration process.</li>
                      <li>Profile Information: Information you provide in your profile, such as your professional experience, education, skills, career goals, and other qualifications.</li>
                      <li>Documents: Resumes, cover letters, portfolios, and other documents you upload to our platform.</li>
                      <li>Communication: Information you provide when you communicate with us or other users through our platform, including messages, feedback, and support requests.</li>
                      <li>Payment Information: If you subscribe to premium services, we collect payment details necessary to process your payment.</li>
                    </ul>
                    
                    <p className="font-medium mt-4">1.2 Information We Collect Automatically</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Usage Information: We collect information about how you use our Services, including pages visited, features used, actions taken, time spent, and other usage statistics.</li>
                      <li>Device Information: We collect information about the device you use to access our Services, including device type, operating system, browser type, IP address, and unique device identifiers.</li>
                      <li>Cookies and Similar Technologies: We use cookies and similar technologies to collect information about your browsing activities and preferences.</li>
                    </ul>
                    
                    <p className="font-medium mt-4">1.3 Information from Third-Party Sources</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>LinkedIn and Other Social Media: If you choose to connect your social media accounts, we may collect information from those accounts.</li>
                      <li>Employers and References: We may collect information about you from employers, references, or other third parties as part of the talent matching process.</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-6">2. HOW WE USE YOUR INFORMATION</h4>
                    <p>We use the information we collect for various purposes, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Providing, maintaining, and improving our Services</li>
                      <li>Processing and completing transactions</li>
                      <li>Matching you with potential employers or opportunities</li>
                      <li>Communicating with you about our Services, updates, and promotions</li>
                      <li>Personalizing your experience and providing content and features tailored to your preferences</li>
                      <li>Analyzing usage patterns and trends to improve our Services</li>
                      <li>Protecting against, identifying, and preventing fraud and other unlawful activity</li>
                      <li>Complying with legal obligations</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-6">3. HOW WE SHARE YOUR INFORMATION</h4>
                    <p>We may share your information in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>With Employers: We share your profile information with potential employers or clients based on your qualifications and preferences.</li>
                      <li>With Service Providers: We share information with third-party service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.</li>
                      <li>For Legal Reasons: We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
                      <li>Business Transfers: If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                      <li>With Your Consent: We may share your information for other purposes with your consent.</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-6">4. DATA RETENTION</h4>
                    <p>We retain your information for as long as your account is active or as needed to provide you with our Services. We will also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.</p>
                    
                    <h4 className="font-semibold mt-6">5. YOUR RIGHTS AND CHOICES</h4>
                    <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Access: You can request access to the personal information we hold about you.</li>
                      <li>Correction: You can request that we correct inaccurate or incomplete information about you.</li>
                      <li>Deletion: You can request that we delete your personal information.</li>
                      <li>Objection: You can object to our processing of your personal information.</li>
                      <li>Restriction: You can request that we restrict the processing of your personal information.</li>
                      <li>Data Portability: You can request a copy of your personal information in a structured, commonly used, and machine-readable format.</li>
                    </ul>
                    
                    <h4 className="font-semibold mt-6">6. SECURITY</h4>
                    <p>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                    
                    <h4 className="font-semibold mt-6">7. CHANGES TO THIS PRIVACY POLICY</h4>
                    <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective.</p>
                    
                    <h4 className="font-semibold mt-6">8. CONTACT US</h4>
                    <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@talentflow.com.</p>
                  </div>
                </ScrollArea>
                
                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox 
                    id="privacy-agreement" 
                    checked={hasReadPrivacy}
                    onCheckedChange={(checked) => setHasReadPrivacy(checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="privacy-agreement"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read and understand the Privacy Policy
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </StepCardContent>
        </StepCard>
        
        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Digital Signature</StepCardTitle>
            <StepCardDescription>
              By signing below, you are electronically signing and agreeing to the Master Services Agreement and acknowledging our Privacy Policy.
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
