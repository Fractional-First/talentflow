import { corsHeaders, handlePreflight } from "../_shared/cors.ts";

const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_TO = [
  "reza@fractionalfirst.com",
  "adam@fractionalfirst.com",
  "daniel@fractionalfirst.com",
];
const FROM = "Fractional First <noreply@fractionalfirst.com>";

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

function hasForwardedAnonKey(req: Request) {
  const expectedAuth = SUPABASE_ANON_KEY ? `Bearer ${SUPABASE_ANON_KEY}` : null;
  return !!expectedAuth && req.headers.get("authorization") === expectedAuth;
}

Deno.serve(async (req) => {
  const pre = handlePreflight(req);
  if (pre) return pre;
  const cors = corsHeaders(req.headers.get("origin"));

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, cors);
  }

  if (!hasForwardedAnonKey(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401, cors);
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
    email = normalizeRequired(body.email, 254);
  } catch {
    return jsonResponse(
      { error: "Missing required fields: name, email" },
      400,
      cors,
    );
  }

  const company = normalizeOptional(body.company, 160);
  const message = normalizeOptional(body.message, 4000);
  const candidateName = normalizeOptional(body.candidateName, 160);
  const profileUrl = normalizeOptional(body.profileUrl, 500);
  const source = normalizeOptional(body.source, 80) ?? "anonymous_profile_cta";
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
    console.error("[submit-contact-us] Resend error", r.status, await r.text());
    return jsonResponse({ error: "Failed to send email" }, 502, cors);
  }

  return jsonResponse({ ok: true }, 200, cors);
});
