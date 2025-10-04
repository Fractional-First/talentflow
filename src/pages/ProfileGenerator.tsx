import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Target,
  Shield,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useGetOnboardingStatus } from "@/queries/getOnboardingStatus"

const ProfileGenerator = () => {
  const navigate = useNavigate()
  const { user } = useGetOnboardingStatus()

  // Redirect authenticated users to create-profile
  useEffect(() => {
    if (user) {
      navigate("/create-profile", { replace: true })
    }
  }, [user, navigate])

  const backgroundEffect = (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[30%] -right-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-[30%] -left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
    </div>
  )

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Elevated Profile",
      description:
        "Leaders deserve an effective platform to showcase their superpowers in a concise, easy-to-use manner. Generate your Leadership Profile, make it yours, and share it with the world.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Generate your professional Leadership Profile in under 1 minute using your LinkedIn profile link.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "AI-Powered Services",
      description:
        "If you're open to new opportunities, get matched with fractional opportunities that align with your purpose and expertise. If you're not, simply keep and maintain your profile. It's yours!",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leadership Network",
      description:
        "Join a community of top-tier fractional leaders, operators, and advisors and benefit from Fractional First and partner programs as soon as they become available.",
    },
  ]

  const benefits = [
    "No signup required to see your profile",
    "Preview your Leadership Profile before committing to publish it or signing up",
    "opportunity-matching",
    "Join 500+ fractional executives already on the platform",
  ]

  return (
    <div className="min-h-screen w-full flex flex-col">
      {backgroundEffect}

      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png"
              alt="Fractional First"
              className="h-10 sm:h-12 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
              className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[44px] px-3 sm:px-4"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 text-sm">
              Try Before You Sign Up
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-urbanist mb-6">
              Generate Your
              <span className="text-primary block">Leadership Profile</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Create and share your Fractional First Leadership Profile in less than a minute. No signup required. No gimmicks. Experience the value of a well articulated, personalized Leadership Profile.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/profile-generator/create")}
              className="min-h-[56px] px-8 text-lg font-urbanist"
            >
              Generate My Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-2 hover:border-primary/20 transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-urbanist">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-urbanist mb-6">
                Why Generate Your Profile First?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted/40 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-semibold font-urbanist mb-4">
                What You'll Get
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                 <li className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                   <span>A Leadership Profile extracted from your LinkedIn</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                   <span>Skills and expertise automatically categorized</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                   <span>Industry and role preferences identified</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                   <span>Preview of your experience and superpowers</span>
                 </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-urbanist mb-4">
              Ready to See Your Profile?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              It takes less than a minute to generate your professional profile. No commitment required — just enter your LinkedIn URL and watch the magic happen.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/profile-generator/create")}
              className="min-h-[56px] px-8 text-lg font-urbanist"
            >
              Start Generating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border/40 py-4 sm:py-6 mt-8 sm:mt-10">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Fractional First. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ProfileGenerator
