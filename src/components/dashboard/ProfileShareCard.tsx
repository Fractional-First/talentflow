import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useGetUser } from "@/queries/auth/useGetUser"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function ProfileShareCard() {
  const { toast } = useToast()
  const { data: user } = useGetUser()

  const { data: profileSlug } = useQuery({
    queryKey: ["profile-slug", user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from("profiles")
        .select("profile_slug")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching profile slug:", error)
        return null
      }

      return data?.profile_slug
    },
    enabled: !!user?.id,
  })

  const profileUrl = profileSlug 
    ? `${window.location.origin}/profile/${profileSlug}`
    : ""

  const copyToClipboard = async () => {
    if (!profileUrl) return

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast({
        title: "Link copied!",
        description: "Your profile link has been copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const openProfile = () => {
    if (profileUrl) {
      window.open(profileUrl, "_blank")
    }
  }

  if (!profileSlug) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Share Your Profile</CardTitle>
          <CardDescription>
            Your profile link will be available once your profile is generated.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Profile</CardTitle>
        <CardDescription>
          Share your public profile with potential clients and employers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            value={profileUrl} 
            readOnly 
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={copyToClipboard}
            title="Copy link"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={openProfile}
            title="Open profile"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}