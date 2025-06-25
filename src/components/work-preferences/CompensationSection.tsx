
import { DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompensationSectionProps {
  paymentType: string
  setPaymentType: (type: string) => void
  rateRange: number[]
  setRateRange: (range: number[]) => void
  showOnly?: "annual" | "hourly-daily"
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

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0
    setRateRange([min, rateRange[1]])
  }
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0
    setRateRange([rateRange[0], max])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-[#449889]" />
        <h3 className="text-lg font-semibold text-foreground">Compensation Expectations</h3>
      </div>
      <p className="text-sm text-muted-foreground pl-8">
        Set your expected {showOnly === "annual" ? "salary" : "rate"} range
      </p>

      {showOnly === "annual" ? (
        <div className="pl-8 space-y-4">
          <Label className="text-base font-medium text-foreground">
            Annual Salary Compensation (including bonuses and equity expectations)
          </Label>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span>Compensation Range (USD)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-salary" className="text-sm font-medium">
                  Minimum (USD)
                </Label>
                <Input
                  id="min-salary"
                  type="text"
                  value={rateRange[0] ? formatSalary(rateRange[0]) : ""}
                  onChange={handleMinChange}
                  placeholder="$75,000"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-salary" className="text-sm font-medium">
                  Maximum (USD)
                </Label>
                <Input
                  id="max-salary"
                  type="text"
                  value={rateRange[1] ? formatSalary(rateRange[1]) : ""}
                  onChange={handleMaxChange}
                  placeholder="$150,000"
                  className="h-10"
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              Range from {formatSalary(rateRange[0] || 0)} to {formatSalary(rateRange[1] || 0)} annually
            </div>
          </div>
        </div>
      ) : (
        <div className="pl-8">
          <Tabs value={paymentType} onValueChange={setPaymentType} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="hourly" className="font-medium">Hourly Rate</TabsTrigger>
              <TabsTrigger value="daily" className="font-medium">Daily Rate</TabsTrigger>
            </TabsList>

            <TabsContent value="hourly" className="space-y-4">
              <Label className="text-base font-medium text-foreground">
                Hourly Rate Range (USD)
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-hourly" className="text-sm font-medium">
                    Minimum (USD)
                  </Label>
                  <Input
                    id="min-hourly"
                    type="number"
                    min={0}
                    value={rateRange[0] || ""}
                    onChange={handleMinChange}
                    placeholder="$75"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-hourly" className="text-sm font-medium">
                    Maximum (USD)
                  </Label>
                  <Input
                    id="max-hourly"
                    type="number"
                    min={0}
                    value={rateRange[1] || ""}
                    onChange={handleMaxChange}
                    placeholder="$150"
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                Range from ${rateRange[0] || 0} to ${rateRange[1] || 0} per hour
              </div>
            </TabsContent>

            <TabsContent value="daily" className="space-y-4">
              <Label className="text-base font-medium text-foreground">
                Daily Rate Range (USD)
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-daily" className="text-sm font-medium">
                    Minimum (USD)
                  </Label>
                  <Input
                    id="min-daily"
                    type="number"
                    min={0}
                    value={rateRange[0] || ""}
                    onChange={handleMinChange}
                    placeholder="$600"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-daily" className="text-sm font-medium">
                    Maximum (USD)
                  </Label>
                  <Input
                    id="max-daily"
                    type="number"
                    min={0}
                    value={rateRange[1] || ""}
                    onChange={handleMaxChange}
                    placeholder="$1,200"
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                Range from ${rateRange[0] || 0} to ${rateRange[1] || 0} per day
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default CompensationSection
