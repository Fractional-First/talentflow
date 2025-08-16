
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle, Users } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

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

  const intakeSteps = [
    {
      title: "Intro Call (30 mins)",
      description: "with the leader/sponsor to outline context and desired outcomes",
      completed: true
    },
    {
      title: "Discovery Call (50 mins)",
      description: "to explore possibilities (additional participants may join) — with quick wins often emerging here",
      completed: true
    },
    {
      title: "A Proposal",
      description: "tailored to your needs and context",
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
            <p className="text-xl text-primary font-medium">Improve Team Effectiveness, Fulfilment, and Results.</p>
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
              Every leadership team is its own relationship system — with a unique character, strengths, and challenges. 
              All teams aspire to deliver exceptional results. But truly great teams go further: they create an environment 
              of deep trust, honest dialogue, commitment, and alignment.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This engagement is about achieving both — operational excellence and the most rewarding team experience 
              you've ever had — all in the flow of your real work together.
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

export default TeamCoaching
