const ALLOWED_ORIGINS = [
  "https://app.fractionalfirst.com",
  "https://candidates.fractionalfirst.com",
  "https://orgs.fractionalfirst.com",
  "https://guest-jd-generator.netlify.app",
];

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export function handlePreflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin");
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  return null;
}
