
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import IndustrySelector from "./IndustrySelector"
import { useIndustries } from "@/queries/useIndustries"

interface IndustryPreferencesProps {
  value: string[]
  onChange: (industryIds: string[]) => void
}

const IndustryPreferences = ({
  value: industryPreferences,
  onChange: setIndustryPreferences,
}: IndustryPreferencesProps) => {
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
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Industry Preferences</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select your preferred industries to work in
          </p>
        </div>
        {industryPreferences.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearIndustryPreferences}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="bg-background border rounded-lg p-6 space-y-6">
        {/* Industry Selector */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Select Industries</Label>
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

export default IndustryPreferences
