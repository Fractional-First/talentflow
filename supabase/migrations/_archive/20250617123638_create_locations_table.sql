-- Create locations table to store normalized location data from Google Places
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT UNIQUE NOT NULL, -- Google Places ID for reference
  name TEXT NOT NULL, -- Display name (e.g., "San Francisco, CA, USA")
  formatted_address TEXT, -- Full formatted address from Google
  city TEXT,
  state_province TEXT,
  country_code CHAR(2) REFERENCES public.countries(alpha2_code),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  place_types TEXT[], -- Array of Google Places types (e.g., ['locality', 'political'])
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_locations_place_id ON public.locations(place_id);
CREATE INDEX idx_locations_country_code ON public.locations(country_code);
CREATE INDEX idx_locations_name ON public.locations USING gin(to_tsvector('english', name));

-- Create user location preferences table
CREATE TABLE public.user_location_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  preference_type TEXT NOT NULL CHECK (preference_type IN ('current', 'preferred_work')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, location_id, preference_type)
);

-- Enable RLS on both tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_location_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for locations (public read access for location search)
CREATE POLICY "Anyone can view locations" 
  ON public.locations 
  FOR SELECT 
  USING (true);

-- RLS policies for user location preferences
CREATE POLICY "Users can view their own location preferences" 
  ON public.user_location_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own location preferences" 
  ON public.user_location_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location preferences" 
  ON public.user_location_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own location preferences" 
  ON public.user_location_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at on locations
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on user_location_preferences  
CREATE TRIGGER update_user_location_preferences_updated_at
  BEFORE UPDATE ON public.user_location_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
