import { useState } from 'react';
import { AlertCircle, Building, MapPin, Sparkles, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StepCardContent, StepCardDescription, StepCardHeader, StepCardTitle } from '@/components/StepCard';
import { StepCard } from '@/components/StepCard';
import { toast } from "@/hooks/use-toast";

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

interface JobRankingSectionProps {
  recommendedJobs: Job[];
  jobRankings: {[key: number]: number | null};
  setJobRankings: React.Dispatch<React.SetStateAction<{[key: number]: number | null}>>;
}

const JobRankingSection = ({
  recommendedJobs,
  jobRankings,
  setJobRankings
}: JobRankingSectionProps) => {
  const allJobsRanked = Object.values(jobRankings).every(rank => rank !== null);

  const handleJobRanking = (jobId: number, rank: number) => {
    const jobWithThisRank = Object.entries(jobRankings).find(
      ([id, currentRank]) => currentRank === rank && Number(id) !== jobId
    );
    
    const newRankings = { ...jobRankings };
    
    if (jobWithThisRank) {
      const [otherId] = jobWithThisRank;
      newRankings[Number(otherId)] = jobRankings[jobId] || null;
    }
    
    newRankings[jobId] = rank;
    
    setJobRankings(newRankings);
    
    if (Object.values(newRankings).every(r => r !== null) && 
        Object.values(jobRankings).some(r => r === null)) {
      toast("Ranking Complete!", {
        description: "Thank you for ranking all job opportunities. Your preferences have been recorded."
      });
    }
  };

  return (
    <StepCard>
      <StepCardHeader>
        <StepCardTitle>Job Ranking Simulator</StepCardTitle>
        <StepCardDescription>
          Rank these job opportunities from 1 (most preferred) to 4 (least preferred) to help us understand your preferences
        </StepCardDescription>
      </StepCardHeader>
      
      <StepCardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Preference Analysis</AlertTitle>
          <AlertDescription>
            Your rankings help our AI understand your detailed preferences and improve job matching accuracy.
          </AlertDescription>
        </Alert>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Rank these opportunities based on your interest (1 = most interested)</h3>
            {allJobsRanked ? (
              <Badge variant="success">Ranking Complete</Badge>
            ) : (
              <Badge variant="outline">Ranking Incomplete</Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {recommendedJobs.map((job) => (
              <Card 
                key={job.id} 
                className={`border-2 transition-all duration-300 hover:shadow-md ${
                  jobRankings[job.id] !== null ? 'border-primary/50' : 'border-transparent'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-grow p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {job.company}
                          <span className="mx-2">•</span>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 text-primary mr-1" />
                          <span className="font-medium">{job.matchScore}% Match</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <DollarSign className="h-3.5 w-3.5 mr-1" />
                          {job.salary}
                        </p>
                      </div>
                    </div>
                    {job.remote && <Badge variant="outline" className="mt-2 text-xs">Remote</Badge>}
                  </div>
                  
                  <div className="p-4 md:border-l border-border flex items-center space-x-6 md:w-[180px] justify-end">
                    <div className="font-medium text-sm">Your Ranking:</div>
                    <Select 
                      value={jobRankings[job.id]?.toString() || ""} 
                      onValueChange={(value) => handleJobRanking(job.id, parseInt(value))}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st</SelectItem>
                        <SelectItem value="2">2nd</SelectItem>
                        <SelectItem value="3">3rd</SelectItem>
                        <SelectItem value="4">4th</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {allJobsRanked && (
          <Alert className="bg-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Ranking Complete!</AlertTitle>
            <AlertDescription>
              Thank you for ranking these opportunities. This helps our AI learn your preferences and provide better matches.
            </AlertDescription>
          </Alert>
        )}
      </StepCardContent>
    </StepCard>
  );
};

export default JobRankingSection;
