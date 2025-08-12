
import {
  StepCard,
  StepCardContent,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import IndustryPreferencesSection from "./IndustryPreferencesSection"

interface WorkPreferencesSectionProps {
  activelyLooking: boolean
  setActivelyLooking: (value: boolean) => void
  openToRelocation: boolean
  setOpenToRelocation: (value: boolean) => void
  openToRemote: boolean
  setOpenToRemote: (value: boolean) => void
  openToHybrid: boolean
  setOpenToHybrid: (value: boolean) => void
  openToOnsite: boolean
  setOpenToOnsite: (value: boolean) => void
  openToContract: boolean
  setOpenToContract: (value: boolean) => void
  openToFullTime: boolean
  setOpenToFullTime: (value: boolean) => void
  openToPartTime: boolean
  setOpenToPartTime: (value: boolean) => void
  openToInternship: boolean
  setOpenToInternship: (value: boolean) => void
  openToTemporary: boolean
  setOpenToTemporary: (value: boolean) => void
  openToVolunteer: boolean
  setOpenToVolunteer: (value: boolean) => void
  openToOther: boolean
  setOpenToOther: (value: boolean) => void
  otherPreferences: string
  setOtherPreferences: (value: string) => void
  industryPreferences: string[]
  setIndustryPreferences: (value: string[]) => void
  estimatedTime: string
}

const WorkPreferencesSection = ({
  activelyLooking,
  setActivelyLooking,
  openToRelocation,
  setOpenToRelocation,
  openToRemote,
  setOpenToRemote,
  openToHybrid,
  setOpenToHybrid,
  openToOnsite,
  setOpenToOnsite,
  openToContract,
  setOpenToContract,
  openToFullTime,
  setOpenToFullTime,
  openToPartTime,
  setOpenToPartTime,
  openToInternship,
  setOpenToInternship,
  openToTemporary,
  setOpenToTemporary,
  openToVolunteer,
  setOpenToVolunteer,
  openToOther,
  setOpenToOther,
  otherPreferences,
  setOtherPreferences,
  industryPreferences,
  setIndustryPreferences,
  estimatedTime,
}: WorkPreferencesSectionProps) => {
  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Work Preferences</StepCardTitle>
      </StepCardHeader>
      <StepCardContent>
        <div className="space-y-8">
          {/* Job Search Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="actively-looking" className="text-base font-medium">
                Actively Looking for Work
              </Label>
              <p className="text-sm text-muted-foreground">
                Set your current job search status
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="actively-looking"
                checked={activelyLooking}
                onCheckedChange={setActivelyLooking}
              />
              <span className="text-sm font-medium whitespace-nowrap">
                {activelyLooking ? 'Actively Looking' : 'Passively Looking'}
              </span>
            </div>
          </div>

          {/* Work Location Preferences */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Work Location Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Select your preferred work arrangements
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="relocation"
                  checked={openToRelocation}
                  onCheckedChange={setOpenToRelocation}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="relocation" className="text-sm font-medium leading-none block">
                    Open to Relocation
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Willing to move for the right opportunity
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="remote"
                  checked={openToRemote}
                  onCheckedChange={setOpenToRemote}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="remote" className="text-sm font-medium leading-none block">
                    Open to Remote Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Work from anywhere setup
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="hybrid"
                  checked={openToHybrid}
                  onCheckedChange={setOpenToHybrid}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="hybrid" className="text-sm font-medium leading-none block">
                    Open to Hybrid Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mix of remote and office work
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="onsite"
                  checked={openToOnsite}
                  onCheckedChange={setOpenToOnsite}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="onsite" className="text-sm font-medium leading-none block">
                    Open to On-site Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Traditional office environment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Type Preferences */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Employment Type Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Select the types of employment you're interested in
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="contract"
                  checked={openToContract}
                  onCheckedChange={setOpenToContract}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="contract" className="text-sm font-medium leading-none block">
                    Open to Contract Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Project-based employment
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="full-time"
                  checked={openToFullTime}
                  onCheckedChange={setOpenToFullTime}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="full-time" className="text-sm font-medium leading-none block">
                    Open to Full-time Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Traditional 40-hour work week
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="part-time"
                  checked={openToPartTime}
                  onCheckedChange={setOpenToPartTime}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="part-time" className="text-sm font-medium leading-none block">
                    Open to Part-time Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Reduced hours schedule
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="internship"
                  checked={openToInternship}
                  onCheckedChange={setOpenToInternship}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="internship" className="text-sm font-medium leading-none block">
                    Open to Internships
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Learning and development opportunities
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="temporary"
                  checked={openToTemporary}
                  onCheckedChange={setOpenToTemporary}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="temporary" className="text-sm font-medium leading-none block">
                    Open to Temporary Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Short-term assignments
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="volunteer"
                  checked={openToVolunteer}
                  onCheckedChange={setOpenToVolunteer}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="volunteer" className="text-sm font-medium leading-none block">
                    Open to Volunteer Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Unpaid community service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Preferences */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Other Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Specify any additional work preferences
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="other"
                  checked={openToOther}
                  onCheckedChange={setOpenToOther}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <Label htmlFor="other" className="text-sm font-medium leading-none block">
                    Open to Other Types of Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Specify custom work arrangements
                  </p>
                </div>
              </div>
              {openToOther && (
                <div className="space-y-2">
                  <Label htmlFor="other-preferences" className="text-sm font-medium">
                    Please specify:
                  </Label>
                  <Textarea
                    id="other-preferences"
                    placeholder="Please specify other work preferences..."
                    value={otherPreferences}
                    onChange={(e) => setOtherPreferences(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <IndustryPreferencesSection
            industryPreferences={industryPreferences}
            setIndustryPreferences={setIndustryPreferences}
          />

          <div className="pt-6">
            <Button className="w-full h-12 text-base">Save Preferences</Button>
          </div>
        </div>
      </StepCardContent>
    </StepCard>
  )
}

export default WorkPreferencesSection
