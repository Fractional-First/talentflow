
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900">Professional Coaching</h1>
            </div>
          </header>
          <div className="flex-1">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-semibold">Professional Coaching With Trusted Partners</h2>
                    <Badge variant="outline" className="text-sm px-3 py-1 rounded-full">
                      Optional
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-4xl">
                    Whether you're charting your path as a fractional leader or guiding a client team through change, coaching with trusted Fractional First partners helps you sharpen your leadership, sustain impact across multiple engagements, and navigate your journey with clarity, alignment, and effectiveness.
                  </p>
                </div>

                {/* Coaching By Section */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Coaching by:</h3>
                  <p className="text-base text-muted-foreground">
                    Our trusted coaching partners bring decades of leadership experience and proven methodologies to support your growth.
                  </p>
                </div>

                {/* Coaching Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {coachingOfferings.map((offering, index) => (
                    <Card
                      key={offering.id}
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-200"
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
                          className="w-full"
                          onClick={() => navigate(offering.path)}
                        >
                          Learn More
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Back Navigation */}
                <div className="flex justify-start pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
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

export default Branding
