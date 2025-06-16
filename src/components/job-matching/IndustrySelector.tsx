
import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIndustries } from '@/hooks/useIndustries';

interface IndustrySelectorProps {
  selectedIndustry: string;
  onIndustryChange: (industry: string) => void;
  placeholder?: string;
  excludeIndustries?: string[];
}

const IndustrySelector = ({
  selectedIndustry,
  onIndustryChange,
  placeholder = "Select industry...",
  excludeIndustries = []
}: IndustrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: industries, isLoading } = useIndustries();

  const selectedIndustryData = useMemo(() => {
    return industries?.find(industry => industry.id === selectedIndustry);
  }, [industries, selectedIndustry]);

  const filteredIndustries = useMemo(() => {
    if (!industries) return [];
    
    return industries.filter(industry => 
      !excludeIndustries.includes(industry.id)
    );
  }, [industries, excludeIndustries]);

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Loading industries...
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {selectedIndustryData ? selectedIndustryData.name : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder="Search industries..." />
          <CommandList>
            <CommandEmpty>No industry found.</CommandEmpty>
            <CommandGroup>
              {filteredIndustries.map((industry) => (
                <CommandItem
                  key={industry.id}
                  value={`${industry.name} ${industry.slug}`}
                  onSelect={() => {
                    onIndustryChange(industry.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIndustry === industry.id ? "opacity-100" : "opacity-0"
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
  );
};

export default IndustrySelector;
