
import { useState } from 'react'
import { Check, ChevronsUpDown, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useIndustries, type Industry } from '@/hooks/useIndustries'
import { cn } from '@/lib/utils'

interface IndustrySelectorProps {
  selectedIndustries: string[]
  onIndustriesChange: (industries: string[]) => void
  placeholder?: string
  maxSelections?: number
}

export function IndustrySelector({
  selectedIndustries,
  onIndustriesChange,
  placeholder = "Select industries...",
  maxSelections = 10
}: IndustrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  
  const { data: industries = [], isLoading } = useIndustries()

  const filteredIndustries = industries.filter(industry => 
    industry.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const toggleIndustry = (industryId: string) => {
    if (selectedIndustries.includes(industryId)) {
      onIndustriesChange(selectedIndustries.filter(id => id !== industryId))
    } else if (selectedIndustries.length < maxSelections) {
      onIndustriesChange([...selectedIndustries, industryId])
    }
  }

  const removeIndustry = (industryId: string) => {
    onIndustriesChange(selectedIndustries.filter(id => id !== industryId))
  }

  const getSelectedIndustryNames = () => {
    return industries
      .filter(industry => selectedIndustries.includes(industry.id))
      .map(industry => ({ id: industry.id, name: industry.name }))
  }

  const selectedIndustryData = getSelectedIndustryNames()

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {selectedIndustries.length === 0 
                ? placeholder
                : `${selectedIndustries.length} selected`
              }
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search industries..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No industries found.</CommandEmpty>
              
              <CommandGroup heading="Industries">
                {filteredIndustries.map((industry) => (
                  <CommandItem
                    key={industry.id}
                    onSelect={() => toggleIndustry(industry.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIndustries.includes(industry.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{industry.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected industries display */}
      {selectedIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIndustryData.map(({ id, name }) => (
            <Badge key={id} variant="outline" className="flex items-center gap-1">
              <span>{name}</span>
              <button 
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => removeIndustry(id)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
