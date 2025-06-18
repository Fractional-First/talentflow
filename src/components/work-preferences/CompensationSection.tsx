import { DollarSign, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

interface CompensationSectionProps {
  paymentType: string
  setPaymentType: (type: string) => void
  rateRange: number[]
  setRateRange: (range: number[]) => void
  showOnly?: "annual" | "hourly-daily" // New prop for conditional rendering
}

const CompensationSection = ({
  paymentType,
  setPaymentType,
  rateRange,
  setRateRange,
  showOnly,
}: CompensationSectionProps) => {
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  // Helper for input change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0
    setRateRange([min, rateRange[1]])
  }
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0
    setRateRange([rateRange[0], max])
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Compensation Expectations</h3>
          <p className="text-sm text-muted-foreground">
            Set your preferred compensation range
          </p>
        </div>
      </div>

      {/* Display either only annual, or only hourly and daily based on showOnly prop */}
      {showOnly === "annual" ? (
        // Annual salary only option for full-time positions
        <div className="mb-6">
          <div className="bg-muted/30 rounded-md p-2 mb-4">
            <span className="text-sm font-medium">Annual Salary</span>
          </div>

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
                      Set your expected salary range for full-time positions.
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
                <Input
                  id="min-rate"
                  type="number"
                  min={0}
                  value={rateRange[0]}
                  onChange={handleMinChange}
                  className="w-full"
                  placeholder="Min"
                  inputMode="numeric"
                />
              </div>
              <div className="flex flex-col w-full mt-2">
                <label className="text-sm mb-1" htmlFor="max-rate">
                  Maximum
                </label>
                <Input
                  id="max-rate"
                  type="number"
                  min={0}
                  value={rateRange[1]}
                  onChange={handleMaxChange}
                  className="w-full"
                  placeholder="Max"
                  inputMode="numeric"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Range from {formatSalary(rateRange[0])} to{" "}
              {formatSalary(rateRange[1])}
            </p>
          </div>
        </div>
      ) : showOnly === "hourly-daily" ? (
        // Hourly and daily rate options only for flexible positions
        <Tabs
          value={paymentType}
          onValueChange={setPaymentType}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hourly">Hourly Rate</TabsTrigger>
            <TabsTrigger value="daily">Daily Rate</TabsTrigger>
          </TabsList>

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
                  <Input
                    id="min-rate"
                    type="number"
                    min={0}
                    value={rateRange[0]}
                    onChange={handleMinChange}
                    className="w-full"
                    placeholder="Min"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex flex-col w-full mt-2">
                  <label className="text-sm mb-1" htmlFor="max-rate">
                    Maximum
                  </label>
                  <Input
                    id="max-rate"
                    type="number"
                    min={0}
                    value={rateRange[1]}
                    onChange={handleMaxChange}
                    className="w-full"
                    placeholder="Max"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Range from ${rateRange[0]} to ${rateRange[1]} per hour
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
                  <Input
                    id="min-rate"
                    type="number"
                    min={0}
                    value={rateRange[0]}
                    onChange={handleMinChange}
                    className="w-full"
                    placeholder="Min"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex flex-col w-full mt-2">
                  <label className="text-sm mb-1" htmlFor="max-rate">
                    Maximum
                  </label>
                  <Input
                    id="max-rate"
                    type="number"
                    min={0}
                    value={rateRange[1]}
                    onChange={handleMaxChange}
                    className="w-full"
                    placeholder="Max"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Range from ${rateRange[0]} to ${rateRange[1]} per day
              </p>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Default case - show all options (original functionality)
        <Tabs
          defaultValue="annual"
          onValueChange={setPaymentType}
          className="mb-6"
        >
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
                  <Input
                    id="min-rate"
                    type="number"
                    min={0}
                    value={rateRange[0]}
                    onChange={handleMinChange}
                    className="w-full"
                    placeholder="Min"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex flex-col w-full mt-2">
                  <label className="text-sm mb-1" htmlFor="max-rate">
                    Maximum
                  </label>
                  <Input
                    id="max-rate"
                    type="number"
                    min={0}
                    value={rateRange[1]}
                    onChange={handleMaxChange}
                    className="w-full"
                    placeholder="Max"
                    inputMode="numeric"
                  />
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
                  <Input
                    id="min-rate"
                    type="number"
                    min={0}
                    value={rateRange[0]}
                    onChange={handleMinChange}
                    className="w-full"
                    placeholder="Min"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex flex-col w-full mt-2">
                  <label className="text-sm mb-1" htmlFor="max-rate">
                    Maximum
                  </label>
                  <Input
                    id="max-rate"
                    type="number"
                    min={0}
                    value={rateRange[1]}
                    onChange={handleMaxChange}
                    className="w-full"
                    placeholder="Max"
                    inputMode="numeric"
                  />
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
                  <Input
                    id="min-rate"
                    type="number"
                    min={0}
                    value={rateRange[0]}
                    onChange={handleMinChange}
                    className="w-full"
                    placeholder="Min"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex flex-col w-full mt-2">
                  <label className="text-sm mb-1" htmlFor="max-rate">
                    Maximum
                  </label>
                  <Input
                    id="max-rate"
                    type="number"
                    min={0}
                    value={rateRange[1]}
                    onChange={handleMaxChange}
                    className="w-full"
                    placeholder="Max"
                    inputMode="numeric"
                  />
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
  )
}

export default CompensationSection
