import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handlePreflight } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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

  if (!body?.firstName || !body?.email || !body?.jdText) {
    return new Response(JSON.stringify({ error: "Missing required fields: firstName, email, jdText" }), { status: 400, headers: { ...cors, "content-type": "application/json" } });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = req.headers.get("user-agent") ?? null;
  const referrer = req.headers.get("referer") ?? null;

  const supa = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data, error } = await supa.rpc("submit_rdg_lead", {
    p_lead: {
      first_name: body.firstName,
      last_name: body.lastName ?? null,
      designation: body.designation ?? null,
      email: body.email,
      mobile: body.mobile ?? null,
      city: body.city ?? null,
      contact_opt_in: !!body.contactOptIn,
      contact_message: body.contactMessage ?? null,
      jd_text: body.jdText,
      jd_inputs: body.jdInputs ?? {},
      hide_ff_branding: !!body.hideFFBranding,
      ip_address: ip,
      user_agent: ua,
      referrer: referrer,
    },
  });

  if (error) {
    console.error("[submit-rdg-lead] RPC error", error);
    return new Response(JSON.stringify({ error: "Failed to save lead" }), { status: 500, headers: { ...cors, "content-type": "application/json" } });
  }

  const leadId = (data as any)?.lead_id;
  const subject = `[RDG] New lead: ${body.firstName}${body.lastName ? " " + body.lastName : ""} from ${body?.jdInputs?.companyData?.name ?? "Unknown"}`;
  const adminLink = `https://supabase.com/dashboard/project/dtyugokvlksnatftpucm/editor?table=rdg_leads&filter=id=eq.${leadId}`;
  const html = `
    <h2>New RDG Lead</h2>
    <p><strong>${body.firstName}${body.lastName ? " " + body.lastName : ""}</strong> &lt;${body.email}&gt;${body.designation ? ` — ${body.designation}` : ""}</p>
    ${body.mobile ? `<p>Mobile: ${body.mobile}</p>` : ""}
    ${body.city ? `<p>City: ${body.city}</p>` : ""}
    <p><strong>Wants contact:</strong> ${body.contactOptIn ? "Yes" : "No"}</p>
    ${body.contactMessage ? `<blockquote>${body.contactMessage}</blockquote>` : ""}
    <hr/>
    <h3>Generated JD</h3>
    <pre style="white-space: pre-wrap; font-family: ui-monospace, monospace; font-size: 12px;">${body.jdText.replace(/[<>&]/g, (c: string) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</pre>
    <hr/>
    <p><a href="${adminLink}">Open in Supabase admin</a></p>
  `;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "authorization": `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: NOTIFY_TO, reply_to: body.email, subject, html }),
    });
    if (!r.ok) {
      console.error("[submit-rdg-lead] Resend error", r.status, await r.text());
    }
  } catch (e) {
    console.error("[submit-rdg-lead] Resend exception", e);
  }

  return new Response(JSON.stringify({ leadId }), { status: 200, headers: { ...cors, "content-type": "application/json" } });
});
