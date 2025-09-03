
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
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
  Users,
  Award,
} from "lucide-react"
import { BlurImage } from "@/components/BlurImage"

const Branding = () => {
  const navigate = useNavigate()

  const coachingOfferings = [
    {
      id: 1,
      title: "Executive 1:1 Coaching",
      subtitle: "Perform Better. Relate Better. Feel Better.",
      description: "Personalized coaching to accelerate your leadership growth and well-being.",
      features: [
        "Tailored to your unique leadership context",
        "3-month engagement with up to 3 sessions per month",
        "Free, zero-commitment intro call to assess fit"
      ],
      icon: Users,
      imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      path: "/dashboard/executive-coaching"
    },
    {
      id: 2,
      title: "Leadership Team Coaching",
      subtitle: "Elevate Team Effectiveness and Outcomes",
      description: "Customized coaching to strengthen your leadership team's relationships, decision-making, and impact.",
      features: [
        "Designed around your team's meeting cadence",
        "Balances business priorities with deep relationship work",
        "Free, zero-commitment intro call and proposal"
      ],
      icon: Award,
      imageSrc: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      path: "/dashboard/team-coaching"
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-auto min-h-16 shrink-0 items-start gap-2 border-b px-2 sm:px-4 py-3 sm:py-4">
            <SidebarTrigger className="-ml-1 mt-1 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1 pr-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight break-words">
                Professional Coaching
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 leading-relaxed break-words">
                Master your leadership journey with trusted coaching partners
              </p>
            </div>
          </header>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-6">
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
                    {coachingOfferings.map((offering, index) => (
                      <Card
                        key={offering.id}
                        className={`overflow-hidden transition-all duration-300 hover:shadow-medium animate-slide-up bg-white border-0`}
                        style={{ animationDelay: `${index * 0.15}s` }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <BlurImage
                            src={offering.imageSrc}
                            alt={offering.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                              Paid Service
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-4">
                          <div className="flex items-start">
                            <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
                              <offering.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl font-medium mb-1">{offering.title}</CardTitle>
                              <p className="text-sm font-medium text-primary mb-3">{offering.subtitle}</p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 pb-4">
                          <CardDescription className="text-base mb-4">{offering.description}</CardDescription>
                          
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {offering.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <span className="text-primary mr-2 flex-shrink-0">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>

                        <CardFooter>
                          <Button 
                            variant="default" 
                            className="w-full rounded-full bg-primary hover:bg-primary/90"
                            onClick={() => navigate(offering.path)}
                          >
                            Learn More
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </StepCardContent>

                <StepCardFooter className="flex justify-start pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                    className="gap-2"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </StepCardFooter>
              </StepCard>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Branding
