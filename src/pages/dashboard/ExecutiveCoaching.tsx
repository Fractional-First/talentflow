
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, User } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const ExecutiveCoaching = () => {
  const navigate = useNavigate()

  const processSteps = [
    {
      text: "3-month engagement, with up to 3 sessions per month (90 minutes each via phone or Zoom/Teams/Google Meet)",
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

  const intakeSteps = [
    {
      title: "Intro Call (30 mins)",
      description: "to get acquainted",
      completed: true
    },
    {
      title: "Discovery Call (90 mins)",
      description: "to clarify your objectives",
      completed: true
    },
    {
      title: "Coaching Session (75 mins)",
      description: "to experience the insights, shifts, and outcomes possible",
      completed: true
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-8">
          {/* Header Section */}
          <div className="text-left space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-semibold">Executive 1:1 Coaching</h1>
            </div>
            <p className="text-xl text-primary font-medium">Perform Better. Relate Better. Feel Better.</p>
          </div>

          {/* Hero Image */}
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <BlurImage
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              alt="Executive Coaching"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-6 text-left max-w-3xl">
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

          {/* Process and Intake Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Process Section */}
            <div className="space-y-6 text-left bg-muted/30 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-medium">Process</h2>
              </div>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Intake Section */}
            <div className="space-y-6 text-left bg-muted/30 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-medium">Intake (Complimentary)</h2>
              </div>
              <div className="space-y-4">
                {intakeSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coach Section */}
          <div className="space-y-6 bg-muted/30 rounded-2xl p-8 border border-border">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-medium">Your Coach</h2>
            </div>
            
            <div className="flex items-start gap-6 text-left">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <BlurImage
                  src="/lovable-uploads/ea353678-088b-4c2c-a98b-4d40f6668684.png"
                  alt="Stephen Burke"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium">Stephen Burke</h3>
                  <p className="text-sm text-muted-foreground">Executive & Leadership Coach</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  View Stephen's Profile
                </Button>
              </div>
            </div>
            
            {/* Stephen's Description - moved to new row */}
            <div className="text-left">
              <p className="text-muted-foreground leading-relaxed">
                Stephen is a visionary leader and executive coach with a unique blend of global engineering leadership and 
                profound expertise in human potential and organizational systems. He is dedicated to empowering 
                individuals, teams, and entire organizations to "CREATE their best lives, do their best work, make the biggest 
                positive impact and minimize their suffering along the way."
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full">
              Schedule Your Intro Call
            </Button>
          </div>

          {/* Back Button */}
          <div className="flex justify-start">
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
    </DashboardLayout>
  )
}

export default ExecutiveCoaching
