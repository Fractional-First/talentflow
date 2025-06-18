export interface WorkPreferences {
  availabilityTypes: {
    fullTime: boolean
    fractional: boolean
  }
  rateRange: [number, number]
  paymentType: "annual" | "hourly"
  remotePreference: boolean
  currentLocation: string
  startDate: string
  timezone: string
  locationPreferences: string[]
  workEligibility: string[]
  industryPreferences: string[]
}

export const DEFAULT_WORK_PREFERENCES: WorkPreferences = {
  availabilityTypes: {
    fullTime: false,
    fractional: false,
  },
  rateRange: [75000, 100000],
  paymentType: "annual",
  remotePreference: true,
  currentLocation: "",
  startDate: "",
  timezone: "Eastern Standard Time",
  locationPreferences: [],
  workEligibility: [],
  industryPreferences: [],
}
