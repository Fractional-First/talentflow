
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

// Utility function to convert base64 to File
const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], filename, { type: mime })
}

// Function to migrate a single user's profile image from base64 to storage
export const migrateUserProfileImage = async (userId: string, base64Image: string): Promise<string | null> => {
  try {
    // Convert base64 to file
    const file = base64ToFile(base64Image, `profile-${Date.now()}.jpg`)
    
    // Upload to Supabase Storage
    const fileName = `${userId}/migrated-profile-${Date.now()}.jpg`
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Migration upload error:', error)
      return null
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Migration error:', error)
    return null
  }
}

// Function to migrate all profile images (admin function)
export const migrateAllProfileImages = async () => {
  try {
    // Fetch all profiles with base64 images
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, profile_data')
      .not('profile_data->profilePicture', 'is', null)

    if (error) {
      console.error('Error fetching profiles:', error)
      return
    }

    let migrated = 0
    let failed = 0

    for (const profile of profiles || []) {
      const profileData = profile.profile_data as any
      const profilePicture = profileData?.profilePicture

      // Check if it's a base64 image (starts with data:)
      if (profilePicture && profilePicture.startsWith('data:')) {
        console.log(`Migrating profile image for user ${profile.id}`)
        
        const newUrl = await migrateUserProfileImage(profile.id, profilePicture)
        
        if (newUrl) {
          // Update the profile with the new URL
          const updatedProfileData = {
            ...profileData,
            profilePicture: newUrl
          }

          const { error: updateError } = await supabase
            .from('profiles')
            .update({ profile_data: updatedProfileData })
            .eq('id', profile.id)

          if (updateError) {
            console.error(`Failed to update profile ${profile.id}:`, updateError)
            failed++
          } else {
            migrated++
            console.log(`Successfully migrated profile image for user ${profile.id}`)
          }
        } else {
          failed++
        }
      }
    }

    toast({
      title: "Migration completed",
      description: `Migrated ${migrated} images, ${failed} failed.`,
    })

    return { migrated, failed }
  } catch (error) {
    console.error('Migration error:', error)
    toast({
      title: "Migration failed",
      description: "An error occurred during migration.",
      variant: "destructive"
    })
  }
}
