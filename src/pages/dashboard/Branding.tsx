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
  ArrowLeft,
  Sparkles,
  Lock,
  Star,
  Users,
  Award,
  BookOpen,
} from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const Branding = () => {
  const navigate = useNavigate()

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StepCard>
          <StepCardHeader>
            <div className="flex items-center gap-3">
              <StepCardTitle className="text-3xl font-semibold">Professional Coaching With Trusted Partners</StepCardTitle>
              <Badge variant="outline" className="text-sm px-3 py-1 rounded-full">
                Optional
              </Badge>
            </div>
            <StepCardDescription className="text-lg mt-3 text-muted-foreground">
              Whether you're leading solo or as a team, master your leadership journey with clarity, alignment, and effectiveness through coaching offerings delivered by trusted partners of Fractional First.
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
                      <Badge className="absolute top-2 right-2 bg-primary rounded-full">
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
                        <CardTitle className="text-xl font-medium">{tool.title}</CardTitle>
                      </div>
                      {!tool.free && (
                        <div className="flex items-center text-muted-foreground">
                          <Lock className="h-4 w-4 mr-1" />
                          <span className="text-xs">Paid</span>
                        </div>
                      )}
                    </div>

                    <CardDescription className="text-base mt-2">{tool.description}</CardDescription>
                  </CardHeader>

                  <CardFooter>
                    <Button
                      variant={tool.free ? "default" : "outline"}
                      className="w-full rounded-full"
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
            <StepCardTitle className="text-2xl font-medium">Upgrade to Premium</StepCardTitle>
            <StepCardDescription className="text-base mt-2">
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
                  <h3 className="text-xl font-medium mb-2">Premium Benefits</h3>
                  <p className="text-base text-muted-foreground mb-4">
                    Unlock additional features and tools to enhance your
                    professional journey
                  </p>

                  <ul className="space-y-3 text-base">
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span>Priority job matching and recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span>Access to exclusive career coaching sessions</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span>Advanced personality and skills assessment tools</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span>Personal branding workshops and resources</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button className="w-full mt-4 rounded-full">Upgrade to Premium</Button>
            </div>
          </StepCardContent>

          <StepCardFooter className="flex justify-start pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  )
}

export default Branding
