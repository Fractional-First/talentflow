import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handlePreflight } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_TO = (
  Deno.env.get("CONTACT_NOTIFY_EMAILS") ??
    "reza@fractionalfirst.com,adam@fractionalfirst.com,daniel@fractionalfirst.com"
).split(",").map((email) => email.trim()).filter(Boolean);
const FROM = "Fractional First <noreply@fractionalfirst.com>";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_EMAIL_PER_HOUR = 3;
const MAX_PER_IP_PER_HOUR = 10;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  candidateName?: unknown;
  profileUrl?: unknown;
  source?: unknown;
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  cors: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[<>&"]/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
  }[c]!));
}

function normalizeOptional(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function normalizeRequired(value: unknown, maxLength: number) {
  const normalized = normalizeOptional(value, maxLength);
  if (!normalized) throw new Error("missing");
  return normalized;
}

function normalizeSubject(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 140);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeProfileUrl(value: unknown) {
  const raw = normalizeOptional(value, 500);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const allowedHost = url.hostname === "candidates.fractionalfirst.com" ||
      url.hostname === "localhost" ||
      /^deploy-preview-\d+--talentflow-candidates\.netlify\.app$/.test(
        url.hostname,
      );

    if (url.protocol !== "https:" && url.hostname !== "localhost") return null;
    if (!allowedHost) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    null;
}

Deno.serve(async (req) => {
  const pre = handlePreflight(req);
  if (pre) return pre;
  const cors = corsHeaders(req.headers.get("origin"));

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, cors);
  }

  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, cors);
  }

  let name: string;
  let email: string;
  try {
    name = normalizeRequired(body.name, 120);
    email = normalizeRequired(body.email, 254).toLowerCase();
  } catch {
    return jsonResponse(
      { error: "Missing required fields: name, email" },
      400,
      cors,
    );
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: "Invalid email" }, 400, cors);
  }

  const company = normalizeOptional(body.company, 160);
  const message = normalizeOptional(body.message, 4000);
  const candidateName = normalizeOptional(body.candidateName, 160);
  const profileUrl = normalizeProfileUrl(body.profileUrl);
  const source = normalizeOptional(body.source, 80) ?? "anonymous_profile_cta";
  const ip = clientIp(req);
  const userAgent = normalizeOptional(req.headers.get("user-agent"), 500);
  const referrer = normalizeOptional(req.headers.get("referer"), 500);

  const supa = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const emailCountQuery = supa
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  const ipCountQuery = ip
    ? supa
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", since)
    : null;
  const [emailCountResult, ipCountResult] = await Promise.all([
    emailCountQuery,
    ipCountQuery ?? Promise.resolve({ count: 0, error: null }),
  ]);

  if (emailCountResult.error || ipCountResult.error) {
    console.error(
      "[submit-contact-us] rate limit query error",
      emailCountResult.error ?? ipCountResult.error,
    );
    return jsonResponse({ error: "Failed to submit inquiry" }, 500, cors);
  }

  const rateLimited = (emailCountResult.count ?? 0) >= MAX_PER_EMAIL_PER_HOUR ||
    (ip ? (ipCountResult.count ?? 0) >= MAX_PER_IP_PER_HOUR : false);
  if (rateLimited) {
    await supa.from("contact_submissions").insert({
      name,
      email,
      company,
      message,
      candidate_name: candidateName,
      profile_url: profileUrl,
      source,
      ip_address: ip,
      user_agent: userAgent,
      referrer,
      status: "rate_limited",
    });
    return jsonResponse(
      { error: "Too many submissions. Please try again later." },
      429,
      cors,
    );
  }

  const { data: submission, error: insertError } = await supa
    .from("contact_submissions")
    .insert({
      name,
      email,
      company,
      message,
      candidate_name: candidateName,
      profile_url: profileUrl,
      source,
      ip_address: ip,
      user_agent: userAgent,
      referrer,
      status: "received",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[submit-contact-us] insert error", insertError);
    return jsonResponse({ error: "Failed to submit inquiry" }, 500, cors);
  }

  const candidateSuffix = candidateName
    ? ` — re: ${normalizeSubject(candidateName)}`
    : "";
  const subject = `[Contact Us] ${normalizeSubject(name)}${candidateSuffix}`;
  const escapedMessage = message ? escapeHtml(message) : "No message provided.";
  const html = `<h2>Contact Us Inquiry</h2>
    <p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    <h3>Message</h3>
    <blockquote>${escapedMessage}</blockquote>
    ${
    candidateName
      ? `<hr/><h3>Candidate</h3><p>${escapeHtml(candidateName)}${
        profileUrl
          ? ` — <a href="${escapeHtml(profileUrl)}">${
            escapeHtml(profileUrl)
          }</a>`
          : ""
      }</p>`
      : ""
  }
    <p style="color:#888;font-size:12px;">Source: ${escapeHtml(source)}</p>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: NOTIFY_TO,
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!r.ok) {
    const errorText = await r.text();
    console.error("[submit-contact-us] Resend error", r.status, errorText);
    await supa.from("contact_submissions").update({
      status: "failed",
      error: `Resend ${r.status}: ${errorText.slice(0, 500)}`,
    }).eq("id", submission.id);
    return jsonResponse({ error: "Failed to send email" }, 502, cors);
  }

  const resend = await r.json().catch(() => null);
  await supa.from("contact_submissions").update({
    status: "sent",
    resend_id: typeof resend?.id === "string" ? resend.id : null,
  }).eq("id", submission.id);

  return jsonResponse({ ok: true }, 200, cors);
});
