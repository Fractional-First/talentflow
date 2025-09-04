
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, User } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

const ExecutiveCoaching = () => {
  const navigate = useNavigate()

  const processSteps = [
    {
      text: "3-month engagement — US$8,000 package",
      completed: true
    },
    {
      text: "Up to 3 sessions per month (90 minutes each via phone or Zoom/Teams/Google Meet)",
      completed: true
    },
    {
      text: "Support between sessions via message, email, or brief calls as needed",
      completed: true
    },
    {
      text: "Coaching designed around your unique context and goals",
      completed: true
    }
  ]

  const gettingStartedContent = "Your journey begins with a complimentary 25-minute Intro Call — a chance to get acquainted and explore your goals. This call may lead to a more in-depth Discovery Call and even a Coaching Session to experience the kinds of insights and outcomes possible."

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
                  <h1 className="text-3xl font-semibold">Executive 1:1 Coaching</h1>
                  <p className="text-lg text-primary font-medium">Perform Better. Relate Better. Feel Better.</p>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Every leader operates in a unique context — shaped by your life experiences, skills, interests, challenges, 
                    and triggers. You are unlike anyone else. And yet, you share the universal drive of all leaders: to perform 
                    better, relate better, and feel better in both work and life.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    In 1:1 Coaching, we focus entirely on you and your access to these outcomes. We work quickly and 
                    directly, so you start seeing meaningful change fast.
                  </p>
                </div>

                {/* Coach Section */}
                <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-medium">Your Coach</h2>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
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
                      Stephen is a visionary leader and executive coach with a unique blend of global engineering leadership and 
                      profound expertise in human potential and organizational systems. He is dedicated to empowering 
                      individuals, teams, and entire organizations to "CREATE their best lives, do their best work, make the biggest 
                      positive impact and minimize their suffering along the way."
                    </p>
                  </div>
                </div>

                {/* Process and Intake Sections */}
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
                    asChild
                  >
                    <a 
                      href="https://scheduler.zoom.us/stephen-burke-nporpf/25mins_intro_stephen" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Schedule Your Intro Call
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

export default ExecutiveCoaching
