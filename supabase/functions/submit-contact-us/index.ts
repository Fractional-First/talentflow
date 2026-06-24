import { corsHeaders, handlePreflight } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_TO = ["reza@fractionalfirst.com", "adam@fractionalfirst.com", "daniel@fractionalfirst.com"];
const FROM = "Fractional First <noreply@fractionalfirst.com>";

Deno.serve(async (req) => {
  const pre = handlePreflight(req);
  if (pre) return pre;
  const cors = corsHeaders(req.headers.get("origin"));

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...cors, "content-type": "application/json" } });
  }

  let body: any;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...cors, "content-type": "application/json" } }); }

  if (!body?.name || !body?.email || !body?.message) {
    return new Response(JSON.stringify({ error: "Missing required fields: name, email, message" }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
  }

  const candidateSuffix = body.candidateName ? ` — re: ${body.candidateName}` : "";
  const subject = `[Contact Us] ${body.name}${candidateSuffix}`;
  const escapedMessage = (body.message as string).replace(/[<>&]/g, (c: string) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
  const html = `<h2>Contact Us Inquiry</h2>
    <p><strong>${body.name}</strong> &lt;${body.email}&gt;</p>
    ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ""}
    <h3>Message</h3>
    <blockquote>${escapedMessage}</blockquote>
    ${body.candidateName ? `<hr/><h3>Candidate</h3><p>${body.candidateName}${body.profileUrl ? ` — <a href="${body.profileUrl}">${body.profileUrl}</a>` : ""}</p>` : ""}
    <p style="color:#888;font-size:12px;">Source: ${body.source ?? "anonymous_profile_cta"}</p>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: FROM, to: NOTIFY_TO, reply_to: body.email, subject, html }),
  });

  if (!r.ok) {
    console.error("[submit-contact-us] Resend error", r.status, await r.text());
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 502, headers: { ...cors, "content-type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors, "content-type": "application/json" } });
});
