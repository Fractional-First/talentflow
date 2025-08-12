import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StepCard, StepCardContent, StepCardDescription, StepCardFooter, StepCardHeader, StepCardTitle } from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, UsersRound } from "lucide-react";
import { BlurImage } from "@/components/BlurImage";
const Branding = () => {
  const navigate = useNavigate();
  const coachingServices = [{
    id: 1,
    title: "Executive 1:1 Coaching",
    subheadline: "Perform Better. Relate Better. Feel Better.",
    description: "Personalized coaching to accelerate your leadership growth and well-being.",
    bulletPoints: ["Tailored to your unique leadership context", "3-month engagement with up to 3 sessions per month", "Free, zero-commitment intro call to assess fit"],
    icon: User,
    ctaText: "Learn More",
    path: "/dashboard/branding/executive-coaching",
    imageSrc: "/lovable-uploads/edd4d6e1-46b8-4b88-846b-10bda0d3dd83.png"
  }, {
    id: 2,
    title: "Leadership Team Coaching",
    subheadline: "Elevate Team Effectiveness and Outcomes",
    description: "Customized coaching to strengthen your leadership team's relationships, decision-making, and impact.",
    bulletPoints: ["Designed around your team's meeting cadence", "Balances business priorities with deep relationship work", "Free, zero-commitment intro call and proposal"],
    icon: UsersRound,
    ctaText: "Learn More",
    path: "/dashboard/branding/team-coaching",
    imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
  }];
  return <DashboardLayout>
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
              Whether you're leading solo or as a team, master your leadership journey with greater clarity, alignment, and effectiveness.
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coachingServices.map((service, index) => <Card key={service.id} className={`overflow-hidden transition-all duration-300 hover:shadow-medium animate-slide-up border-2 border-primary/10 bg-primary/2 flex flex-col h-full`} style={{
              animationDelay: `${index * 0.15}s`
            }}>
                  <div className="relative h-40 overflow-hidden">
                    <BlurImage src={service.imageSrc} alt={service.title} className="object-cover w-full h-full" />
                    <Badge className="absolute top-2 right-2 bg-primary rounded-full">
                      Paid Service
                    </Badge>
                  </div>

                  <CardHeader className="pb-2 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-medium">{service.title}</CardTitle>
                          <p className="text-sm font-medium text-primary mt-1">{service.subheadline}</p>
                        </div>
                      </div>
                    </div>

                    <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                    
                    <div className="mt-3">
                      <ul className="space-y-1">
                        {service.bulletPoints.map((point, bulletIndex) => <li key={bulletIndex} className="flex items-center text-sm text-muted-foreground">
                            <span className="text-primary mr-2 leading-none">•</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>)}
                      </ul>
                    </div>
                  </CardHeader>

                  <CardFooter className="mt-auto">
                    <Button variant="default" className="w-full rounded-full" onClick={() => navigate(service.path)}>
                      {service.ctaText}
                    </Button>
                  </CardFooter>
                </Card>)}
            </div>
            
            <div className="mt-6 text-center">
              
            </div>
          </StepCardContent>

          <StepCardFooter className="flex justify-start pt-6">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>;
};
export default Branding;