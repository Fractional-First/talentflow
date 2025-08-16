
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, Users } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const TeamCoaching = () => {
  const navigate = useNavigate()

  const processSteps = [
    {
      text: "Designed around your team's meeting cadence and business priorities",
      completed: true
    },
    {
      text: "Balances strategic business outcomes with deep relationship work",
      completed: true
    },
    {
      text: "Customized approach based on your team's unique dynamics and goals",
      completed: true
    }
  ]

  const intakeSteps = [
    {
      title: "Discovery Call (60 mins)",
      description: "to understand your team's context and challenges",
      completed: true
    },
    {
      title: "Team Assessment",
      description: "to identify strengths and growth opportunities",
      completed: true
    },
    {
      title: "Custom Proposal",
      description: "tailored to your team's specific needs and timeline",
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
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-semibold">Leadership Team Coaching</h1>
            </div>
            <p className="text-xl text-primary font-medium">Elevate Team Effectiveness and Outcomes</p>
          </div>

          {/* Hero Image */}
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <BlurImage
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              alt="Team Coaching"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-6 text-left max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Leadership teams are the engine of organizational success. When your leadership team operates with 
              clarity, alignment, and trust, the entire organization benefits. When there's dysfunction, confusion, 
              or misalignment at the top, it cascades throughout the company.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our Leadership Team Coaching strengthens your team's relationships, decision-making processes, and 
              collective impact. We work with your existing meeting rhythms and business priorities to create 
              sustainable change that drives results.
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
                <h2 className="text-xl font-medium">Getting Started (Complimentary)</h2>
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
              <Users className="h-5 w-5 text-muted-foreground" />
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
                Stephen brings deep experience in organizational systems and team dynamics. His background in 
                global engineering leadership combined with expertise in human potential makes him uniquely 
                qualified to help leadership teams navigate complex challenges while building stronger relationships 
                and achieving better outcomes.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full">
              Schedule Your Discovery Call
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

export default TeamCoaching
