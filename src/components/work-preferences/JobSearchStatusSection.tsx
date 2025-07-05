import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface JobSearchStatusSectionProps {
  searchStatus: string
  setSearchStatus: (status: string) => void
  urgency: string
  setUrgency: (urgency: string) => void
}

const JobSearchStatusSection = ({
  searchStatus,
  setSearchStatus,
  urgency,
  setUrgency,
}: JobSearchStatusSectionProps) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Job Search Status</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us about your current job search timeline
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 space-y-6">
        {/* Current Status */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground">Current Status</Label>
          <Select value={searchStatus} onValueChange={setSearchStatus}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select your current status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actively_looking">Actively Looking</SelectItem>
              <SelectItem value="casually_browsing">Casually Browsing</SelectItem>
              <SelectItem value="open_to_opportunities">Open to Opportunities</SelectItem>
              <SelectItem value="not_looking">Not Currently Looking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <hr className="border-border" />

        {/* Urgency */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground">Timeline Urgency</Label>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select your timeline urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (within 2 weeks)</SelectItem>
              <SelectItem value="soon">Soon (within 1-2 months)</SelectItem>
              <SelectItem value="flexible">Flexible (within 3-6 months)</SelectItem>
              <SelectItem value="long_term">Long-term (6+ months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default JobSearchStatusSection
