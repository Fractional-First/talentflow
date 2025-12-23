import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface ContractingTypeSectionProps {
  contractingType: "individual" | "entity" | null
  entityName: string
  isAuthorized: boolean
  isDesignatedPerson: boolean
  onContractingTypeChange: (value: "individual" | "entity") => void
  onEntityNameChange: (value: string) => void
  onIsAuthorizedChange: (value: boolean) => void
  onIsDesignatedPersonChange: (value: boolean) => void
}

export const ContractingTypeSection = ({
  contractingType,
  entityName,
  isAuthorized,
  isDesignatedPerson,
  onContractingTypeChange,
  onEntityNameChange,
  onIsAuthorizedChange,
  onIsDesignatedPersonChange,
}: ContractingTypeSectionProps) => {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-5 sm:p-6 space-y-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          How will you contract with us?
        </h3>
        <p className="text-sm text-muted-foreground">
          This is required to proceed with client matches.
        </p>
      </div>

      <RadioGroup
        value={contractingType || ""}
        onValueChange={(value) => onContractingTypeChange(value as "individual" | "entity")}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3 bg-background border border-border rounded-lg p-4">
          <RadioGroupItem value="individual" id="individual" />
          <Label htmlFor="individual" className="cursor-pointer font-medium">
            As an individual
          </Label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-background border border-border rounded-lg p-4">
            <RadioGroupItem value="entity" id="entity" />
            <Label htmlFor="entity" className="cursor-pointer font-medium">
              As personnel of an entity
            </Label>
          </div>

          {contractingType === "entity" && (
            <div className="ml-7 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entityName" className="text-sm font-medium">
                  Entity name
                </Label>
                <Input
                  id="entityName"
                  placeholder="Enter your entity name"
                  value={entityName}
                  onChange={(e) => onEntityNameChange(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 bg-background border border-border rounded-lg p-4">
                  <Checkbox
                    id="authorized"
                    checked={isAuthorized}
                    onCheckedChange={(checked) => onIsAuthorizedChange(checked === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="authorized" className="text-sm leading-relaxed cursor-pointer">
                    I confirm I am duly authorised by the entity to enter into this Agreement on its behalf and to bind the entity to its terms.
                  </Label>
                </div>

                <div className="flex items-start space-x-3 bg-background border border-border rounded-lg p-4">
                  <Checkbox
                    id="designatedPerson"
                    checked={isDesignatedPerson}
                    onCheckedChange={(checked) => onIsDesignatedPersonChange(checked === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="designatedPerson" className="text-sm leading-relaxed cursor-pointer">
                    I acknowledge and confirm that I am the only designated person authorized to perform services under this Agreement on behalf of the entity. No substitution or change of personnel is permitted without Fractional First's prior written consent.
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  )
}
