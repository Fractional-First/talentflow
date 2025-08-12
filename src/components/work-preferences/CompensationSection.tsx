import { DollarSign, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompensationSectionProps {
  paymentType: string;
  setPaymentType: (type: string) => void;
  rateRange: number[];
  setRateRange: (range: number[]) => void;
  showOnly?: "annual" | "hourly-daily";
}

const CompensationSection = ({
  paymentType,
  setPaymentType,
  rateRange,
  setRateRange,
  showOnly
}: CompensationSectionProps) => {
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0;
    setRateRange([min, rateRange[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0;
    setRateRange([rateRange[0], max]);
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">Compensation Expectations</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set your preferred compensation range
          </p>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-4 sm:p-6 w-full overflow-hidden">
        {showOnly === "annual" ? (
          // Annual salary only
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Label className="text-base font-medium">Annual Salary Range</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Set your expected salary range for full-time positions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-salary" className="text-sm font-medium">
                  Minimum
                </Label>
                <Input 
                  id="min-salary" 
                  type="number" 
                  min={0} 
                  value={rateRange[0]} 
                  onChange={handleMinChange} 
                  placeholder="Min salary" 
                  className="h-11 w-full" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-salary" className="text-sm font-medium">
                  Maximum
                </Label>
                <Input 
                  id="max-salary" 
                  type="number" 
                  min={0} 
                  value={rateRange[1]} 
                  onChange={handleMaxChange} 
                  placeholder="Max salary" 
                  className="h-11 w-full" 
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              Range: {formatSalary(rateRange[0])} to {formatSalary(rateRange[1])} annually
            </div>
          </div>
        ) : showOnly === "hourly-daily" ? (
          // Hourly and daily rates
          <Tabs value={paymentType} onValueChange={setPaymentType} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="hourly" className="font-medium">Hourly Rate</TabsTrigger>
              <TabsTrigger value="daily" className="font-medium">Daily Rate</TabsTrigger>
            </TabsList>

            <TabsContent value="hourly" className="space-y-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Label className="text-base font-medium">Hourly Rate Range</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Higher rates apply to specialized or lower volume work, while lower rates apply to higher volume commitments.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-hourly" className="text-sm font-medium">
                    Minimum
                  </Label>
                  <Input 
                    id="min-hourly" 
                    type="number" 
                    min={0} 
                    value={rateRange[0]} 
                    onChange={handleMinChange} 
                    placeholder="Min hourly" 
                    className="h-11 w-full" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-hourly" className="text-sm font-medium">
                    Maximum
                  </Label>
                  <Input 
                    id="max-hourly" 
                    type="number" 
                    min={0} 
                    value={rateRange[1]} 
                    onChange={handleMaxChange} 
                    placeholder="Max hourly" 
                    className="h-11 w-full" 
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                Range: ${rateRange[0]} to ${rateRange[1]} per hour
              </div>
            </TabsContent>

            <TabsContent value="daily" className="space-y-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Label className="text-base font-medium">Daily Rate Range</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Higher rates apply to shorter-term engagements, while lower rates apply to longer commitments.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-daily" className="text-sm font-medium">
                    Minimum
                  </Label>
                  <Input 
                    id="min-daily" 
                    type="number" 
                    min={0} 
                    value={rateRange[0]} 
                    onChange={handleMinChange} 
                    placeholder="Min daily" 
                    className="h-11 w-full" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-daily" className="text-sm font-medium">
                    Maximum
                  </Label>
                  <Input 
                    id="max-daily" 
                    type="number" 
                    min={0} 
                    value={rateRange[1]} 
                    onChange={handleMaxChange} 
                    placeholder="Max daily" 
                    className="h-11 w-full" 
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                Range: ${rateRange[0]} to ${rateRange[1]} per day
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Full tabs with all options
          <Tabs defaultValue="annual" onValueChange={setPaymentType} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="annual">Annual Salary</TabsTrigger>
              <TabsTrigger value="daily">Daily Rate</TabsTrigger>
              <TabsTrigger value="hourly">Hourly Rate</TabsTrigger>
            </TabsList>

            <TabsContent value="annual" className="pt-4">
              <div className="px-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Rate Range</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Set your expected salary range. The lower end applies to
                          higher volume commitments, while the higher end applies
                          to more specialized or shorter-term work.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full">
                    <label className="text-sm mb-1" htmlFor="min-rate">
                      Minimum
                    </label>
                    <Input id="min-rate" type="number" min={0} value={rateRange[0]} onChange={handleMinChange} className="w-full" placeholder="Min" inputMode="numeric" />
                  </div>
                  <div className="flex flex-col w-full mt-2">
                    <label className="text-sm mb-1" htmlFor="max-rate">
                      Maximum
                    </label>
                    <Input id="max-rate" type="number" min={0} value={rateRange[1]} onChange={handleMaxChange} className="w-full" placeholder="Max" inputMode="numeric" />
                  </div>
                </div>
                <div className="flex justify-between mt-2"></div>
                <p className="text-xs text-muted-foreground mt-2">
                  Range from {formatSalary(rateRange[0])} to{" "}
                  {formatSalary(rateRange[1])}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="daily" className="pt-4">
              <div className="px-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Daily Rate Range</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Set your expected daily rate range. The lower end
                          applies to longer engagements, while the higher end
                          applies to shorter-term work.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full">
                    <label className="text-sm mb-1" htmlFor="min-rate">
                      Minimum
                    </label>
                    <Input id="min-rate" type="number" min={0} value={rateRange[0]} onChange={handleMinChange} className="w-full" placeholder="Min" inputMode="numeric" />
                  </div>
                  <div className="flex flex-col w-full mt-2">
                    <label className="text-sm mb-1" htmlFor="max-rate">
                      Maximum
                    </label>
                    <Input id="max-rate" type="number" min={0} value={rateRange[1]} onChange={handleMaxChange} className="w-full" placeholder="Max" inputMode="numeric" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Range from ${rateRange[0]} to ${rateRange[1]} per day
                </p>
              </div>
            </TabsContent>

            <TabsContent value="hourly" className="pt-4">
              <div className="px-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Hourly Rate Range</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Set your expected hourly rate range. The lower end
                          applies to higher volume commitments (20+ hours/week),
                          while the higher end applies to specialized or lower
                          volume work.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full">
                    <label className="text-sm mb-1" htmlFor="min-rate">
                      Minimum
                    </label>
                    <Input id="min-rate" type="number" min={0} value={rateRange[0]} onChange={handleMinChange} className="w-full" placeholder="Min" inputMode="numeric" />
                  </div>
                  <div className="flex flex-col w-full mt-2">
                    <label className="text-sm mb-1" htmlFor="max-rate">
                      Maximum
                    </label>
                    <Input id="max-rate" type="number" min={0} value={rateRange[1]} onChange={handleMaxChange} className="w-full" placeholder="Max" inputMode="numeric" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Range from ${rateRange[0]} to ${rateRange[1]} per hour
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CompensationSection;
