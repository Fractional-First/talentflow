import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { ContractingTypeSection } from "@/components/agreement/ContractingTypeSection"
import { TermsAcceptanceSection } from "@/components/agreement/TermsAcceptanceSection"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

const Agreement = () => {
  const navigate = useNavigate()

  // Contracting type state
  const [contractingType, setContractingType] = useState<"individual" | "entity" | null>(null)
  const [entityName, setEntityName] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isDesignatedPerson, setIsDesignatedPerson] = useState(false)

  // Terms acceptance state
  const [agreeConfidentiality, setAgreeConfidentiality] = useState(false)
  const [agreeNonCircumvention, setAgreeNonCircumvention] = useState(false)
  const [agreeFullAgreement, setAgreeFullAgreement] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation logic
  const isContractingValid = () => {
    if (!contractingType) return false
    if (contractingType === "entity") {
      return entityName.trim() !== "" && isAuthorized && isDesignatedPerson
    }
    return true
  }

  const isTermsValid = () => {
    return agreeConfidentiality && agreeNonCircumvention && agreeFullAgreement
  }

  const canSubmit = isContractingValid() && isTermsValid()

  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      // TODO: Save agreement data to database
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
      
      toast.success("Agreement accepted! You're now ready to receive opportunities.")
      navigate("/dashboard")
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
                    Great – your profile is ready!
                  </h1>
                  <p className="text-muted-foreground">
                    To see client names, specific roles, and receive matches, please complete the following.
                  </p>
                </div>
              </div>
            </div>

            {/* Contracting Type Section */}
            <ContractingTypeSection
              contractingType={contractingType}
              entityName={entityName}
              isAuthorized={isAuthorized}
              isDesignatedPerson={isDesignatedPerson}
              onContractingTypeChange={setContractingType}
              onEntityNameChange={setEntityName}
              onIsAuthorizedChange={setIsAuthorized}
              onIsDesignatedPersonChange={setIsDesignatedPerson}
            />

            {/* Terms Acceptance Section */}
            <TermsAcceptanceSection
              agreeConfidentiality={agreeConfidentiality}
              agreeNonCircumvention={agreeNonCircumvention}
              agreeFullAgreement={agreeFullAgreement}
              onAgreeConfidentialityChange={setAgreeConfidentiality}
              onAgreeNonCircumventionChange={setAgreeNonCircumvention}
              onAgreeFullAgreementChange={setAgreeFullAgreement}
            />

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6"
            >
              {isSubmitting ? "Processing..." : "Accept All & Unlock Opportunities"}
            </Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Agreement
