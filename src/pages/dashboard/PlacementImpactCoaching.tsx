
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, User } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

const PlacementImpactCoaching = () => {
  const navigate = useNavigate()

  const coaches = [
    {
      name: "Margot Thomas",
      title: "Co-Founder, Ikigai Leading",
      timezone: "Australia",
      bio: "Through immersive leadership programs, team effectiveness journeys, executive coaching partnerships and culture transformation initiatives, I help leaders and teams to become more conscious, purposeful and connected, creating a ripple impact across their organisations, customers, shareholders and the wider community.\n\nI bring a systemic approach shaped by decades of corporate leadership experience and a deep grounding in adult development theory. My career has taken me across South America, Europe, and Australia, navigating diverse sectors and cultures. Along the way, I've lived through many transitions myself—experiences that not only expanded my perspective but also deepened my belief in the potential of people to grow through change.\n\nClients describe me as a listener who creates space for both honesty and possibility. I'm known for blending strategic clarity with warmth, enabling leaders and teams to see patterns more clearly, work with courage, and step into more sustainable ways of leading and working together.",
      imageSrc: "/lovable-uploads/margot-thomas.png?v=2"
    },
    {
      name: "Monique Longhurst",
      title: "Co-Founder, Ikigai Leading",
      timezone: "Australia",
      bio: "I support leaders and teams to step into greater clarity, connection, and purpose through leadership programs, team effectiveness journeys, executive coaching, and culture transformation. My passion lies in building capacity not just for performance, but for sustainable impact that reaches across organisations, communities, and beyond.\n\nEnriched by a career spanning corporate, consulting and entrepreneurial contexts, alongside my own journey as a leader, parent and business founder, my approach is both systemic and developmental. Blending practical leadership experience with proven frameworks I strive to create spaces where leadership becomes conscious, values-aligned and regenerative.\n\nGrounded in curiosity and care, I bring depth of expertise and the ability to meet people where they are, holding a mirror that helps them see what is possible for themselves and those they lead.",
      imageSrc: "/lovable-uploads/monique-longhurst.png?v=2"
    },
    {
      name: "Candice Smith",
      title: "Founder, The Thinking Field",
      timezone: "Australia",
      bio: "I am a facilitator, coach, and thinking partner with over two decades guiding individuals, teams, and organisations to think more expansively, collaborate inclusively, and navigate complexity with clarity.\n\nI am known for creating generative environments for both reflecting and relating, where every voice matters, eliciting fresh thinking and courageous action. I blend facilitation mastery, leadership development, and cultural awareness to help individuals and organisations reimagine how they connect, collaborate, and lead through uncertainty with ease.\n\nAs senior Time To Think Faculty I lead their accreditation programs and a great joy is supervising coaches, facilitators and leaders in creating Thinking Environments®.\n\nI am humbled to be contributing to reconciliation in Australia as a facilitator of an award-winning Aboriginal and Torres Strait Islander Allyship program, as a descendent of South African First Nations.\n\nA meditation practice spanning twenty years deeply sustains me and my leadership practice.",
      imageSrc: "/lovable-uploads/candice-smith.png"
    }
  ]

  const processSteps = [
    "Complimentary 1-hour alignment meeting to understand your context, coaching needs, and fit",
    "Complete the Leadership Circle Profile® (LCP) Self-Assessment",
    "Tailored 1:1 coaching series: five 1.5-hour sessions held fortnightly or monthly",
    "Delivery: virtual",
    "Investment: AUD $3,900"
  ]

  const gettingStartedContent = "The coaching begins with a complimentary 1-hour alignment meeting to understand your context, coaching needs, and fit. You then complete the Leadership Circle Profile® (LCP) Self-Assessment, followed by a tailored 1:1 coaching series consisting of five 1.5-hour sessions held fortnightly or monthly. Delivery is virtual, and the investment is AUD $3,900."

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex-1 bg-white">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-semibold">Placement Impact Coaching</h1>
                  <p className="text-lg text-primary font-medium">Start Strong, Adapt Fast, Deliver Impact</p>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Placement Impact Coaching is a post-placement coaching series that supports Fractional leaders in adapting quickly and delivering meaningful impact in a new role. It uses the Leadership Circle Profile® (LCP) Self-Assessment to highlight strengths and blind spots. Leaders work with a coach to clarify expectations, navigate complexity, and align their contributions with the role, team, and organisation.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Its value is in helping you avoid a slow or unclear start by gaining clarity on expectations, strengthening key relationships, and adapting your leadership to the organisational context.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    This coaching is suitable if you are stepping into a new role and want to adapt with confidence and add value, if you are navigating greater responsibility or complexity, or if you want a trusted sounding board to test thinking, clarify priorities, and avoid blind spots.
                  </p>
                </div>

                {/* Your Coaches Section */}
                <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-medium">Your Coaches</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {coaches.map((coach, index) => (
                      <div key={index} className="space-y-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto lg:mx-0">
                          <BlurImage
                            src={coach.imageSrc}
                            alt={coach.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-base">{coach.name}</h3>
                          <p className="text-sm text-muted-foreground">{coach.title}</p>
                          <p className="text-sm text-muted-foreground">Timezone: {coach.timezone}</p>
                          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                            {coach.bio.split('\n\n').map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process and Getting Started Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Process Section */}
                  <div className="space-y-6 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-xl font-medium">The Process</h2>
                    </div>
                    <div className="space-y-4">
                      {processSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-base text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Getting Started Section */}
                  <div className="space-y-6 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-xl font-medium">Getting Started</h2>
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground leading-relaxed">{gettingStartedContent}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-6">
                  <Button 
                    size="lg" 
                    className="w-full lg:w-auto" 
                    asChild
                  >
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Schedule Your Alignment Call
                    </a>
                  </Button>
                </div>

                {/* Back Button */}
                <div className="flex justify-start pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard/branding")}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Coaching Options
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default PlacementImpactCoaching
