-- Add open_for_work to full_time_preferences
ALTER TABLE full_time_preferences
ADD COLUMN open_for_work boolean NOT NULL DEFAULT false;

-- Add open_for_work to fractional_preferences
ALTER TABLE fractional_preferences
ADD COLUMN open_for_work boolean NOT NULL DEFAULT false;
