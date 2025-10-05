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
  Eye,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Compass,
  Star,
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
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Generate your professional Leadership Profile in under 1 minute using your LinkedIn profile link.",
      benefit: "Save time with instant profile creation"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Elevated Profile",
      description: (
        <>
          Leaders deserve an effective platform to showcase their superpowers in a concise, easy-to-use manner.
          <br /><br />
          Generate your Leadership Profile, make it yours, and share it with the world.
        </>
      ),
      benefit: "Stand out with a professional presence"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "AI-Powered Services",
      description: (
        <>
          If you're open to new opportunities, get matched with fractional opportunities that align with your purpose and expertise.
          <br /><br />
          If you're not, simply keep and maintain your profile. It's yours!
        </>
      ),
      benefit: "Get matched with relevant opportunities"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leadership Network",
      description:
        "Join a community of top-tier fractional leaders, operators, and advisors and benefit from Fractional First and partner programs as soon as they become available.",
      benefit: "Connect with 500+ executive leaders"
    },
  ]

  const advantages = [
    "No signup required to see your profile",
    "Preview your Leadership Profile before committing to publish it or signing up",
    "Instant access to our opportunity-matching algorithm",
    "Join 500+ fractional executives already on the platform",
  ]

  const whatYouGet = [
    {
      icon: <Award className="h-5 w-5" />,
      text: "A Leadership Profile extracted from your LinkedIn"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      text: "Skills and expertise automatically categorized"
    },
    {
      icon: <Compass className="h-5 w-5" />,
      text: "Industry and role preferences identified"
    },
    {
      icon: <Star className="h-5 w-5" />,
      text: "Preview of your experience and superpowers"
    },
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
          <div className="text-center mb-16 sm:mb-20">
            <p className="mb-5 text-sm font-semibold text-primary tracking-wide uppercase">
              Try Before You Sign Up
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-urbanist mb-6 leading-tight">
              Generate Your
              <span className="text-primary block mt-2">Leadership Profile</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Create and share your Fractional First Leadership Profile in less than a minute. No signup. No gimmicks. Generate your personalized Leadership Profile from your LinkedIn URL and preview it before publishing or signing up.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/profile-generator/create")}
              className="min-h-[60px] px-10 text-lg font-urbanist shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              Generate Your Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border hover:border-primary/30 transition-all duration-300 hover:shadow-soft bg-muted/30"
              >
                <CardHeader className="pb-3">
                  <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 transition-transform duration-300 hover:scale-110">
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
          <div className="bg-muted/20 rounded-2xl p-8 sm:p-10 lg:p-12 mb-16 sm:mb-20 border border-border/50">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold font-urbanist mb-10 lg:mb-12 text-center">
              Why Generate Your Profile First?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-card rounded-xl p-6 sm:p-8 shadow-soft border border-primary/20">
                <h3 className="text-xl sm:text-2xl font-semibold font-urbanist mb-6 text-primary">
                  Advantages
                </h3>
                <ul className="space-y-4">
                  {advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80 leading-relaxed">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-xl p-6 sm:p-8 shadow-soft border border-primary/20">
                <h3 className="text-xl sm:text-2xl font-semibold font-urbanist mb-6 text-primary">
                  What You'll Get
                </h3>
                <ul className="space-y-4">
                  {whatYouGet.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-foreground/80 leading-relaxed pt-1.5">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 rounded-2xl p-10 sm:p-14 shadow-soft border border-primary/10">
            <h2 className="text-3xl sm:text-4xl font-bold font-urbanist mb-5">
              Ready to See Your Profile?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              It takes less than a minute to generate your professional profile. No commitment required — just enter your LinkedIn URL and watch the magic happen.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/profile-generator/create")}
              className="min-h-[60px] px-10 text-lg font-urbanist shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
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
