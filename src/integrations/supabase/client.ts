// Supabase URL + anon key are intentionally hardcoded here.
//
// The anon JWT is a public credential by design — Supabase ships it embedded
// in any client bundle, and access is gated by RLS, not by keeping the key
// secret. Rotation is not currently planned, so reading these from
// `import.meta.env.VITE_SUPABASE_*` would buy nothing today and adds real
// cost (host env-var setup, new "missing env" runtime failure mode, future
// cleanup). Revisit only if multi-environment support or actual rotation
// becomes a real need. Per FRA-7.
//
// Sibling `types.ts` IS auto-generated (`npx supabase gen types`). This file
// is not — edit freely.
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const SUPABASE_URL = "https://api.fractionalfirst.com"
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eXVnb2t2bGtzbmF0ZnRwdWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Njg3NzUsImV4cCI6MjA2MzQ0NDc3NX0.7AZFW9BsEeUatjnJDAfnvrOBd_XMq1Ia_iWAKLzGAw0"

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
)
