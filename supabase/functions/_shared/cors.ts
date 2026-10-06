// Browser origins allowed to call the edge functions that use this helper
// (submit-rdg-lead, submit-shortlist). Every entry is annotated with the app it
// serves, and every entry must be a host that actually resolves: a dead name
// here is dead weight at best, and an origin nobody holds the DNS for at worst.
const ALLOWED_ORIGINS = [
  "https://talent.fractionalfirst.com",                     // talentflow — talent portal
  "https://candidates.fractionalfirst.com",                 // public-profiles
  "https://clients.fractionalfirst.com",                    // ff-client-portal
  "https://role-description-generator.fractionalfirst.com", // guest-jd-generator — custom domain
  "https://guest-jd-generator.netlify.app",                 // guest-jd-generator — Netlify site
  "http://localhost:5173",                                  // vite dev server
  "http://localhost:3000",                                  // next dev server
];

const ALLOWED_PATTERNS = [
  /^https:\/\/deploy-preview-\d+--guest-jd-generator\.netlify\.app$/,
];

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Vary": "Origin",
  };
  if (origin && (ALLOWED_ORIGINS.includes(origin) || ALLOWED_PATTERNS.some(p => p.test(origin)))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function handlePreflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
  }
  return null;
}
