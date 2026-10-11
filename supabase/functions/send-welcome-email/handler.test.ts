// Integration tests for send-welcome-email against a local Supabase stack (real
// auth + PostgREST + the profiles.welcome_email_sent_at migration). Only Resend
// is faked, at the network boundary. No CI job runs these; run them by hand:
//
//   supabase start   # any local stack with talentflow's migrations applied
//   SUPABASE_URL=http://127.0.0.1:<api port> SUPABASE_SERVICE_ROLE_KEY=<local service key> \
//   SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:<db port>/postgres \
//   deno test --allow-net --allow-env supabase/functions/send-welcome-email/

import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert@1";
import postgres from "npm:postgres@3.4.4";
import { handler } from "./handler.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { max: 1 });
Deno.env.set("RESEND_API_KEY", "re_test_key");

type ResendCall = { headers: Headers; body: Record<string, unknown> };
let resendCalls: ResendCall[] = [];
let resendStatus = 200;
const realFetch = globalThis.fetch;
globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
  const url = input instanceof Request ? input.url : String(input);
  if (url.startsWith("https://api.resend.com/")) {
    resendCalls.push({ headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
    return new Response(JSON.stringify(resendStatus === 200 ? { id: "email_1" } : { message: "boom" }), { status: resendStatus });
  }
  return realFetch(input, init);
};

const admin = (path: string, init: RequestInit = {}) =>
  realFetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, "content-type": "application/json", ...init.headers },
  });

// A signed-in talent: an auth user with a profiles row, as signup + handle_new_user leave them.
async function talent(opts: { firstName?: string | null; confirmed?: boolean; confirmedAgo?: string; client?: boolean } = {}) {
  const email = `welcome-${crypto.randomUUID()}@example.com`;
  const password = "Passw0rd!welcome";
  const created = await (await admin("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, password, email_confirm: opts.confirmed !== false }),
  })).json();
  const id: string = created.id;
  await sql`INSERT INTO public.profiles (id, email, first_name, onboarding_status, profile_slug)
            VALUES (${id}, ${email}, ${opts.firstName === undefined ? "Claire" : opts.firstName}, 'EMAIL_CONFIRMED', ${"welcome-" + id.slice(0, 8)})`;
  if (opts.confirmedAgo) {
    await sql`UPDATE auth.users SET email_confirmed_at = now() - ${opts.confirmedAgo}::interval WHERE id = ${id}`;
  }
  if (opts.client) {
    await sql`INSERT INTO public.client_profiles (user_id) VALUES (${id})`;
  }
  // An unverified user can't sign in, so mint their session through the admin API's magic link instead.
  let token: string;
  if (opts.confirmed === false) {
    const link = await (await admin("/auth/v1/admin/generate_link", { method: "POST", body: JSON.stringify({ type: "magiclink", email }) })).json();
    await sql`UPDATE auth.users SET email_confirmed_at = NULL WHERE id = ${id}`;
    const verified = await (await realFetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: { apikey: SERVICE_KEY, "content-type": "application/json" },
      body: JSON.stringify({ type: "magiclink", token_hash: link.hashed_token }),
    })).json();
    await sql`UPDATE auth.users SET email_confirmed_at = NULL WHERE id = ${id}`;
    token = verified.access_token;
  } else {
    const session = await (await realFetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SERVICE_KEY, "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })).json();
    token = session.access_token;
  }
  return { id, email, token };
}

const call = (token?: string) =>
  handler(new Request("http://localhost/send-welcome-email", {
    method: "POST",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  }));

const sentAt = async (id: string) =>
  (await sql`SELECT welcome_email_sent_at FROM public.profiles WHERE id = ${id}`)[0].welcome_email_sent_at;

function reset() {
  resendCalls = [];
  resendStatus = 200;
}

const opts = { sanitizeResources: false, sanitizeOps: false };

