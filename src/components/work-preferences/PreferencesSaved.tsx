
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const PreferencesSaved = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-4 text-center">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Success!</h2>
        <p className="text-muted-foreground mt-1">
          Your job preferences have been saved. We'll use these to find the best opportunities for you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 mt-4">
        <Button onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>

        <div className="text-sm text-muted-foreground sm:ml-4">
          Want to stand out?{" "}
          <button
            className="text-primary underline underline-offset-2"
            onClick={() => navigate("/branding")}
          >
            Explore personal branding options →
          </button>
        </div>
      </div>
    </div>
  )
}
