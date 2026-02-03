import { 
  FileSignature, 
  Users, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  ArrowDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"

interface StepProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
}

const Step = ({ icon, title, subtitle }: StepProps) => (
  <div className="flex flex-col items-center text-center gap-1">
    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm border border-border">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-foreground">{title}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>}
    </div>
  </div>
)

const PathSteps = ({ 
  steps, 
  isMobile 
}: { 
  steps: { icon: React.ReactNode; title: string }[]
  isMobile: boolean 
}) => (
  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-2`}>
    {steps.map((step, index) => (
      <div key={index} className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center gap-2`}>
        <Step icon={step.icon} title={step.title} />
        {index < steps.length - 1 && (
          isMobile ? (
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          )
        )}
      </div>
    ))}
  </div>
)

export const ContractualRoadmap = () => {
  const isMobile = useIsMobile()

  const pathASteps = [
    { icon: <Users className="h-4 w-4 text-primary" />, title: "Match with Client" },
    { icon: <FileText className="h-4 w-4 text-primary" />, title: "FF Issues SOW", subtitle: "(Statement of Work)" },
    { icon: <Briefcase className="h-4 w-4 text-primary" />, title: "Start Work" },
  ]

  const pathBSteps = [
    { icon: <Users className="h-4 w-4 text-primary" />, title: "Match with Client" },
    { icon: <FileText className="h-4 w-4 text-primary" />, title: "Client Issues Offer" },
    { icon: <Briefcase className="h-4 w-4 text-primary" />, title: "Start Work" },
  ]

  return (
    <Card className="border-border bg-muted/30">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-semibold text-foreground text-center">
          How Your Contractual Relationship Works
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        {/* Desktop Layout - Left to Right Flow */}
        {!isMobile && (
          <div className="flex items-stretch gap-3">
            {/* Primary Step - Left */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center flex flex-col justify-center min-w-[160px]">
              <div className="flex items-center justify-center mb-1">
                <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  Step 1
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground">Sign Master Agreement with FF</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">One-time signature for all future engagements</p>
            </div>

            {/* Arrows pointing to paths */}
            <div className="flex flex-col justify-center gap-8">
              <ArrowRight className="h-5 w-5 text-primary/60" />
              <ArrowRight className="h-5 w-5 text-primary/60" />
            </div>

            {/* Branching Paths - Stacked vertically on right */}
            <div className="flex flex-col gap-2 flex-1">
              {/* Path A */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    Path A
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Engaged via FF (Fractional/Interim)
                  </span>
                </div>
                <PathSteps steps={pathASteps} isMobile={false} />
                <p className="text-[10px] text-primary mt-2 font-medium">
                  ✓ No additional client paperwork needed
                </p>
              </div>

              {/* Path B */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    Path B
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Direct-Hire
                  </span>
                </div>
                <PathSteps steps={pathBSteps} isMobile={false} />
                <p className="text-[10px] text-primary mt-2 font-medium">
                  ✓ Directly hired via Client's own contract
                </p>
              </div>
            </div>
          </div>
        )}

          {/* Mobile Layout */}
          {isMobile && (
            <div className="flex flex-col items-center gap-3">
              {/* Primary Step */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center w-full">
                <div className="flex items-center justify-center mb-1">
                  <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    Step 1
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <FileSignature className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">Sign Master Agreement with FF</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">One-time signature for all future engagements</p>
              </div>

              {/* Arrow down */}
              <ArrowDown className="h-5 w-5 text-primary/60" />

              {/* Then splits into */}
              <p className="text-[10px] text-muted-foreground font-medium">Then one of two paths:</p>

              {/* Paths container */}
              <div className="grid grid-cols-1 gap-2 w-full">
                {/* Path A */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                      Path A
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Engaged via FF
                    </span>
                  </div>
                  <PathSteps steps={pathASteps} isMobile={true} />
                  <p className="text-[10px] text-primary mt-2 font-medium">
                    ✓ No additional client paperwork needed
                  </p>
                </div>

                {/* Path B */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                      Path B
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Direct-Hire
                    </span>
                  </div>
                  <PathSteps steps={pathBSteps} isMobile={true} />
                  <p className="text-[10px] text-primary mt-2 font-medium">
                    ✓ Directly hired via Client's own contract
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
  )
}
