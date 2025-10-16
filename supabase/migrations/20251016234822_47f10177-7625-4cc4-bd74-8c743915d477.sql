-- Update all profiles with generic user- slugs to use name-based slugs
DO $$
DECLARE
  profile_record RECORD;
  new_slug text;
BEGIN
  -- Loop through all profiles with user- prefix slugs
  FOR profile_record IN 
    SELECT id, first_name, last_name, profile_slug
    FROM public.profiles
    WHERE profile_slug LIKE 'user-%'
  LOOP
    -- Generate new slug using existing function
    new_slug := public.generate_unique_profile_slug(
      profile_record.id,
      profile_record.first_name,
      profile_record.last_name
    );
    
    -- Update the profile with the new slug
    UPDATE public.profiles
    SET profile_slug = new_slug
    WHERE id = profile_record.id;
    
    RAISE NOTICE 'Updated profile % from % to %', 
      profile_record.id, 
      profile_record.profile_slug, 
      new_slug;
  END LOOP;
END $$;