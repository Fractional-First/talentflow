# Profile Generator Feature

## Overview

The Profile Generator feature allows anonymous users to generate their professional profile before signing up, demonstrating value upfront and reducing signup friction.

## User Flow

### Anonymous Users

1. **Landing Page** (`/profile-generator`) - Marketing page explaining the value proposition
2. **Profile Creation** (`/profile-generator/create`) - Same as current `/create-profile` but for anonymous users
3. **Preview Page** (`/profile-generator/preview`) - Show generated profile with signup CTA
4. **Signup Integration** - Pass profile data to signup flow
5. **Post-Signup** - Auto-link profile and redirect to edit-profile

### Authenticated Users

- **`/profile-generator/*`**: Redirected to `/create-profile`
- **`/create-profile`**: Check sessionStorage for existing profile data, redirect to `/edit-profile` if found

## Technical Implementation

### New Routes

- `/profile-generator` - Landing page (no auth required)
- `/profile-generator/create` - Profile creation (no auth required)
- `/profile-generator/preview` - Profile preview (no auth required)

### Route Protection Logic

- **`/profile-generator/*`**: Allow anonymous users, redirect authenticated users to `/create-profile`
- **`/create-profile`**: Check sessionStorage for existing profile data, redirect to `/edit-profile` if found
- **Signup flow**: Check sessionStorage and submit profile data after successful signup

### Data Flow

```
Anonymous User:
/profile-generator → /profile-generator/create → /profile-generator/preview → Signup → /edit-profile

Authenticated User:
/profile-generator → Redirect to /create-profile
/create-profile → Check sessionStorage → If exists: /edit-profile, If not: Normal flow
```

### SessionStorage Management

- Store profile data in `sessionStorage` after successful generation
- Check `sessionStorage` on signup completion
- Clear `sessionStorage` after successful profile linking

## Components

### New Components

1. **ProfileGenerator** (`/src/pages/ProfileGenerator.tsx`)

   - Marketing landing page with value proposition
   - Features and benefits section
   - CTA to start profile generation

2. **ProfileGeneratorCreate** (`/src/pages/ProfileGeneratorCreate.tsx`)

   - Anonymous profile creation flow
   - Same UI as CreateProfile but stores data in sessionStorage
   - Redirects authenticated users to `/create-profile`

3. **ProfileGeneratorPreview** (`/src/pages/ProfileGeneratorPreview.tsx`)
   - **Exact replica of PublicProfile page** - Same layout, styling, and components
   - Uses the same ProfileData structure from sessionStorage
   - Claim banner with signup CTA
   - All profile sections: Basic Info, Description, Key Roles, Focus Areas, Industries, etc.
   - Personas, Superpowers, Functional Skills, and User Manual sections

### Modified Components

1. **CreateProfile** (`/src/pages/CreateProfile.tsx`)

   - Added sessionStorage check on mount
   - Redirects to `/edit-profile` if profile exists in sessionStorage

2. **AuthCallback** (`/src/pages/AuthCallback.tsx`)

   - Enhanced to handle profile generator flow
   - Submits stored profile data after successful authentication
   - Clears sessionStorage after successful submission

3. **SignUp** (`/src/pages/SignUp.tsx`)

   - Added support for profile generator flow
   - Passes `from=profile-generator` parameter to auth callback

4. **useSignUp** (`/src/queries/auth/useSignUp.ts`)
   - Enhanced to handle profile generator redirect URL

### Utility Functions

- **profileStorage** (`/src/utils/profileStorage.ts`)
  - Centralized sessionStorage management for profile data
  - **GeneratedProfile extends ProfileData** - Matches exact database structure
  - Type-safe interface with all profile fields
  - Error handling for storage operations

## Key Features

- ✅ **LinkedIn Input Only** - Simplified flow for unauthenticated users
- ✅ **Production N8N Integration** - Uses real profile generation API
- ✅ **SessionStorage Integration** - Store/retrieve profile data
- ✅ **Route Protection** - Proper auth checks
- ✅ **Same Loading Experience** - Reuse existing ProfileLoadingUI
- ✅ **Error Handling** - Comprehensive error handling for API calls

## Success Criteria

- Anonymous users can generate profiles without signing up
- Generated profiles are stored in sessionStorage
- Preview page shows profile with signup CTA
- Signup flow automatically links existing profile data
- Authenticated users are properly redirected
- No duplicate profile creation

## Files Created/Modified

### New Files

- `src/pages/ProfileGenerator.tsx` - Landing page
- `src/pages/ProfileGeneratorCreate.tsx` - Anonymous profile creation
- `src/pages/ProfileGeneratorPreview.tsx` - Profile preview with signup CTA
- `src/utils/profileStorage.ts` - SessionStorage utility functions
- `PROFILE_GENERATOR.md` - This documentation

### Modified Files

- `src/App.tsx` - Added new routes
- `src/pages/CreateProfile.tsx` - Added sessionStorage check
- `src/pages/AuthCallback.tsx` - Enhanced for profile generator flow
- `src/pages/SignUp.tsx` - Added profile generator support
- `src/queries/auth/useSignUp.ts` - Enhanced redirect URL handling

## Usage

### For Anonymous Users

1. Visit `/profile-generator`
2. Click "Generate My Profile"
3. Enter LinkedIn URL or upload resume
4. View generated profile preview
5. Click "Sign Up & Start Matching"
6. Complete signup process
7. Profile is automatically created and linked

### For Authenticated Users

- Visiting `/profile-generator` redirects to `/create-profile`
- If they have existing profile data in sessionStorage, they're redirected to `/edit-profile`

## Future Enhancements

- Real API integration for profile generation
- More sophisticated profile matching algorithms
- A/B testing for conversion optimization
- Analytics tracking for the profile generator flow
