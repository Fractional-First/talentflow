
import { StepCard } from "@/components/StepCard";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const JobPreferencesCard = () => {
  const navigate = useNavigate();

  return (
    <StepCard>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 p-6 flex flex-col items-center text-center border-r border-border/40">
          <div className="mb-4">
            <Briefcase className="h-12 w-12 text-primary/80 mb-2" />
            <div className="font-semibold text-lg">Job Preferences</div>
          </div>
        </div>
        <div className="md:w-3/4 p-6">
          <h3 className="text-lg font-semibold">Preferred Roles & Work Style</h3>
          <div className="text-muted-foreground mb-3 text-sm">
            Product Manager, Project Lead, Senior Product Owner
            <br />
            Configure more details such as compensation, availability, location, and industry preferences by viewing all job matching settings.
          </div>
          <Separator className="my-2" />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-sm flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Preferred Location
              </div>
              <div className="text-muted-foreground">San Francisco, Remote</div>
            </div>
            <div>
              <div className="font-medium text-sm flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Availability
              </div>
              <div className="text-muted-foreground">Full-time, Immediately</div>
            </div>
          </div>
          <div className="mt-5">
            <Button size="sm" variant="outline" onClick={() => navigate("/dashboard/job-matching")}>
              Show More Details
            </Button>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
