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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Briefcase,
  Building,
  Clock,
  Edit,
  Bell,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const WaitingRoom = () => {
  const navigate = useNavigate()

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
      status: "completed",
    },
    {
      id: 6,
      name: "Job Matching",
      description: "Get matched to jobs",
      status: "completed",
    },
  ]

  // Mock job applications
  const jobApplications = [
    {
      id: 1,
      title: "Senior Product Manager",
      company: "TechCorp Inc.",
      status: "In Review",
      progress: 40,
      appliedDate: "2023-06-10",
      nextStep: "Waiting for hiring manager review",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateSoft",
      status: "Interview Scheduled",
      progress: 70,
      appliedDate: "2023-06-08",
      nextStep: "Video interview on June 15, 2023",
    },
    {
      id: 3,
      title: "Technical Product Manager",
      company: "GlobalTech Solutions",
      status: "Application Submitted",
      progress: 20,
      appliedDate: "2023-06-12",
      nextStep: "Initial screening",
    },
  ]

  // Mock saved jobs
  const savedJobs = [
    {
      id: 4,
      title: "Product Manager - AI Initiatives",
      company: "Future AI",
      savedDate: "2023-06-05",
    },
    {
      id: 5,
      title: "Senior Product Manager - Fintech",
      company: "FinovateBank",
      savedDate: "2023-06-07",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Review":
        return "bg-blue-500"
      case "Interview Scheduled":
        return "bg-green-500"
      case "Application Submitted":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout steps={steps} currentStep={6}>
      <div className="space-y-6">
        <StepCard>
          <StepCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <StepCardTitle>Talent Waiting Room</StepCardTitle>
                  <Badge className="ml-2 bg-primary animate-pulse-soft">
                    Actively Looking
                  </Badge>
                </div>
                <StepCardDescription>
                  Track your job applications and continue exploring
                  opportunities
                </StepCardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/edit-profile")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </StepCardHeader>

          <StepCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="glassmorphism transition-all duration-300 hover:shadow-glass-hover animate-scale-in">
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Briefcase className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Applications</h3>
                  </div>
                  <div className="text-3xl font-medium">
                    {jobApplications.length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active applications
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glassmorphism transition-all duration-300 hover:shadow-glass-hover animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Bell className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Interviews</h3>
                  </div>
                  <div className="text-3xl font-medium">1</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upcoming interviews
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glassmorphism transition-all duration-300 hover:shadow-glass-hover animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Saved Jobs</h3>
                  </div>
                  <div className="text-3xl font-medium">{savedJobs.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Jobs for later
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="applications">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="applications" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Applications
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved Jobs
                </TabsTrigger>
                <TabsTrigger value="explore" className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Explore
                </TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Your Applications</h3>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                </div>

                {jobApplications.map((job) => (
                  <Card
                    key={job.id}
                    className="overflow-hidden animate-slide-up"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{job.title}</h3>
                          <p className="text-muted-foreground flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1" />
                            {job.company}
                          </p>
                        </div>

                        <Badge
                          className={`${getStatusColor(job.status)} text-white`}
                        >
                          {job.status}
                        </Badge>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Application Progress</span>
                          <span className="text-sm font-medium">
                            {job.progress}%
                          </span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>

                      <div className="mt-4 flex justify-between items-center text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Applied on {job.appliedDate}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          View Details
                        </Button>
                      </div>

                      <Separator className="my-4" />

                      <div className="text-sm">
                        <span className="font-medium">Next Step:</span>{" "}
                        {job.nextStep}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Saved Jobs</h3>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                </div>

                {savedJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="overflow-hidden animate-slide-up"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{job.title}</h3>
                          <p className="text-muted-foreground flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1" />
                            {job.company}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Saved on {job.savedDate}
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                          >
                            View Details
                          </Button>
                          <Button size="sm" className="h-7 text-xs">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="explore" className="space-y-4">
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">
                    Explore New Opportunities
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Discover new job opportunities that match your skills,
                    experience, and preferences.
                  </p>
                  <Button onClick={() => navigate("/work-preferences")}>
                    Search Jobs
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </StepCardContent>
        </StepCard>

        <StepCard>
          <StepCardHeader>
            <StepCardTitle>Your Talent Support Team</StepCardTitle>
            <StepCardDescription>
              Your dedicated support team is here to help you throughout your
              job search journey
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg border animate-fade-in">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Jane Davis</p>
                  <p className="text-sm text-muted-foreground">
                    Talent Success Manager
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Schedule a Call
                  </Button>
                </div>
              </div>

              <div
                className="flex items-center space-x-4 p-4 rounded-lg border animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    MS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Michael Smith</p>
                  <p className="text-sm text-muted-foreground">
                    Recruiter Specialist
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </StepCardContent>

          <StepCardFooter className="flex justify-start pt-6">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </StepCardFooter>
        </StepCard>
      </div>
    </DashboardLayout>
  )
}

export default WaitingRoom
