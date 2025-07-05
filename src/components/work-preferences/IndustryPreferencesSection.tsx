import { IndustrySelector } from "@/components/IndustrySelector"
import { Building2 } from "lucide-react"

interface IndustryPreferencesSectionProps {
  selectedIndustryIds: string[]
  onIndustryChange: (industries: string[]) => void
  title?: string
  description?: string
}

const IndustryPreferencesSection = ({
  selectedIndustryIds,
  onIndustryChange,
  title = "Industry Preferences",
  description = "Select industries you'd like to work in",
}: IndustryPreferencesSectionProps) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6">
        <IndustrySelector
          selectedIndustryIds={selectedIndustryIds}
          onIndustryChange={onIndustryChange}
        />
      </div>
    </div>
  )
}

export default IndustryPreferencesSection
