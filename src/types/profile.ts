
// Profile-related shared types

export interface Persona {
  title: string
  bullets: string[]
}

export interface Superpower {
  title: string
  description: string
}

export interface FunctionalSkill {
  title: string
  description: string
}

export interface FunctionalSkills {
  [category: string]: FunctionalSkill[]
}

export interface ProfileData {
  name?: string
  role?: string
  summary?: string
  location?: string
  linkedin_url?: string
  personas?: Persona[]
  meet_them?: string
  sweetspot?: string
  highlights?: string[]
  industries?: string[]
  focus_areas?: string[]
  stage_focus?: string[]
  superpowers?: Superpower[]
  user_manual?: string
  certifications?: string[]
  non_obvious_role?: {
    title: string
    description: string
  }
  functional_skills?: FunctionalSkills
  personal_interests?: string[]
  geographical_coverage?: string[]
  profilePicture?: string
  engagement_options?: string[]
}

export interface EditStates {
  basicInfo: boolean
  description: boolean
  keyRoles: boolean
  focusAreas: boolean
  industries: boolean
  geographicalCoverage: boolean
  stages: boolean
  personalInterests: boolean
  certifications: boolean
  meetIntro: boolean
  personas: boolean
  superpowers: boolean
  sweetSpot: boolean
  userManual: boolean
  functionalSkills: boolean
}
