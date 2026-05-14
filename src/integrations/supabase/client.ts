import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Read Supabase config from Vite build-time env. Anon JWTs are public by
// design (RLS gates access), but reading from env lets us rotate the key
// without a code change. Dev/test fall back to the project defaults so
// `npm run dev` and `vitest` work without a local .env.
const FALLBACK_SUPABASE_URL = "https://api.fractionalfirst.com"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eXVnb2t2bGtzbmF0ZnRwdWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Njg3NzUsImV4cCI6MjA2MzQ0NDc3NX0.7AZFW9BsEeUatjnJDAfnvrOBd_XMq1Ia_iWAKLzGAw0"

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.PROD && (!envUrl || !envAnonKey)) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in production build. " +
      "Set both as build-time env vars (CI workflow env: block and hosting platform)."
  )
}

const SUPABASE_URL = envUrl ?? FALLBACK_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = envAnonKey ?? FALLBACK_SUPABASE_ANON_KEY

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
)
