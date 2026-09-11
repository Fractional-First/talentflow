// Dev-only demo helper for previewing the Get Engagement-Ready unsigned state
// without real account data. Stored in localStorage (not a URL param) so it
// survives normal in-app navigation between /dashboard and /dashboard/agreement.
// import.meta.env.DEV is statically false in production builds, so every call
// here is dead-code-eliminated from the prod bundle.
export type DemoStage = "unsigned" | null

const STORAGE_KEY = "ff_demo_stage"

export const getDemoStage = (): DemoStage => {
  if (!import.meta.env.DEV || typeof window === "undefined") return null
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === "unsigned" ? value : null
}
