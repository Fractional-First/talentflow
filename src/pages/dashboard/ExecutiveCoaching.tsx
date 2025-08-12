

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
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Clock, DollarSign, CheckCircle, Linkedin, ExternalLink } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const ExecutiveCoaching = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StepCard>
          <StepCardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <StepCardTitle className="text-3xl font-semibold">Executive 1:1 Coaching</StepCardTitle>
                <p className="text-xl text-primary font-medium mt-1">Perform Better. Relate Better. Feel Better.</p>
              </div>
            </div>
            
            <div className="relative h-64 overflow-hidden rounded-lg mb-6">
              <BlurImage
                src="/lovable-uploads/edd4d6e1-46b8-4b88-846b-10bda0d3dd83.png"
                alt="Executive 1:1 Coaching"
                className="object-cover w-full h-full"
              />
            </div>

            <StepCardDescription className="text-lg leading-relaxed">
              Personalized coaching to accelerate your leadership growth and well-being.
            </StepCardDescription>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <h4 className="font-medium text-primary mb-2">Tailored to your unique leadership context</h4>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-primary mb-2">3-month engagement with up to 3 sessions per month</h4>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-primary mb-2">Free, zero-commitment intro call to assess fit</h4>
              </div>
            </div>
          </StepCardHeader>

          <StepCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Process Section */}
              <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Process</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>3-month engagement, with up to 3 sessions per month (50 minutes each via phone or Zoom/Teams/Google Meet)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>Support between sessions via message, email, or brief calls as needed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>Coaching designed around your unique context and goals</span>
                  </li>
                </ul>
              </div>

              {/* Investment Section */}
              <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Investment</h3>
                </div>
                <div className="text-2xl font-bold text-primary mb-2">$8,000</div>
                <p className="text-muted-foreground">50% at the start, 50% at midpoint.</p>
              </div>
            </div>

            {/* Intake Process Section */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">Intake Process (Complimentary)</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-4 mt-1">1</Badge>
                  <div>
                    <h4 className="font-medium">Intro Call (30 mins)</h4>
                    <p className="text-muted-foreground">Get to know each other.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-4 mt-1">2</Badge>
                  <div>
                    <h4 className="font-medium">Discovery Call (50 mins)</h4>
                    <p className="text-muted-foreground">Clarify your objectives.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-4 mt-1">3</Badge>
                  <div>
                    <h4 className="font-medium">Coaching Session (75 mins)</h4>
                    <p className="text-muted-foreground">Experience the insights, shifts, and outcomes coaching can unlock.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-background/80 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  At the end of intake, we'll decide together whether to proceed. You may choose to stop after the intro and discovery calls if it's not the right fit. I only work with clients who demonstrate a high level of commitment during intake.
                </p>
              </div>
            </div>

            {/* Coach Profile Section */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">Your Coach</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <BlurImage
                    src="/lovable-uploads/ad669935-8bce-40c6-810e-e417c08e6be3.png"
                    alt="Stephen Burke"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium">Stephen Burke</h4>
                  <p className="text-muted-foreground">Executive & Leadership Coach</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <a 
                    href="https://www.linkedin.com/in/stephenburkehi/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-lg">
                → Schedule Your Intro Call
              </Button>
            </div>
          </StepCardContent>

          <StepCardFooter className="flex justify-start pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/branding")}
              className="rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Coaching Options
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  )
}

export default ExecutiveCoaching

