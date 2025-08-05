
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardFooter,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  UsersRound,
  Target,
  Rocket,
  Network,
} from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const Branding = () => {
  const navigate = useNavigate()

  const coachingServices = [
    {
      id: 1,
      title: "Executive 1:1 Coaching",
      subheadline: "Perform Better. Relate Better. Feel Better.",
      description:
        "Personalized coaching designed to accelerate your leadership growth and well-being.",
      bulletPoints: [
        "Tailored to your unique leadership context",
        "3-month engagement with up to 3 sessions per month",
        "Complimentary intake process to assess fit"
      ],
      icon: User,
      ctaText: "Schedule Intro Call",
      imageSrc:
        "https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 2,
      title: "Leadership Team Coaching",
      subheadline: "Elevate Team Effectiveness and Collective Results",
      description:
        "Strengthen your leadership team's relationships, decision-making, and results through customized team coaching aligned to your business context.",
      bulletPoints: [
        "Designed around your team's existing meeting cadence",
        "Balances business tasks with deep relationship work",
        "Starts with a free intake consultation and proposal"
      ],
      icon: UsersRound,
      ctaText: "Request Coaching Proposal",
      imageSrc:
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 3,
      title: "Leadership Style Diagnostics",
      subheadline: "Understand Yourself. Lead Authentically.",
      description:
        "Gain deep insight into your leadership style using the Leadership Circle Profile (LCP)—a powerful 360° diagnostic that reveals how you're showing up as a leader. We work with you to explore strengths, reactive patterns, and growth edges, supporting reflection and targeted development.",
      bulletPoints: [
        "Leadership Circle Profile (LCP) 360° diagnostic",
        "Self-Assessment version when 360° feedback isn't possible",
        "Personalized debrief and optional coaching pairing"
      ],
      icon: Target,
      ctaText: "Schedule LCP Debrief",
      imageSrc:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 4,
      title: "Placement Impact Coaching",
      subheadline: "Accelerate Your Impact in New Roles",
      description:
        "Support your transition into a new role with targeted onboarding coaching designed to answer, \"What is being asked of me as a leader?\" We help Fractionals define success in context, navigate complexity, and align their leadership impact with team and organizational needs.",
      bulletPoints: [
        "Targeted onboarding for new role transitions",
        "Contextual success definition and alignment",
        "Ideal for newly placed Fractionals"
      ],
      icon: Rocket,
      ctaText: "Book Onboarding Coaching",
      imageSrc:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 5,
      title: "Leadership Network Activation",
      subheadline: "Connect. Reflect. Lead Together.",
      description:
        "Join a facilitated peer experience rooted in Ikigai Leading's Thinking Environment®. Through workshops and cohort-based learning, leaders explore purpose, self-awareness, and collective impact. Build relationships across the Fractional network while deepening your capacity to lead in complexity.",
      bulletPoints: [
        "Facilitated peer experience with Thinking Environment®",
        "Workshops and cohort-based learning",
        "Build relationships across the Fractional network"
      ],
      icon: Network,
      ctaText: "Join Peer Workshop",
      imageSrc:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StepCard>
          <StepCardHeader>
            <div className="flex items-center gap-3">
              <StepCardTitle className="text-3xl font-semibold">Professional Coaching by Trusted Partners</StepCardTitle>
              <Badge variant="outline" className="text-sm px-3 py-1 rounded-full">
                Optional
              </Badge>
            </div>
            <StepCardDescription className="text-lg mt-3 text-muted-foreground">
              Achieve greater clarity, alignment, and effectiveness—whether you're leading solo or as a team.
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coachingServices.map((service, index) => (
                <Card
                  key={service.id}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-medium animate-slide-up border-2 border-primary/10 bg-primary/2`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <BlurImage
                      src={service.imageSrc}
                      alt={service.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary rounded-full">
                      Premium Partner Service
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-medium">{service.title}</CardTitle>
                          <p className="text-sm font-medium text-primary mt-1">{service.subheadline}</p>
                        </div>
                      </div>
                    </div>

                    <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                    
                    <div className="mt-3">
                      <ul className="space-y-1">
                        {service.bulletPoints.map((point, bulletIndex) => (
                          <li key={bulletIndex} className="flex items-start text-sm text-muted-foreground">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardHeader>

                  <CardFooter>
                    <Button
                      variant="default"
                      className="w-full rounded-full"
                    >
                      {service.ctaText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                These coaching offerings are delivered by trusted partners of Fractional First. Intake is commitment-free and designed to help you clarify your goals before engaging.
              </p>
              <p className="text-sm text-muted-foreground">
                These services are delivered by Ikigai Leading, a trusted coaching partner. All sessions begin with a no-pressure intake to clarify goals and ensure fit.
              </p>
            </div>
          </StepCardContent>

          <StepCardFooter className="flex justify-start pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  )
}

export default Branding
