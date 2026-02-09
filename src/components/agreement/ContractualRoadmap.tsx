import { 
  FileSignature, 
  Users, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  ArrowDown,
  ArrowLeftRight
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

const SharedStepCard = ({ 
  stepLabel, 
  icon, 
  title, 
  subtitle 
}: { 
  stepLabel: string
  icon: React.ReactNode
  title: string
  subtitle: string 
}) => (
  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center flex flex-col justify-center min-w-[160px]">
    <div className="flex items-center justify-center mb-1">
      <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
        {stepLabel}
      </span>
    </div>
    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
      {icon}
    </div>
    <p className="text-xs font-semibold text-foreground">{title}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
  </div>
)

export const ContractualRoadmap = () => {
  const isMobile = useIsMobile()

  const pathASteps = [
    { icon: <FileText className="h-4 w-4 text-primary" />, title: "FF Issues SOW", subtitle: "(Statement of Work)" },
    { icon: <Briefcase className="h-4 w-4 text-primary" />, title: "Start Work" },
  ]

  const pathBSteps = [
    { icon: <FileText className="h-4 w-4 text-primary" />, title: "Client Issues Offer" },
    { icon: <Briefcase className="h-4 w-4 text-primary" />, title: "Start Work" },
  ]

  const pathABullets = [
    "Fractional First acts as your administrative partner.",
    "We handle all contracting, invoicing, and cross-border payments so you can focus on leadership impact.",
  ]

  const pathBBullets = [
    "Direct alignment between you and the client.",
    "Full-time integration into the leadership team from Day 1.",
  ]

  return (
    <Card className="border-border bg-muted/30">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-semibold text-foreground text-center">
          How We Work
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        {/* Desktop Layout */}
        {!isMobile && (
          <div className="flex items-stretch gap-3">
            {/* Shared Steps - Left */}
            <div className="flex flex-col items-center justify-center gap-2">
              <SharedStepCard
                stepLabel="Step 1"
                icon={<FileSignature className="h-5 w-5 text-primary" />}
                title="Sign Master Agreement with FF"
                subtitle="One-time signature for all future engagements"
              />
              <ArrowDown className="h-5 w-5 text-primary/60" />
              <SharedStepCard
                stepLabel="Step 2"
                icon={<Users className="h-5 w-5 text-primary" />}
                title="Match with Client"
                subtitle="We connect you with the right opportunity"
              />
            </div>

            {/* Arrows pointing to paths */}
            <div className="flex flex-col justify-center">
              <ArrowRight className="h-5 w-5 text-primary/60" />
            </div>

            {/* Branching Paths - Right */}
            <div className="flex flex-col gap-2 flex-1">
              {/* Path A */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    Path A
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Engaged via FF (Fractional/Interim)
                  </span>
                </div>
                <PathSteps steps={pathASteps} isMobile={false} />
                <ul className="mt-2 space-y-1 text-left">
                  {pathABullets.map((bullet, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversion Flexibility Connector */}
              <div className="flex items-center justify-center gap-2 py-1">
                <ArrowLeftRight className="h-4 w-4 text-primary/60" />
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-primary">Conversion Flexibility</p>
                  <p className="text-[9px] text-muted-foreground">(upon mutual agreement)</p>
                </div>
                <ArrowLeftRight className="h-4 w-4 text-primary/60" />
              </div>

              {/* Path B */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    Path B
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Direct-Hire
                  </span>
                </div>
                <PathSteps steps={pathBSteps} isMobile={false} />
                <ul className="mt-2 space-y-1 text-left">
                  {pathBBullets.map((bullet, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="flex flex-col items-center gap-3">
            <SharedStepCard
              stepLabel="Step 1"
              icon={<FileSignature className="h-5 w-5 text-primary" />}
              title="Sign Master Agreement with FF"
              subtitle="One-time signature for all future engagements"
            />
            <ArrowDown className="h-5 w-5 text-primary/60" />
            <SharedStepCard
              stepLabel="Step 2"
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Match with Client"
              subtitle="We connect you with the right opportunity"
            />
            <ArrowDown className="h-5 w-5 text-primary/60" />
            <p className="text-[10px] text-muted-foreground font-medium">Then one of two paths:</p>

            {/* Path A */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  Path A
                </span>
                <span className="text-xs font-semibold text-foreground">
                  Engaged via FF
                </span>
              </div>
              <PathSteps steps={pathASteps} isMobile={true} />
              <ul className="mt-2 space-y-1 text-left">
                {pathABullets.map((bullet, i) => (
                  <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conversion Flexibility Connector */}
            <div className="flex items-center justify-center gap-2 py-1">
              <ArrowLeftRight className="h-4 w-4 text-primary/60" />
              <div className="text-center">
                <p className="text-[10px] font-semibold text-primary">Conversion Flexibility</p>
                <p className="text-[9px] text-muted-foreground">(upon mutual agreement)</p>
              </div>
              <ArrowLeftRight className="h-4 w-4 text-primary/60" />
            </div>

            {/* Path B */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  Path B
                </span>
                <span className="text-xs font-semibold text-foreground">
                  Direct-Hire
                </span>
              </div>
              <PathSteps steps={pathBSteps} isMobile={true} />
              <ul className="mt-2 space-y-1 text-left">
                {pathBBullets.map((bullet, i) => (
                  <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
