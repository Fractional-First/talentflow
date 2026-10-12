import type { Database } from "@/integrations/supabase/types"

export type OnboardingStatus = Database["public"]["Enums"]["onboarding_status"]

// Earliest first. SET_PASSWORD is a separate track (an FF-created account that must
// set a password first), so it is not on the path.
const ONBOARDING_PATH: OnboardingStatus[] = [
  "SIGNED_UP",
  "EMAIL_CONFIRMED",
  "PROFILE_GENERATED",
  "PROFILE_CONFIRMED",
  "PREFERENCES_SET",
]

// Never lowers `current`; a status off the path (SET_PASSWORD) is returned unchanged.
export function raiseOnboardingStatus(
  current: OnboardingStatus | null | undefined,
  target: OnboardingStatus
): OnboardingStatus {
  if (!current) return target
  const from = ONBOARDING_PATH.indexOf(current)
  if (from === -1) return current
  return ONBOARDING_PATH.indexOf(target) > from ? target : current
}

export function routeForOnboardingStatus(
  status: OnboardingStatus | null | undefined
): string {
  if (!status) return "/create-profile"
  switch (status) {
    case "SIGNED_UP":
      return "/check-email"
    case "SET_PASSWORD":
      return "/change-password"
    case "EMAIL_CONFIRMED":
      return "/create-profile"
    case "PROFILE_GENERATED":
      return "/edit-profile"
    case "PROFILE_CONFIRMED":
    case "PREFERENCES_SET":
      return "/dashboard"
    default:
      // A status added to the DB enum fails here at compile time; until then, onboarding start.
      status satisfies never
      return "/create-profile"
  }
}
