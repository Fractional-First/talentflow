
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  const getIndustryName = (industryId: string) => {
    const industry = industries.find((industry) => industry.id === industryId)
    console.log("Looking for industry:", industryId, "Found:", industry)
    return industry?.name || industryId
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
            onIndustriesChange={setIndustryPreferences}
            placeholder="Search and select industries..."
          />
        </div>

        {/* Selected Industries */}
        {industryPreferences.length > 0 && (
          <>
            <hr className="border-border" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Selected Industries
                </Label>
                <span className="text-sm text-muted-foreground">
                  {industryPreferences.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {industryPreferences.map((industryId) => (
                  <Badge
                    key={industryId}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full hover:bg-primary/15"
                  >
                    <span className="text-sm">{getIndustryName(industryId)}</span>
                    <button
                      className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => setIndustryPreferences(industryPreferences.filter(id => id !== industryId))}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default IndustryPreferences
