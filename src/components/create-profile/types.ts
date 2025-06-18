export type ProfileData = {
  linkedin?: File
  resume?: File
  docs: Array<{ title: string; file: File }>
  links: Array<{ title: string; link: string }>
}

export type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentPosition: string
  company: string
  industry: string
  experienceLevel: string
  summary: string
  skills: string
}

export const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Design",
  "Construction",
  "Transportation",
  "Hospitality",
  "Other",
] as const

export const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Executive (10+ years)",
] as const

export const LINKEDIN_PDF_GUIDE_URL =
  "https://www.linkedin.com/help/linkedin/answer/a521735/how-to-save-a-profile-as-a-pdf?lang=en"
export const N8N_DOCUMENTS_WEBHOOK =
  "https://webhook-processor-production-48f8.up.railway.app/webhook/d4245ae6-e289-47aa-95b4-26a93b75f7d9"
