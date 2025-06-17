import { DollarSign, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface CompensationSectionProps {
  paymentType: string;
  setPaymentType: (type: string) => void;
  rateRange: number[];
  setRateRange: (range: number[]) => void;
  showOnly?: 'annual' | 'hourly-daily'; // New prop for conditional rendering
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
  const handleMinChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setRateRange([numValue, rateRange[1]]);
  };
  const handleMaxChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setRateRange([rateRange[0], numValue]);
  };
  return <div>
      <div className="flex items-center gap-2 mb-4">
        
        <div>
          
          
        </div>
      </div>
      
      {/* Display either only annual, or only hourly and daily based on showOnly prop */}
      {showOnly === 'annual' ?
    // Annual salary only option for full-time positions
    <div className="mb-6">
          <div className="bg-muted/30 rounded-md p-2 mb-4">
            <span className="text-sm font-medium">Annual Cash Compensation (including base and incentives)</span>
          </div>
          
          <div className="px-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Compensation Range (USD)</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Set your expected total cash compensation range including base salary and incentives for full-time positions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-annual" className="text-sm font-medium">Minimum (USD)</Label>
                <Input id="min-annual" type="text" value={formatSalary(rateRange[0])} onChange={e => handleMinChange(e.target.value)} placeholder="$75,000" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="max-annual" className="text-sm font-medium">Maximum (USD)</Label>
                <Input id="max-annual" type="text" value={formatSalary(rateRange[1])} onChange={e => handleMaxChange(e.target.value)} placeholder="$100,000" className="mt-1" />
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">Range from {formatSalary(rateRange[0])} to {formatSalary(rateRange[1])}</p>
          </div>
        </div> : showOnly === 'hourly-daily' ?
    // Hourly and daily rate options only for flexible positions
    <Tabs defaultValue={paymentType} onValueChange={setPaymentType} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hourly">Hourly Rate</TabsTrigger>
            <TabsTrigger value="daily">Daily Rate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="pt-4">
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Hourly Rate Range (USD)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Set your expected hourly rate range. The lower end applies to higher volume commitments (20+ hours/week), while the higher end applies to specialized or lower volume work.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-hourly" className="text-sm font-medium">Minimum (USD)</Label>
                  <Input id="min-hourly" type="text" value={`$${rateRange[0]}`} onChange={e => handleMinChange(e.target.value)} placeholder="$75" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="max-hourly" className="text-sm font-medium">Maximum (USD)</Label>
                  <Input id="max-hourly" type="text" value={`$${rateRange[1]}`} onChange={e => handleMaxChange(e.target.value)} placeholder="$150" className="mt-1" />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">Range from $${rateRange[0]} to $${rateRange[1]} per hour</p>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="pt-4">
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Daily Rate Range (USD)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Set your expected daily rate range. The lower end applies to longer engagements, while the higher end applies to shorter-term work.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-daily" className="text-sm font-medium">Minimum (USD)</Label>
                  <Input id="min-daily" type="text" value={`$${rateRange[0]}`} onChange={e => handleMinChange(e.target.value)} placeholder="$500" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="max-daily" className="text-sm font-medium">Maximum (USD)</Label>
                  <Input id="max-daily" type="text" value={`$${rateRange[1]}`} onChange={e => handleMaxChange(e.target.value)} placeholder="$1,000" className="mt-1" />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">Range from $${rateRange[0]} to $${rateRange[1]} per day</p>
            </div>
          </TabsContent>
        </Tabs> :
    // Default case - show all options (original functionality)
    <Tabs defaultValue="annual" onValueChange={setPaymentType} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="annual">Annual Cash Compensation</TabsTrigger>
            <TabsTrigger value="daily">Daily Rate</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Rate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="annual" className="pt-4">
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Compensation Range (USD)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Set your expected total cash compensation range including base salary and incentives. The lower end applies to higher volume commitments, while the higher end applies to more specialized or shorter-term work.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-annual-default" className="text-sm font-medium">Minimum (USD)</Label>
                  <Input id="min-annual-default" type="text" value={formatSalary(rateRange[0])} onChange={e => handleMinChange(e.target.value)} placeholder="$75,000" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="max-annual-default" className="text-sm font-medium">Maximum (USD)</Label>
                  <Input id="max-annual-default" type="text" value={formatSalary(rateRange[1])} onChange={e => handleMaxChange(e.target.value)} placeholder="$100,000" className="mt-1" />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">Range from {formatSalary(rateRange[0])} to {formatSalary(rateRange[1])}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="pt-4">
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Daily Rate Range (USD)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Set your expected daily rate range. The lower end applies to longer engagements, while the higher end applies to shorter-term work.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-daily-default" className="text-sm font-medium">Minimum (USD)</Label>
                  <Input id="min-daily-default" type="text" value={`$${rateRange[0]}`} onChange={e => handleMinChange(e.target.value)} placeholder="$500" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="max-daily-default" className="text-sm font-medium">Maximum (USD)</Label>
                  <Input id="max-daily-default" type="text" value={`$${rateRange[1]}`} onChange={e => handleMaxChange(e.target.value)} placeholder="$1,000" className="mt-1" />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">Range from $${rateRange[0]} to $${rateRange[1]} per day</p>
            </div>
          </TabsContent>
          
          <TabsContent value="hourly" className="pt-4">
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Hourly Rate Range (USD)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Set your expected hourly rate range. The lower end applies to higher volume commitments (20+ hours/week), while the higher end applies to specialized or lower volume work.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-hourly-default" className="text-sm font-medium">Minimum (USD)</Label>
                  <Input id="min-hourly-default" type="text" value={`$${rateRange[0]}`} onChange={e => handleMinChange(e.target.value)} placeholder="$75" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="max-hourly-default" className="text-sm font-medium">Maximum (USD)</Label>
                  <Input id="max-hourly-default" type="text" value={`$${rateRange[1]}`} onChange={e => handleMaxChange(e.target.value)} placeholder="$150" className="mt-1" />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">Range from $${rateRange[0]} to $${rateRange[1]} per hour</p>
            </div>
          </TabsContent>
        </Tabs>}
    </div>;
};
export default CompensationSection;