Deno.test("a newly verified talent gets one welcome email at their own address", opts, async () => {
  reset();
  const t = await talent({ firstName: "Claire" });
  const res = await call(t.token);
  assertEquals(res.status, 200);
  assertEquals((await res.json()).sent, true);
  assertEquals(resendCalls.length, 1);
  const { body, headers } = resendCalls[0];
  assertEquals(body.to, [t.email]);
  assertEquals(body.from, "Reza Behnam, Fractional First <hello@fractionalfirst.com>");
  assertEquals(body.reply_to, "hello@fractionalfirst.com");
  assertEquals(body.subject, "Welcome to Fractional First");
  assertStringIncludes(String(body.text), "Hi Claire,");
  assertStringIncludes(String(body.text), "Complete your onboarding: https://talent.fractionalfirst.com/dashboard");
  assertStringIncludes(String(body.html), "Hi Claire,");
  assertEquals(headers.get("idempotency-key"), `welcome-email/${t.id}`);
  assert(await sentAt(t.id) instanceof Date);
});

Deno.test("calling again sends nothing more", opts, async () => {
  reset();
  const t = await talent();
  await call(t.token);
  const first = await sentAt(t.id);
  const res = await call(t.token);
  assertEquals(await res.json(), { sent: false, reason: "already_sent" });
  assertEquals(resendCalls.length, 1);
  assertEquals(await sentAt(t.id), first);
});

Deno.test("two simultaneous calls send once", opts, async () => {
  reset();
  const t = await talent();
  const results = await Promise.all([call(t.token), call(t.token), call(t.token)]);
  const sent = (await Promise.all(results.map((r) => r.json()))).filter((b) => b.sent);
  assertEquals(sent.length, 1);
  assertEquals(resendCalls.length, 1);
});

Deno.test("a member who verified before this shipped gets nothing", opts, async () => {
  reset();
  const t = await talent({ confirmedAgo: "2 days" });
  const res = await call(t.token);
  assertEquals(await res.json(), { sent: false, reason: "not_new" });
  assertEquals(resendCalls.length, 0);
  assertEquals(await sentAt(t.id), null);
});

Deno.test("an unverified user gets nothing", opts, async () => {
  reset();
  const t = await talent({ confirmed: false });
  const res = await call(t.token);
  assertEquals(await res.json(), { sent: false, reason: "unverified" });
  assertEquals(resendCalls.length, 0);
  assertEquals(await sentAt(t.id), null);
});

Deno.test("a client-portal user gets nothing", opts, async () => {
  reset();
  const t = await talent({ client: true });
  const res = await call(t.token);
  assertEquals(await res.json(), { sent: false, reason: "client" });
  assertEquals(resendCalls.length, 0);
  assertEquals(await sentAt(t.id), null);
});

Deno.test("no first name falls back to 'Hi there,'", opts, async () => {
  reset();
  const t = await talent({ firstName: null });
  await call(t.token);
  assertStringIncludes(String(resendCalls[0].body.text), "Hi there,");
});

Deno.test("first names are HTML-escaped", opts, async () => {
  reset();
  const t = await talent({ firstName: "<b>Eve</b>" });
  await call(t.token);
  const html = String(resendCalls[0].body.html);
  assertStringIncludes(html, "Hi &lt;b&gt;Eve&lt;/b&gt;,");
  assert(!html.includes("<b>Eve</b>"));
});

Deno.test("when Resend refuses, the send is released and reported", opts, async () => {
  reset();
  resendStatus = 500;
  const t = await talent();
  const res = await call(t.token);
  assertEquals(res.status, 502);
  assertEquals((await res.json()).sent, false);
  assertEquals(await sentAt(t.id), null);
});

Deno.test("no or bad token is refused", opts, async () => {
  reset();
  assertEquals((await call()).status, 401);
  assertEquals((await call("not-a-jwt")).status, 401);
  assertEquals(resendCalls.length, 0);
});

Deno.test({ name: "close db", ...opts, fn: async () => { await sql.end(); } });
