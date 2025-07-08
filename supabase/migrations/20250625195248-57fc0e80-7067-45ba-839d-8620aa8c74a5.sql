
-- Add notification_preferences column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN notification_preferences JSONB DEFAULT '{"email_notifications": true}'::jsonb;
