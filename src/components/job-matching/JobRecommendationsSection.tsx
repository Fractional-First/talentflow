
import { Sparkles, Building, MapPin, DollarSign, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StepCard, StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  remote: boolean;
  newMatch?: boolean;
}

interface JobRecommendationsSectionProps {
  recommendedJobs: Job[];
}

const JobRecommendationsSection = ({ recommendedJobs }: JobRecommendationsSectionProps) => {
  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>AI-Powered Job Recommendations</StepCardTitle>
        <StepCardDescription>
          Based on your profile and preferences, we've found these matching opportunities for you
        </StepCardDescription>
      </StepCardHeader>
      
      <StepCardContent>
        <div className="space-y-4">
          {recommendedJobs.map((job, index) => (
            <Card 
              key={job.id} 
              className="transition-all duration-300 hover:shadow-medium animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {job.newMatch && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-md bg-primary">New Match</Badge>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building className="h-3.5 w-3.5 mr-1" />
                      {job.company}
                      <span className="mx-2">•</span>
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {job.location}
                      {job.remote && <Badge variant="outline" className="ml-2 text-xs py-0">Remote</Badge>}
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Sparkles className="h-4 w-4 text-primary mr-1" />
                      <span className="font-medium">{job.matchScore}% Match</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5 inline-block" />
                      {job.salary}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${job.matchScore}%` }}
                  ></div>
                </div>
                
                <p className="text-sm">
                  You match {job.matchScore}% of the requirements for this position based on your skills and experience.
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                    Not Interested
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Flag className="h-3.5 w-3.5 mr-1" />
                    Save for Later
                  </Button>
                </div>
                
                <Button size="sm" className="h-8">
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                  Interested
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </StepCardContent>
    </StepCard>
  );
};

export default JobRecommendationsSection;
