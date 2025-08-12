
import { useIndustries } from "@/queries/useIndustries"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface IndustrySelectorProps {
  selectedIndustries: string[]
  onIndustriesChange: (industries: string[]) => void
  placeholder?: string
}

const IndustrySelector = ({
  selectedIndustries,
  onIndustriesChange,
  placeholder = "Search and select industries",
}: IndustrySelectorProps) => {
  const [open, setOpen] = useState(false)
  const { data: industries = [], isLoading } = useIndustries()

  const selectedIndustryNames = industries
    .filter((industry) => selectedIndustries.includes(industry.id))
    .map((industry) => industry.name)

  const handleIndustryToggle = (industryId: string) => {
    if (selectedIndustries.includes(industryId)) {
      onIndustriesChange(selectedIndustries.filter((i) => i !== industryId))
    } else {
      onIndustriesChange([...selectedIndustries, industryId])
    }
  }

  const removeIndustry = (industryId: string) => {
    onIndustriesChange(selectedIndustries.filter((i) => i !== industryId))
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between text-sm h-10">
        <div className="flex items-center gap-2 flex-1 truncate">
          <Building className="h-4 w-4 shrink-0" />
          <span className="truncate">Loading industries...</span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm h-10"
          >
            <div className="flex items-center gap-2 flex-1 truncate">
              <Building className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {selectedIndustries.length > 0
                  ? `${selectedIndustries.length} industries selected`
                  : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput placeholder="Search industries..." />
            <CommandList>
              <CommandEmpty>No industry found.</CommandEmpty>
              <CommandGroup>
                {industries.map((industry) => (
                  <CommandItem
                    key={industry.id}
                    value={industry.name}
                    onSelect={() => {
                      handleIndustryToggle(industry.id)
                    }}
                    className="truncate"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        selectedIndustries.includes(industry.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="truncate">{industry.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Industries Pills */}
      {selectedIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIndustryNames.map((industryName) => {
            const industry = industries.find((i) => i.name === industryName)
            return (
              <Badge
                key={industry?.id}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full hover:bg-primary/15 max-w-full"
              >
                <span className="truncate">{industryName}</span>
                <button
                  onClick={() => removeIndustry(industry?.id || "")}
                  className="ml-2 hover:text-primary/80 shrink-0"
                  type="button"
                >
                  ×
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default IndustrySelector
