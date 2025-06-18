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
import { Step } from "@/components/OnboardingProgress"
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
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Star,
  Users,
  Award,
  BookOpen,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { BlurImage } from "@/components/BlurImage"

const Branding = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Include all steps in the dashboard view
  const steps: Step[] = [
    {
      id: 1,
      name: "Sign Up",
      description: "Create your account",
      status: "completed",
    },
    {
      id: 2,
      name: "Profile",
      description: "Enter your information",
      status: "completed",
    },
    {
      id: 3,
      name: "Profile Snapshot",
      description: "Review your profile",
      status: "completed",
    },
    {
      id: 4,
      name: "Agreement",
      description: "Sign legal documents",
      status: "completed",
    },
    {
      id: 5,
      name: "Branding",
      description: "Enhance your profile",
      status: "current",
    },
    {
      id: 6,
      name: "Job Matching",
      description: "Get matched to jobs",
      status: "upcoming",
    },
  ]

  const brandingTools = [
    {
      id: 1,
      title: "Personality Assessment",
      description:
        "Discover your work style, strengths, and ideal work environment with our comprehensive personality assessment.",
      icon: Users,
      free: true,
      imageSrc:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 2,
      title: "Skills Analysis",
      description:
        "Get insights on your skills and discover areas for improvement and development.",
      icon: Award,
      free: true,
      imageSrc:
        "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 3,
      title: "Career Coaching",
      description:
        "Connect with a career coach who will provide personalized guidance and feedback on your professional journey.",
      icon: Star,
      free: false,
      premium: true,
      imageSrc:
        "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 4,
      title: "Personal Branding Workshop",
      description:
        "Learn how to build and communicate your personal brand to stand out in the job market.",
      icon: BookOpen,
      free: false,
      imageSrc:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
    },
  ]

  const handleContinue = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/work-preferences")
    }, 1000)
  }

  const handleSkip = () => {
    navigate("/work-preferences")
  }

  return (
    <DashboardLayout steps={steps} currentStep={5}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <div className="flex items-center">
              <StepCardTitle>Enhance Your Professional Brand</StepCardTitle>
              <Badge variant="outline" className="ml-2">
                Optional
              </Badge>
            </div>
            <StepCardDescription>
              Take advantage of our tools to enhance your professional brand and
              increase your chances of finding the perfect match
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandingTools.map((tool, index) => (
                <Card
                  key={tool.id}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-medium animate-slide-up`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <BlurImage
                      src={tool.imageSrc}
                      alt={tool.title}
                      className="object-cover w-full h-full"
                    />
                    {tool.premium && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        Premium
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <tool.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                      </div>
                      {!tool.free && (
                        <div className="flex items-center text-muted-foreground">
                          <Lock className="h-4 w-4 mr-1" />
                          <span className="text-xs">Paid</span>
                        </div>
                      )}
                    </div>

                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>

                  <CardFooter>
                    <Button
                      variant={tool.free ? "default" : "outline"}
                      className="w-full"
                    >
                      {tool.free ? "Start Now" : "Upgrade to Access"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </StepCardContent>
        </StepCard>

        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Upgrade to Premium</StepCardTitle>
            <StepCardDescription>
              Get access to all branding tools and premium features to maximize
              your opportunities
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Premium Benefits</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unlock additional features and tools to enhance your
                    professional journey
                  </p>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-2" />
                      <span>Priority job matching and recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-2" />
                      <span>Access to exclusive career coaching sessions</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-2" />
                      <span>
                        Advanced personality and skills assessment tools
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-2" />
                      <span>Personal branding workshops and resources</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button className="w-full mt-2">Upgrade to Premium</Button>
            </div>
          </StepCardContent>

          <StepCardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/agreement")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="space-x-3">
              <Button variant="ghost" onClick={handleSkip}>
                Skip for Now
              </Button>

              <Button onClick={handleContinue} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  )
}

export default Branding
