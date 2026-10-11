import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderWelcomeEmail } from "./email.ts";

// Sender. Kept as two constants so switching to Reza at hello@ (the copy's own
// header note) is a one-line change. The domain must stay one Resend has verified.
export const FROM_NAME = "Fractional First";
export const FROM_ADDRESS = "noreply@fractionalfirst.com";
export const REPLY_TO = "hello@fractionalfirst.com";

// Only people who verified their email this recently are welcomed, so existing
// members passing back through /auth/callback (e.g. a LinkedIn sign-in from the
// sign-up page) are never emailed.
const NEW_USER_WINDOW_MS = 24 * 60 * 60 * 1000;

// The caller is authenticated by their own JWT and can only trigger an email to
// their own verified address, so any origin may call it (as record-agreement-acceptance).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "content-type": "application/json" } });

const skip = (reason: string) => json({ sent: false, reason });

export async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Missing authorization" }, 401);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) return json({ error: "Invalid token" }, 401);

  if (!user.email || !user.email_confirmed_at) return skip("unverified");
  if (Date.now() - new Date(user.email_confirmed_at).getTime() > NEW_USER_WINDOW_MS) return skip("not_new");

  const { data: client } = await supabase.from("client_profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (client) return skip("client");

  // Claim the send before calling Resend: only one caller can flip NULL → now().
  const { data: claimed, error: claimError } = await supabase
    .from("profiles")
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq("id", user.id)
    .is("welcome_email_sent_at", null)
    .select("first_name");
  if (claimError) {
    console.error("[send-welcome-email] claim failed", user.id, claimError);
    return json({ sent: false, error: "Could not record the send" }, 500);
  }
  if (!claimed?.length) return skip("already_sent");

  const { subject, html, text } = renderWelcomeEmail(claimed[0].first_name);
  let failure: string | null = null;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "content-type": "application/json",
        "idempotency-key": `welcome-email/${user.id}`,
      },
      body: JSON.stringify({ from: `${FROM_NAME} <${FROM_ADDRESS}>`, to: [user.email], reply_to: REPLY_TO, subject, html, text }),
    });
    if (!r.ok) failure = `${r.status} ${await r.text()}`;
  } catch (e) {
    failure = String(e);
  }

  if (failure) {
    console.error("[send-welcome-email] Resend error", user.id, failure);
    // Release the claim so welcome_email_sent_at only ever means "sent".
    await supabase.from("profiles").update({ welcome_email_sent_at: null }).eq("id", user.id);
    return json({ sent: false, error: "Email provider error" }, 502);
  }

  console.log("[send-welcome-email] sent", user.id);
  return json({ sent: true });
}
