
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import IndustrySelector from "./IndustrySelector"
import { useIndustries } from "@/queries/useIndustries"

interface IndustryPreferencesSectionProps {
  industryPreferences: string[]
  setIndustryPreferences: React.Dispatch<React.SetStateAction<string[]>>
}

const IndustryPreferencesSection = ({
  industryPreferences,
  setIndustryPreferences,
}: IndustryPreferencesSectionProps) => {
  const { data: industries = [] } = useIndustries()

  const clearIndustryPreferences = () => {
    setIndustryPreferences([])
  }

  const handleIndustriesChange = (newIndustries: string[]) => {
    console.log("Industries changed:", newIndustries)
    setIndustryPreferences(newIndustries)
  }

  console.log("Current industryPreferences:", industryPreferences)
  console.log("Available industries:", industries)

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Industry Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Select your preferred industries
          </p>
        </div>
        {industryPreferences.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearIndustryPreferences}>
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4 px-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Industry</label>
          <IndustrySelector
            selectedIndustries={industryPreferences}
            onIndustriesChange={handleIndustriesChange}
            placeholder="Search and select industries..."
          />
        </div>
      </div>
    </div>
  )
}

export default IndustryPreferencesSection
