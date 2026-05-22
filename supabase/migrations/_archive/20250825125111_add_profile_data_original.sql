-- Add profile_data_original column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_data_original jsonb DEFAULT '{}'::jsonb;
