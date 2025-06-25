import { AuthBackground } from "@/components/auth/AuthBackground"
import {
  StepCard,
  StepCardContent,
  StepCardDescription,
  StepCardFooter,
  StepCardHeader,
  StepCardTitle,
} from "@/components/StepCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "@/queries/auth/useGetUser"
import { useSignIn } from "@/queries/auth/useSignIn"
import { Linkedin } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Login = () => {
  const navigate = useNavigate()
  const { signIn, loading } = useSignIn()
  const { data: user } = useGetUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLinkedInSubmitting, setIsLinkedInSubmitting] = useState(false)

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  const handleLinkedInLogin = async () => {
    try {
      setIsLinkedInSubmitting(true)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        toast.error("Failed to sign in with LinkedIn")
        console.error("LinkedIn OAuth error:", error)
      }
    } catch (error) {
      toast.error("Failed to sign in with LinkedIn")
      console.error("LinkedIn OAuth error:", error)
    } finally {
      setIsLinkedInSubmitting(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      toast.success("Successfully logged in!")
      navigate("/dashboard")
    } catch (error: any) {
      if (error.code === "email_not_confirmed") {
        navigate("/check-email?email=" + email)
      }
      toast.error(error.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <div className="w-full max-w-md">
        <StepCard>
          <StepCardHeader>
            <div className="text-center mb-2">
              <div
                className="inline-block cursor-pointer"
                onClick={() => navigate("/")}
              >
                <span className="text-2xl font-semibold">TalentFlow</span>
              </div>
            </div>
            <StepCardTitle className="text-center">
              Welcome to TalentFlow
            </StepCardTitle>
            <StepCardDescription className="text-center">
              The easiest way to find your next opportunity
            </StepCardDescription>
          </StepCardHeader>

          <StepCardContent className="space-y-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLinkedInLogin}
              disabled={isLinkedInSubmitting || loading}
            >
              <Linkedin className="h-5 w-5" />
              <span>
                {isLinkedInSubmitting
                  ? "Connecting..."
                  : "Continue with LinkedIn"}
              </span>
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => navigate("/forgot-password")}
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </StepCardContent>

          <StepCardFooter className="justify-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </span>
          </StepCardFooter>
        </StepCard>
      </div>
    </div>
  )
}

export default Login
