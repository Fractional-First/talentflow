
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, User } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

const TeamCoaching = () => {
  const navigate = useNavigate()

  const processSteps = [
    {
      text: "Engagement designed with you to fit your team's meeting rhythm and work patterns",
      completed: true
    },
    {
      text: "Focus on both business outcomes and relationship quality",
      completed: true
    },
    {
      text: "Practical, in-the-moment work on your most pressing challenges and opportunities",
      completed: true
    },
    {
      text: "Develop habits of clear communication, genuine alignment, and effective decision-making",
      completed: true
    }
  ]

  const gettingStartedContent = "Your journey begins with a complimentary 25-minute Intro Call with the leader/sponsor to outline context and desired outcomes. This leads to a Discovery Call to explore possibilities — with quick wins often emerging here — followed by a tailored proposal designed around your team's needs."

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
                  <h1 className="text-3xl font-semibold">Leadership Team Coaching</h1>
                  <p className="text-lg text-primary font-medium">Improve Team Effectiveness, Fulfilment, and Results.</p>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Every leadership team is its own relationship system — with a unique character, strengths, and challenges. 
                    All teams aspire to deliver exceptional results. But truly great teams go further: they create an environment 
                    of deep trust, honest dialogue, commitment, and alignment.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    This engagement is about achieving both — operational excellence and the most rewarding team experience 
                    you've ever had — all in the flow of your real work together.
                  </p>
                </div>

                {/* Coach Section */}
                <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-medium">Your Coach</h2>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                      <BlurImage
                        src="/lovable-uploads/ea353678-088b-4c2c-a98b-4d40f6668684.png"
                        alt="Stephen Burke"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-medium text-base">Stephen Burke</h3>
                        <p className="text-sm text-muted-foreground">Executive & Leadership Coach</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4">
                        View Stephen's Profile
                      </Button>
                    </div>
                  </div>
                  
                  {/* Stephen's Description */}
                  <div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Stephen brings deep experience in organizational systems and team dynamics. His background in 
                      global engineering leadership combined with expertise in human potential makes him uniquely 
                      qualified to help leadership teams navigate complex challenges while building stronger relationships 
                      and achieving better outcomes.
                    </p>
                  </div>
                </div>

                {/* Process and Getting Started Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Process Section */}
                  <div className="space-y-6 bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-xl font-medium">Process</h2>
                    </div>
                    <div className="space-y-4">
                      {processSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-base text-muted-foreground">{step.text}</p>
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
                    onClick={() => window.open('https://scheduler.zoom.us/stephen-burke-nporpf/25mins_intro_stephen', '_blank')}
                  >
                    Schedule Your Intro Call
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

export default TeamCoaching
