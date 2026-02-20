import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ContractingTypeSection, type RegisteredAddress } from "@/components/agreement/ContractingTypeSection"
import { ContactDetailsSection, type PersonalDetailsData } from "@/components/agreement/ContactDetailsSection"
import { TermsAcceptanceSection } from "@/components/agreement/TermsAcceptanceSection"
import { MSAModal } from "@/components/agreement/MSAModal"
import { ContractualRoadmap } from "@/components/agreement/ContractualRoadmap"
import { CheckCircle, ArrowLeft, ClipboardList } from "lucide-react"
import { toast } from "sonner"
import { useGetUser } from "@/queries/auth/useGetUser"

const Agreement = () => {
  const navigate = useNavigate()
  const { data: user } = useGetUser()

  const isAccepted = localStorage.getItem("agreement_accepted") === "true"
  const savedData = (() => {
    try { return JSON.parse(localStorage.getItem("agreement_data") || "null") } catch { return null }
  })()

  // Contracting type state
  const [contractingType, setContractingType] = useState<"individual" | "entity" | null>(savedData?.contractingType ?? null)
  const [entityName, setEntityName] = useState(savedData?.entityName ?? "")
  const [registrationNumber, setRegistrationNumber] = useState(savedData?.registrationNumber ?? "")
  const [registeredAddress, setRegisteredAddress] = useState<RegisteredAddress>(savedData?.registeredAddress ?? {
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
  })
  const [entityConfirmed, setEntityConfirmed] = useState(savedData?.entityConfirmed ?? false)

  // Personal details state
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsData>(savedData?.personalDetails ?? {
    fullLegalName: "",
    identificationNumber: "",
    residentialAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
    },
  })

  // Contact details state
  const [contactEmail, setContactEmail] = useState(savedData?.contactEmail ?? "")
  const [mobileCountryCode, setMobileCountryCode] = useState(savedData?.mobileCountryCode ?? "")
  const [mobileNumber, setMobileNumber] = useState(savedData?.mobileNumber ?? "")
  const [contactTouched, setContactTouched] = useState(false)

  // Pre-fill email from auth user (only if no saved data)
  useEffect(() => {
    if (user?.email && !contactEmail) {
      setContactEmail(user.email)
    }
  }, [user?.email])

  // Terms acceptance state
  const [acceptFullAgreement, setAcceptFullAgreement] = useState(savedData?.acceptFullAgreement ?? false)

  // Modal state
  const [msaModalOpen, setMsaModalOpen] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  const personalRef = useRef<HTMLDivElement>(null)
  const contractingRef = useRef<HTMLDivElement>(null)
  const termsRef = useRef<HTMLDivElement>(null)

  // Validation logic
  const isContractingValid = () => {
    if (!contractingType) return false
    if (contractingType === "entity") {
      return (
        entityName.trim() !== "" &&
        registrationNumber.trim() !== "" &&
        registeredAddress.addressLine1.trim() !== "" &&
        registeredAddress.city.trim() !== "" &&
        registeredAddress.postalCode.trim() !== "" &&
        registeredAddress.country.trim() !== "" &&
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
      personalDetails.fullLegalName.trim() !== "" &&
      personalDetails.residentialAddress.addressLine1.trim() !== "" &&
      personalDetails.residentialAddress.city.trim() !== "" &&
      personalDetails.residentialAddress.postalCode.trim() !== "" &&
      personalDetails.residentialAddress.country.trim() !== "" &&
      emailRegex.test(contactEmail.trim()) &&
      !!mobileCountryCode &&
      mobileNumber.length >= 6 &&
      mobileNumber.length <= 15
    )
  }

  const canSubmit = isContractingValid() && isContactValid() && isTermsValid()

  const handleSubmit = async () => {
    setAttemptedSubmit(true)
    setContactTouched(true)
    if (!canSubmit) {
      const firstInvalid = !isContactValid() ? personalRef : !isContractingValid() ? contractingRef : termsRef
      firstInvalid.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Save agreement data to database
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      
      localStorage.setItem("agreement_accepted", "true")
      localStorage.setItem("agreement_data", JSON.stringify({
        contractingType, entityName, registrationNumber, registeredAddress, entityConfirmed,
        personalDetails, contactEmail, mobileCountryCode, mobileNumber, acceptFullAgreement,
      }))
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Back button */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            {isSubmitted && (
              <div className="flex flex-col items-center text-center py-16 animate-fade-in space-y-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-3 max-w-xl">
                  <h2 className="text-2xl font-bold text-foreground">
                    Congratulations, you are now engagement-ready!
                  </h2>
                   <p className="text-muted-foreground text-body">
                     We will contact you once we find a good match.
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
            )}

            {!isSubmitted && (
              <>
                {isAccepted && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      You're engagement-ready! This is a read-only view of your accepted agreement.
                    </p>
                  </div>
                )}

                <div className={`space-y-6 ${isAccepted ? "pointer-events-none opacity-80" : ""}`}>

                {/* Header */}
                {!isAccepted && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">
                          Let's get you engagement-ready!
                        </h1>
                        <p className="text-muted-foreground">
                          To receive relevant roles and potential matches as they become available, please review next steps.
                        </p>
                      </div>
                    </div>

                    <ContractualRoadmap />

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          If you're ready, let's move ahead.
                        </h2>
                        <p className="text-muted-foreground">
                          Complete the sections below.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Personal Details Section */}
                <div ref={personalRef}>
                  <ContactDetailsSection
                    contactEmail={contactEmail}
                    mobileCountryCode={mobileCountryCode}
                    mobileNumber={mobileNumber}
                    personalDetails={personalDetails}
                    onContactEmailChange={(v) => { setContactTouched(true); setContactEmail(v) }}
                    onMobileCountryCodeChange={(v) => { setContactTouched(true); setMobileCountryCode(v) }}
                    onMobileNumberChange={(v) => { setContactTouched(true); setMobileNumber(v) }}
                    onPersonalDetailsChange={setPersonalDetails}
                    emailError={getEmailError()}
                    countryCodeError={getCountryCodeError()}
                    phoneError={getPhoneError()}
                    showErrors={attemptedSubmit && !isContactValid()}
                  />
                </div>

                {/* Contracting Type Section */}
                <div ref={contractingRef}>
                  <ContractingTypeSection
                    contractingType={contractingType}
                    candidatePersonnel={personalDetails.fullLegalName}
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
                    showErrors={attemptedSubmit && !isContractingValid()}
                  />
                </div>

                {/* Terms Acceptance Section */}
                <div ref={termsRef}>
                  <TermsAcceptanceSection
                    acceptFullAgreement={acceptFullAgreement}
                    onAcceptFullAgreementChange={setAcceptFullAgreement}
                    onViewMSA={() => setMsaModalOpen(true)}
                    showErrors={attemptedSubmit && !isTermsValid()}
                  />
                </div>

                {/* Submit Button */}
                {!isAccepted && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6"
                  >
                    {isSubmitting ? "Processing..." : "Accept All & Get Engagement-Ready"}
                  </Button>
                )}
                </div>
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
