-- Update profiles with user- slugs that have name data in JSON fields
DO $$
DECLARE
  profile_record RECORD;
  full_name text;
  first_name_val text;
  last_name_val text;
  new_slug text;
  space_pos integer;
  updated_count integer := 0;
BEGIN
  -- Loop through profiles with user- slugs that have name data in JSON
  FOR profile_record IN 
    SELECT 
      id, 
      profile_slug,
      COALESCE(
        NULLIF(profile_data->>'name', ''),
        NULLIF(profile_data_original->>'name', '')
      ) as json_name
    FROM public.profiles
    WHERE profile_slug LIKE 'user-%'
      AND (
        NULLIF(profile_data->>'name', '') IS NOT NULL 
        OR NULLIF(profile_data_original->>'name', '') IS NOT NULL
      )
    LIMIT 100
  LOOP
    full_name := trim(profile_record.json_name);
    
    -- Skip if name is empty after trimming
    IF full_name IS NULL OR full_name = '' THEN
      CONTINUE;
    END IF;
    
    -- Parse the full name into first and last name
    space_pos := position(' ' in full_name);
    
    IF space_pos > 0 THEN
      -- Split on first space: "John Doe Smith" -> "John" + "Doe Smith"
      first_name_val := trim(substring(full_name from 1 for space_pos - 1));
      last_name_val := trim(substring(full_name from space_pos + 1));
    ELSE
      -- No space found, use entire name as first_name
      first_name_val := full_name;
      last_name_val := NULL;
    END IF;
    
    -- Generate new slug using the parsed names
    new_slug := public.generate_unique_profile_slug(
      profile_record.id,
      first_name_val,
      last_name_val
    );
    
    -- Single UPDATE statement for efficiency
    UPDATE public.profiles
    SET 
      first_name = first_name_val,
      last_name = last_name_val,
      profile_slug = new_slug
    WHERE id = profile_record.id;
    
    updated_count := updated_count + 1;
    
    RAISE NOTICE 'Updated profile % (%): % -> %', 
      profile_record.id,
      full_name,
      profile_record.profile_slug, 
      new_slug;
  END LOOP;
  
  RAISE NOTICE 'Total profiles updated: %', updated_count;
END $$;
