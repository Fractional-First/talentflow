
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
import { ArrowLeft, User, Clock, CheckCircle, ExternalLink, FileText } from "lucide-react"
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
                <StepCardTitle className="text-3xl font-semibold">Executive / Founder 1:1 Coaching</StepCardTitle>
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
              Every leader operates in a unique context — shaped by your life experiences, skills, interests, challenges, and triggers. You are unlike anyone else. And yet, you share the universal drive of all leaders: to perform better, relate better, and feel better in both work and life.
            </StepCardDescription>
            
            <StepCardDescription className="text-lg leading-relaxed mt-4">
              In 1:1 Coaching, we focus entirely on you and your access to these outcomes. We work quickly and directly, so you start seeing meaningful change fast.
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

              {/* Intake Process Section */}
              <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Intake Process</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>30-minute complimentary intro call to explore fit and answer questions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>90-minute intake session to establish context, goals, and coaching approach</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>Simple assessment tools to understand your strengths and growth edges</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Coach Profile Section */}
            <div className="bg-background/50 border border-border/50 rounded-lg p-6 mt-8">
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
                  View Stephen's Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-lg">
                Schedule Your Intro Call
              </Button>
              <p className="text-sm text-muted-foreground mt-2">30-minute intro call is complimentary</p>
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
