-- Add isPublished and linkedinURL fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN isPublished boolean DEFAULT false,
ADD COLUMN linkedinURL text;
