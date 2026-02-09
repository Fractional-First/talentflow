import { 
  FileSignature, 
  Users, 
  FileText, 
  Briefcase, 
  ArrowDown,
  ArrowLeftRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      {subtitle && <p className="text-xs text-muted-foreground leading-tight">{subtitle}</p>}
    </div>
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
  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 inline-flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
    <div className="flex flex-col items-center shrink-0 gap-1">
      <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
        {stepLabel}
      </span>
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  </div>
)

const PathCard = ({
  label,
  title,
  steps,
  bullets,
}: {
  label: string
  title: string
  steps: { icon: React.ReactNode; title: string }[]
  bullets: string[]
}) => (
  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex-1">
    <div className="flex items-center justify-center gap-2 mb-2">
      <span className="text-[10px] font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground">{title}</span>
    </div>
    <div className="flex flex-col items-center gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <Step icon={step.icon} title={step.title} />
          {index < steps.length - 1 && (
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
    <ul className="mt-2 space-y-1 text-left">
      {bullets.map((bullet, i) => (
        <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
          <span className="text-primary mt-0.5">•</span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  </div>
)

export const ContractualRoadmap = () => {
  const pathASteps = [
    { icon: <FileText className="h-4 w-4 text-primary" />, title: "FF Issues SOW" },
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
        <div className="flex flex-col items-center gap-3">
          {/* Shared Steps */}
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
          <p className="text-xs text-muted-foreground font-medium">Then one of two paths:</p>

          {/* Side-by-side paths with conversion flexibility */}
          <div className="w-full relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PathCard
                label="Path A"
                title="Engaged via FF (Fractional/Interim)"
                steps={pathASteps}
                bullets={pathABullets}
              />

              {/* Mobile-only conversion connector */}
              <div className="flex items-center justify-center gap-2 py-1 sm:hidden">
                <ArrowLeftRight className="h-4 w-4 text-primary/60" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-primary">Conversion Flexibility</p>
                  <p className="text-[11px] text-muted-foreground">(upon mutual agreement)</p>
                </div>
                <ArrowLeftRight className="h-4 w-4 text-primary/60" />
              </div>

              <PathCard
                label="Path B"
                title="Direct-Hire"
                steps={pathBSteps}
                bullets={pathBBullets}
              />
            </div>

            {/* Desktop conversion connector overlay */}
            <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-0.5 bg-background/90 border border-primary/20 rounded-full px-3 py-1.5">
                <div className="flex items-center gap-1">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-primary/60" />
                  <p className="text-xs font-semibold text-primary">Conversion Flexibility</p>
                </div>
                <p className="text-[11px] text-muted-foreground">(upon mutual agreement)</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
