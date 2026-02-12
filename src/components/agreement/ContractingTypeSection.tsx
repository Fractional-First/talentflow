import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useCountries } from "@/queries/useCountries"


export interface RegisteredAddress {
  addressLine1: string
  addressLine2: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
}

interface ContractingTypeSectionProps {
  contractingType: "individual" | "entity" | null
  candidatePersonnel: string
  entityName: string
  registrationNumber: string
  registeredAddress: RegisteredAddress
  entityConfirmed: boolean
  onContractingTypeChange: (value: "individual" | "entity") => void
  onEntityNameChange: (value: string) => void
  onRegistrationNumberChange: (value: string) => void
  onRegisteredAddressChange: (value: RegisteredAddress) => void
  onEntityConfirmedChange: (value: boolean) => void
  onViewMSA: () => void
}

export const ContractingTypeSection = ({
  contractingType,
  candidatePersonnel,
  entityName,
  registrationNumber,
  registeredAddress,
  entityConfirmed,
  onContractingTypeChange,
  onEntityNameChange,
  onRegistrationNumberChange,
  onRegisteredAddressChange,
  onEntityConfirmedChange,
  onViewMSA,
}: ContractingTypeSectionProps) => {
  const { data: countries = [] } = useCountries()
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-5 sm:p-6 space-y-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Contracting Party (required)
        </h3>
      </div>

      {/* Candidate Personnel */}
      <div className="space-y-2">
        <Label htmlFor="candidatePersonnel" className="text-sm font-medium">
          Candidate Personnel
        </Label>
        <Input
          id="candidatePersonnel"
          value={candidatePersonnel}
          disabled
          className="bg-muted text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Pre-filled from your Full Legal Name above.
        </p>
      </div>

      <RadioGroup
        value={contractingType || ""}
        onValueChange={(value) => onContractingTypeChange(value as "individual" | "entity")}
        className="space-y-3"
      >
        <div className="bg-background border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="cursor-pointer font-medium flex items-center gap-2">
              You as an individual
              <span className="text-[10px] font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                Preferred
              </span>
            </Label>
          </div>
          <p className="text-xs text-muted-foreground ml-7">
            This is the most streamlined path for an independent operator.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-background border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="entity" id="entity" />
              <Label htmlFor="entity" className="cursor-pointer font-medium">
                You as part of your personal entity
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-7">
              Select this if you manage your professional engagements through an entity designed for this purpose.
            </p>
          </div>

          {contractingType === "entity" && (
            <div className="ml-7 space-y-5">
              {/* Entity Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entityName" className="text-sm font-medium">
                    Entity name
                  </Label>
                  <Input
                    id="entityName"
                    placeholder="Enter your full legal entity name"
                    value={entityName}
                    onChange={(e) => onEntityNameChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="text-sm font-medium">
                    Unique Entity Number (UEN)
                  </Label>
                  <Input
                    id="registrationNumber"
                    placeholder="e.g. UEN, CIN, or local company registration number"
                    value={registrationNumber}
                    onChange={(e) => onRegistrationNumberChange(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Registered address</Label>
                  <div className="space-y-3">
                    <Input
                      placeholder="Address Line 1"
                      value={registeredAddress.addressLine1}
                      onChange={(e) => onRegisteredAddressChange({ ...registeredAddress, addressLine1: e.target.value })}
                    />
                    <Input
                      placeholder="Address Line 2 (optional)"
                      value={registeredAddress.addressLine2}
                      onChange={(e) => onRegisteredAddressChange({ ...registeredAddress, addressLine2: e.target.value })}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="City"
                        value={registeredAddress.city}
                        onChange={(e) => onRegisteredAddressChange({ ...registeredAddress, city: e.target.value })}
                      />
                      <Input
                        placeholder="State / Province (optional)"
                        value={registeredAddress.stateProvince}
                        onChange={(e) => onRegisteredAddressChange({ ...registeredAddress, stateProvince: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        placeholder="Postal Code"
                        value={registeredAddress.postalCode}
                        onChange={(e) => onRegisteredAddressChange({ ...registeredAddress, postalCode: e.target.value })}
                      />
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={registeredAddress.country}
                        onChange={(e) => onRegisteredAddressChange({ ...registeredAddress, country: e.target.value })}
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Entity Confirmation */}
              <div className="bg-background border border-border rounded-lg p-4 space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    If contracting through an entity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    I agree and warrant that:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>
                        I am duly authorised by the entity identified above to enter into this Agreement on its behalf and to bind the entity to its terms; and
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>
                        I will personally perform all services and engagements arising from opportunities introduced by Fractional First, unless otherwise agreed in writing.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="entityConfirmed"
                    checked={entityConfirmed}
                    onCheckedChange={(checked) => onEntityConfirmedChange(checked === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="entityConfirmed" className="text-sm leading-relaxed cursor-pointer font-medium">
                    I confirm and agree to the above.
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
