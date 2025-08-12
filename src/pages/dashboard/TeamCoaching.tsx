
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
import { ArrowLeft, UsersRound, Clock, CheckCircle, Linkedin, ExternalLink, User } from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const TeamCoaching = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StepCard>
          <StepCardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UsersRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <StepCardTitle className="text-3xl font-semibold">Leadership Team Coaching</StepCardTitle>
                <p className="text-xl text-primary font-medium mt-1">Improve Team Effectiveness, Fulfilment, and Results.</p>
              </div>
            </div>
            
            <div className="relative h-64 overflow-hidden rounded-lg mb-6">
              <BlurImage
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="Leadership Team Coaching"
                className="object-cover w-full h-full"
              />
            </div>

            <StepCardDescription className="text-lg leading-relaxed">
              Every leadership team is its own relationship system — with a unique character, strengths, and challenges. All teams aspire to deliver exceptional results. But truly great teams go further: they create an environment of deep trust, honest dialogue, commitment, and alignment.
            </StepCardDescription>
            
            <StepCardDescription className="text-lg leading-relaxed mt-4">
              This engagement is about achieving both — operational excellence and the most rewarding team experience you've ever had — all in the flow of your real work together.
            </StepCardDescription>
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
                    <span>Engagement designed with you to fit your team's meeting rhythm and work patterns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>Focus on both business outcomes and relationship quality</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>Practical, in-the-moment work on your most pressing challenges and opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>Develop habits of clear communication, genuine alignment, and effective decision-making</span>
                  </li>
                </ul>
              </div>

              {/* Coach Profile Section */}
              <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Your Coach</h3>
                </div>
                <div className="flex items-start gap-4 mb-4">
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
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Stephen is a visionary leader and executive coach with a unique blend of global engineering leadership and profound expertise in human potential and organizational systems. He is dedicated to empowering individuals, teams, and entire organizations to "CREATE their best lives, do their best work, make the biggest positive impact and minimize their suffering along the way."
                </p>
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
                    View Stephen's Profile
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

export default TeamCoaching
