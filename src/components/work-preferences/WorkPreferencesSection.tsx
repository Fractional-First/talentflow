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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="actively-looking">Actively Looking for Work</Label>
            <Switch
              id="actively-looking"
              checked={activelyLooking}
              onCheckedChange={setActivelyLooking}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Work Location Preferences</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relocation"
                  checked={openToRelocation}
                  onCheckedChange={setOpenToRelocation}
                />
                <Label htmlFor="relocation">Open to Relocation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={openToRemote}
                  onCheckedChange={setOpenToRemote}
                />
                <Label htmlFor="remote">Open to Remote Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hybrid"
                  checked={openToHybrid}
                  onCheckedChange={setOpenToHybrid}
                />
                <Label htmlFor="hybrid">Open to Hybrid Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onsite"
                  checked={openToOnsite}
                  onCheckedChange={setOpenToOnsite}
                />
                <Label htmlFor="onsite">Open to On-site Work</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Employment Type Preferences</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contract"
                  checked={openToContract}
                  onCheckedChange={setOpenToContract}
                />
                <Label htmlFor="contract">Open to Contract Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="full-time"
                  checked={openToFullTime}
                  onCheckedChange={setOpenToFullTime}
                />
                <Label htmlFor="full-time">Open to Full-time Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="part-time"
                  checked={openToPartTime}
                  onCheckedChange={setOpenToPartTime}
                />
                <Label htmlFor="part-time">Open to Part-time Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internship"
                  checked={openToInternship}
                  onCheckedChange={setOpenToInternship}
                />
                <Label htmlFor="internship">Open to Internships</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="temporary"
                  checked={openToTemporary}
                  onCheckedChange={setOpenToTemporary}
                />
                <Label htmlFor="temporary">Open to Temporary Work</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="volunteer"
                  checked={openToVolunteer}
                  onCheckedChange={setOpenToVolunteer}
                />
                <Label htmlFor="volunteer">Open to Volunteer Work</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Other Preferences</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={openToOther}
                  onCheckedChange={setOpenToOther}
                />
                <Label htmlFor="other">Open to Other Types of Work</Label>
              </div>
              {openToOther && (
                <Textarea
                  placeholder="Please specify other work preferences..."
                  value={otherPreferences}
                  onChange={(e) => setOtherPreferences(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <IndustryPreferencesSection
            industryPreferences={industryPreferences}
            setIndustryPreferences={setIndustryPreferences}
          />

          <div className="pt-4 flex justify-center">
            <Button 
              className="px-8 py-2 bg-[#449889] hover:bg-[#449889]/90 text-white"
              style={{ backgroundColor: '#449889' }}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </StepCardContent>
    </StepCard>
  )
}

export default WorkPreferencesSection
