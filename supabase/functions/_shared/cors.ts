const ALLOWED_ORIGINS = [
  "https://role-description-generator.fractionalfirst.com",
  "https://rdg.fractionalfirst.com",
  "https://guest-jd-generator.netlify.app",
  "http://localhost:5173",
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
