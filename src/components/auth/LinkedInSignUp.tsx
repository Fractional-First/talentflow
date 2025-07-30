import { Button } from "@/components/ui/button"
import { Linkedin } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface LinkedInSignUpProps {
  onClick?: () => void
  isSubmitting: boolean
}

export const LinkedInSignUp = ({
  onClick,
  isSubmitting,
}: LinkedInSignUpProps) => {
  const handleLinkedInSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error("Failed to sign up with LinkedIn")
        console.error("LinkedIn OAuth error:", error)
      }
    } catch (error) {
      toast.error("Failed to sign up with LinkedIn")
      console.error("LinkedIn OAuth error:", error)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick || handleLinkedInSignUp}
      disabled={isSubmitting}
    >
      <Linkedin className="h-5 w-5" />
      <span>Sign up with LinkedIn</span>
    </Button>
  )
}
