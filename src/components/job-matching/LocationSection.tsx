
import { MapPin, Building } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LocationSectionProps {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
  workEligibility: string[];
  setWorkEligibility: React.Dispatch<React.SetStateAction<string[]>>;
  locationPreferences: string[];
  setLocationPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  remotePreference: boolean;
  setRemotePreference: (preference: boolean) => void;
}

const LocationSection = ({
  currentLocation,
  setCurrentLocation,
  workEligibility,
  setWorkEligibility,
  locationPreferences,
  setLocationPreferences,
  remotePreference,
  setRemotePreference
}: LocationSectionProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">Remote Work Preference</h3>
            <p className="text-sm text-muted-foreground">Are you interested in remote work?</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="remote-preference" 
            checked={remotePreference}
            onCheckedChange={setRemotePreference}
          />
          <label htmlFor="remote-preference" className="text-sm font-medium">
            {remotePreference ? 'Yes' : 'No'}
          </label>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">Location Information</h3>
            <p className="text-sm text-muted-foreground">Your current location and work eligibility</p>
          </div>
        </div>
        
        <div className="space-y-4 px-4">
          <div>
            <Label htmlFor="current-location" className="text-sm">Current Location</Label>
            <Input 
              id="current-location"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Legal Work Eligibility</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {workEligibility.map(country => (
                <Badge key={country} variant="outline">
                  {country}
                  <button 
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setWorkEligibility(prev => prev.filter(c => c !== country))}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button variant="outline" size="sm">+ Add Country</Button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Preferred Work Locations</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {locationPreferences.map(location => (
                <Badge key={location} variant="outline">
                  {location}
                  <button 
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setLocationPreferences(prev => prev.filter(l => l !== location))}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button variant="outline" size="sm">+ Add Location</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationSection;
