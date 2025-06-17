
-- Create work_preferences table (shared preferences)
CREATE TABLE public.work_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_location_id UUID REFERENCES public.locations(id),
  timezone_id UUID REFERENCES public.timezones(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create full_time_preferences table
CREATE TABLE public.full_time_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  min_salary INTEGER,
  max_salary INTEGER,
  remote_ok BOOLEAN DEFAULT false,
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create fractional_preferences table
CREATE TABLE public.fractional_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  min_hourly_rate INTEGER,
  max_hourly_rate INTEGER,
  min_daily_rate INTEGER,
  max_daily_rate INTEGER,
  min_hours_per_week INTEGER,
  max_hours_per_week INTEGER,
  remote_ok BOOLEAN DEFAULT false,
  payment_type TEXT CHECK (payment_type IN ('hourly', 'daily')),
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create junction table for work eligibility (countries)
CREATE TABLE public.user_work_eligibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  country_code CHAR(2) NOT NULL REFERENCES public.countries(alpha2_code),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, country_code)
);

-- Create junction table for full-time location preferences
CREATE TABLE public.full_time_location_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Create junction table for fractional location preferences
CREATE TABLE public.fractional_location_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Create junction table for full-time industry preferences
CREATE TABLE public.full_time_industry_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  industry_id UUID NOT NULL REFERENCES public.industries(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, industry_id)
);

-- Create junction table for fractional industry preferences
CREATE TABLE public.fractional_industry_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  industry_id UUID NOT NULL REFERENCES public.industries(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, industry_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.work_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_time_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fractional_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_work_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_time_location_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fractional_location_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_time_industry_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fractional_industry_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for work_preferences
CREATE POLICY "Users can view their own work preferences" 
  ON public.work_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work preferences" 
  ON public.work_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work preferences" 
  ON public.work_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work preferences" 
  ON public.work_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for full_time_preferences
CREATE POLICY "Users can view their own full-time preferences" 
  ON public.full_time_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own full-time preferences" 
  ON public.full_time_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own full-time preferences" 
  ON public.full_time_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own full-time preferences" 
  ON public.full_time_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for fractional_preferences
CREATE POLICY "Users can view their own fractional preferences" 
  ON public.fractional_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fractional preferences" 
  ON public.fractional_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fractional preferences" 
  ON public.fractional_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fractional preferences" 
  ON public.fractional_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_work_eligibility
CREATE POLICY "Users can view their own work eligibility" 
  ON public.user_work_eligibility 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work eligibility" 
  ON public.user_work_eligibility 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work eligibility" 
  ON public.user_work_eligibility 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work eligibility" 
  ON public.user_work_eligibility 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for full_time_location_preferences
CREATE POLICY "Users can view their own full-time location preferences" 
  ON public.full_time_location_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own full-time location preferences" 
  ON public.full_time_location_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own full-time location preferences" 
  ON public.full_time_location_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own full-time location preferences" 
  ON public.full_time_location_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for fractional_location_preferences
CREATE POLICY "Users can view their own fractional location preferences" 
  ON public.fractional_location_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fractional location preferences" 
  ON public.fractional_location_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fractional location preferences" 
  ON public.fractional_location_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fractional location preferences" 
  ON public.fractional_location_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for full_time_industry_preferences
CREATE POLICY "Users can view their own full-time industry preferences" 
  ON public.full_time_industry_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own full-time industry preferences" 
  ON public.full_time_industry_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own full-time industry preferences" 
  ON public.full_time_industry_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own full-time industry preferences" 
  ON public.full_time_industry_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for fractional_industry_preferences
CREATE POLICY "Users can view their own fractional industry preferences" 
  ON public.fractional_industry_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fractional industry preferences" 
  ON public.fractional_industry_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fractional industry preferences" 
  ON public.fractional_industry_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fractional industry preferences" 
  ON public.fractional_industry_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add triggers to update the updated_at column
CREATE TRIGGER update_work_preferences_updated_at 
  BEFORE UPDATE ON public.work_preferences 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_full_time_preferences_updated_at 
  BEFORE UPDATE ON public.full_time_preferences 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fractional_preferences_updated_at 
  BEFORE UPDATE ON public.fractional_preferences 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
