import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ContractingTypeSection } from "@/components/agreement/ContractingTypeSection"
import { ContactDetailsSection } from "@/components/agreement/ContactDetailsSection"
import { TermsAcceptanceSection } from "@/components/agreement/TermsAcceptanceSection"
import { MSAModal } from "@/components/agreement/MSAModal"
import { ContractualRoadmap } from "@/components/agreement/ContractualRoadmap"
import { CheckCircle, ArrowLeft, ClipboardList } from "lucide-react"
import { toast } from "sonner"
import { useGetUser } from "@/queries/auth/useGetUser"

const Agreement = () => {
  const navigate = useNavigate()
  const { data: user } = useGetUser()

  // Contracting type state
  const [contractingType, setContractingType] = useState<"individual" | "entity" | null>(null)
  const [entityName, setEntityName] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [registeredAddress, setRegisteredAddress] = useState("")
  const [entityConfirmed, setEntityConfirmed] = useState(false)

  // Contact details state
  const [contactEmail, setContactEmail] = useState("")
  const [mobileCountryCode, setMobileCountryCode] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [contactTouched, setContactTouched] = useState(false)

  // Pre-fill email from auth user
  useEffect(() => {
    if (user?.email && !contactEmail) {
      setContactEmail(user.email)
    }
  }, [user?.email])

  // Terms acceptance state
  const [acceptFullAgreement, setAcceptFullAgreement] = useState(false)

  // Modal state
  const [msaModalOpen, setMsaModalOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation logic
  const isContractingValid = () => {
    if (!contractingType) return false
    if (contractingType === "entity") {
      return (
        entityName.trim() !== "" &&
        registrationNumber.trim() !== "" &&
        registeredAddress.trim() !== "" &&
        entityConfirmed
      )
    }
    return true
  }

  const isTermsValid = () => {
    return acceptFullAgreement
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const getEmailError = () => {
    if (!contactTouched) return undefined
    if (!contactEmail.trim()) return "Email is required"
    if (!emailRegex.test(contactEmail.trim())) return "Please enter a valid email"
    return undefined
  }

  const getCountryCodeError = () => {
    if (!contactTouched) return undefined
    if (!mobileCountryCode) return "Select a country code"
    return undefined
  }

  const getPhoneError = () => {
    if (!contactTouched) return undefined
    if (!mobileNumber.trim()) return "Mobile number is required"
    if (mobileNumber.length < 6 || mobileNumber.length > 15) return "Must be 6-15 digits"
    return undefined
  }

  const isContactValid = () => {
    return (
      emailRegex.test(contactEmail.trim()) &&
      !!mobileCountryCode &&
      mobileNumber.length >= 6 &&
      mobileNumber.length <= 15
    )
  }

  const canSubmit = isContractingValid() && isContactValid() && isTermsValid()

  const handleSubmit = async () => {
    setContactTouched(true)
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      // TODO: Save agreement data to database
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      
      setIsSubmitted(true)
    } catch (error) {
      toast.error("Failed to save agreement. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Let's get you engagement-ready!
                  </h1>
                  <p className="text-muted-foreground">
                    To receive client names, client details, specific roles, and potential matches, please confirm how you will contract with us.
                  </p>
                </div>
              </div>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center text-center py-16 animate-fade-in space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-3 max-w-md">
                  <h2 className="text-2xl font-bold text-foreground">
                    Congratulations, you are now engagement-ready!
                  </h2>
                  <p className="text-muted-foreground text-body">
                    This is all you can do for now and you will be contacted if there are relevant opportunities. We will get in touch.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="mt-4"
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <>
                {/* Contractual Roadmap */}
                <ContractualRoadmap />

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Please provide us with your details
                    </h2>
                    <p className="text-muted-foreground">
                      Complete the sections below to finalise your agreement.
                    </p>
                  </div>
                </div>

                {/* Contracting Type Section */}
                <ContractingTypeSection
                  contractingType={contractingType}
                  entityName={entityName}
                  registrationNumber={registrationNumber}
                  registeredAddress={registeredAddress}
                  entityConfirmed={entityConfirmed}
                  onContractingTypeChange={setContractingType}
                  onEntityNameChange={setEntityName}
                  onRegistrationNumberChange={setRegistrationNumber}
                  onRegisteredAddressChange={setRegisteredAddress}
                  onEntityConfirmedChange={setEntityConfirmed}
                  onViewMSA={() => setMsaModalOpen(true)}
                />

                {/* Contact Details Section */}
                <ContactDetailsSection
                  contactEmail={contactEmail}
                  mobileCountryCode={mobileCountryCode}
                  mobileNumber={mobileNumber}
                  onContactEmailChange={(v) => { setContactTouched(true); setContactEmail(v) }}
                  onMobileCountryCodeChange={(v) => { setContactTouched(true); setMobileCountryCode(v) }}
                  onMobileNumberChange={(v) => { setContactTouched(true); setMobileNumber(v) }}
                  emailError={getEmailError()}
                  countryCodeError={getCountryCodeError()}
                  phoneError={getPhoneError()}
                />

                {/* Terms Acceptance Section */}
                <TermsAcceptanceSection
                  acceptFullAgreement={acceptFullAgreement}
                  onAcceptFullAgreementChange={setAcceptFullAgreement}
                  onViewMSA={() => setMsaModalOpen(true)}
                />

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6"
                >
                  {isSubmitting ? "Processing..." : "Accept All & Get Engagement-Ready"}
                </Button>
              </>
            )}
          </div>
        </main>
      </div>

      {/* MSA Modal */}
      <MSAModal open={msaModalOpen} onOpenChange={setMsaModalOpen} />
    </SidebarProvider>
  )
}

export default Agreement
