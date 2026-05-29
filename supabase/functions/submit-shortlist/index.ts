import { corsHeaders, handlePreflight } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_TO = ["reza@fractionalfirst.com", "adam@fractionalfirst.com"];
const FROM = "Fractional First <noreply@fractionalfirst.com>";

Deno.serve(async (req) => {
  const pre = handlePreflight(req);
  if (pre) return pre;
  const cors = corsHeaders(req.headers.get("origin"));

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...cors, "content-type": "application/json" } });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
  }

  if (!body?.email || !Array.isArray(body?.shortlistedSlugs)) {
    return new Response(JSON.stringify({ error: "Missing required fields: email, shortlistedSlugs" }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
  }

  const company = body.companyData?.name ?? "Unknown company";
  const role = body.refine?.roleTitle ?? body.refine?.functionArea ?? "Unknown role";
  const shortlisted: string[] = body.shortlistedSlugs;
  const passed: string[] = body.passedSlugs ?? [];
  const isNoMatch = body.context === "no_match";
  const sender = `${body.firstName ?? ""} ${body.lastName ?? ""}`.trim() || body.email;

  const subject = isNoMatch
    ? `[Match] No matches — ${sender} looking for ${role} at ${company}`
    : `[Match] Shortlist from ${sender}: ${shortlisted.length} candidate${shortlisted.length === 1 ? "" : "s"} for ${company} — ${role}`;

  const candidateRow = (slug: string, label: string) =>
    `<tr><td style="padding:4px 8px;">${label}</td><td style="padding:4px 8px;"><a href="https://candidates.fractionalfirst.com/profile/${slug}">${slug}</a></td></tr>`;

  const html = `
    <h2>${isNoMatch ? "No Matches Found — Contact Request" : "Candidate Shortlist"}</h2>
    <p><strong>${sender} &lt;${body.email}&gt;</strong></p>
    <p><strong>Role:</strong> ${role} at ${company}</p>
    ${body.note ? `<p><strong>Message:</strong> ${body.note}</p>` : ""}
    <hr/>
    ${isNoMatch ? "<p><em>No candidates met the quality threshold for this search.</em></p>" : `
    <h3>Shortlisted (${shortlisted.length})</h3>
    <table border="0" cellpadding="0" cellspacing="0">
      ${shortlisted.map(s => candidateRow(s, "✅")).join("\n")}
    </table>
    ${passed.length ? `
    <h3>Passed (${passed.length})</h3>
    <table border="0" cellpadding="0" cellspacing="0">
      ${passed.map(s => candidateRow(s, "❌")).join("\n")}
    </table>` : ""}`}
  `;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "authorization": `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: NOTIFY_TO, reply_to: body.email, subject, html }),
    });
    if (!r.ok) {
      console.error("[submit-shortlist] Resend error", r.status, await r.text());
    }
  } catch (e) {
    console.error("[submit-shortlist] Resend exception", e);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors, "content-type": "application/json" } });
});
