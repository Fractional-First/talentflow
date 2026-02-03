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
  <div className="flex flex-col items-center text-center gap-2">
    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm border border-border">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground leading-tight">{subtitle}</p>}
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
  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center gap-2`}>
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
    { icon: <Users className="h-5 w-5 text-blue-600" />, title: "Match with Client" },
    { icon: <FileText className="h-5 w-5 text-blue-600" />, title: "FF Issues SOW", subtitle: "(Statement of Work)" },
    { icon: <Briefcase className="h-5 w-5 text-blue-600" />, title: "Start Work" },
  ]

  const pathBSteps = [
    { icon: <Users className="h-5 w-5 text-emerald-600" />, title: "Match with Client" },
    { icon: <FileText className="h-5 w-5 text-emerald-600" />, title: "Client Issues Offer" },
    { icon: <Briefcase className="h-5 w-5 text-emerald-600" />, title: "Start Work" },
  ]

  return (
    <Card className="border-border bg-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground text-center">
          How Your Contractual Relationship Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="flex flex-col items-center gap-6">
            {/* Primary Step - Centered */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center min-w-[220px]">
              <div className="flex items-center justify-center mb-2">
                <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  Step 1
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <FileSignature className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Sign Master Agreement with FF</p>
              <p className="text-xs text-muted-foreground mt-1">One-time signature for all future engagements</p>
            </div>

              {/* Arrow down to paths */}
              <ArrowDown className="h-6 w-6 text-muted-foreground" />

              {/* Branching Paths - Side by side */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Path A - Blue */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">
                      Path A
                    </span>
                    <span className="text-sm font-semibold text-blue-800">
                      Engaged via FF (Fractional/Interim)
                    </span>
                  </div>
                  <PathSteps steps={pathASteps} isMobile={false} />
                  <p className="text-xs text-blue-600 mt-4 font-medium">
                    ✓ No additional client paperwork needed
                  </p>
                </div>

                {/* Path B - Green */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                      Path B
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      Direct-Hire
                    </span>
                  </div>
                  <PathSteps steps={pathBSteps} isMobile={false} />
                  <p className="text-xs text-emerald-600 mt-4 font-medium">
                    ✓ Directly hired via Client's own contract
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Layout */}
          {isMobile && (
            <div className="flex flex-col items-center gap-4">
              {/* Primary Step */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center w-full">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    Step 1
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <FileSignature className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Sign Master Agreement with FF</p>
                <p className="text-xs text-muted-foreground mt-1">One-time signature for all future engagements</p>
              </div>

              {/* Arrow down */}
              <ArrowDown className="h-6 w-6 text-muted-foreground" />

              {/* Then splits into */}
              <p className="text-xs text-muted-foreground font-medium">Then one of two paths:</p>

              {/* Paths container */}
              <div className="grid grid-cols-1 gap-4 w-full">
                {/* Path A - Blue */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">
                      Path A
                    </span>
                    <span className="text-sm font-semibold text-blue-800">
                      Engaged via FF
                    </span>
                  </div>
                  <PathSteps steps={pathASteps} isMobile={true} />
                  <p className="text-xs text-blue-600 mt-4 font-medium text-center">
                    ✓ No additional client paperwork needed
                  </p>
                </div>

                {/* Path B - Green */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                      Path B
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      Direct-Hire
                    </span>
                  </div>
                  <PathSteps steps={pathBSteps} isMobile={true} />
                  <p className="text-xs text-emerald-600 mt-4 font-medium text-center">
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
