-- Add profile_created field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_created boolean NOT NULL DEFAULT false;
