
import { Button } from "@/components/ui/button";
import { Briefcase, Sparkles } from "lucide-react";

export const OnboardingBanner = () => {
  const scrollToJobPreferences = () => {
    const element = document.getElementById('job-preferences-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Almost there! Let's set up your job preferences</h2>
              <p className="text-muted-foreground">
                Tell us what you're looking for so we can start preparing future opportunities for you.
              </p>
            </div>
          </div>
          <Button onClick={scrollToJobPreferences} className="gap-2 shadow-md">
            <Sparkles className="h-4 w-4" />
            Set Job Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
