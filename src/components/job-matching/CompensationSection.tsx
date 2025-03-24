
import { 
  DollarSign, 
  HelpCircle 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompensationSectionProps {
  paymentType: string;
  setPaymentType: (type: string) => void;
  rateRange: number[];
  setRateRange: (range: number[]) => void;
}

const CompensationSection = ({
  paymentType,
  setPaymentType,
  rateRange,
  setRateRange
}: CompensationSectionProps) => {
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Compensation Expectations</h3>
          <p className="text-sm text-muted-foreground">Set your preferred compensation range</p>
        </div>
      </div>
      
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
                    <p className="max-w-xs">Set your expected salary range. The lower end applies to higher volume commitments, while the higher end applies to more specialized or shorter-term work.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              defaultValue={[75000, 100000]}
              max={200000}
              min={30000}
              step={5000}
              value={rateRange}
              onValueChange={setRateRange}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">{formatSalary(rateRange[0])}</span>
              <span className="text-sm font-medium">{formatSalary(rateRange[1])}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Range from {formatSalary(rateRange[0])} to {formatSalary(rateRange[1])}</p>
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
                    <p className="max-w-xs">Set your expected daily rate range. The lower end applies to longer engagements, while the higher end applies to shorter-term work.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              defaultValue={[500, 1000]}
              max={3000}
              min={100}
              step={50}
              value={[500, 1000]}
              onValueChange={() => {}}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">$500</span>
              <span className="text-sm font-medium">$1,000</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Range from $500 to $1,000 per day</p>
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
                    <p className="max-w-xs">Set your expected hourly rate range. The lower end applies to higher volume commitments (20+ hours/week), while the higher end applies to specialized or lower volume work.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              defaultValue={[75, 150]}
              max={500}
              min={25}
              step={5}
              value={[75, 150]}
              onValueChange={() => {}}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">$75</span>
              <span className="text-sm font-medium">$150</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Range from $75 to $150 per hour</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompensationSection;
