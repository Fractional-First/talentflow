import { checkN8NWebhooks } from "./checks/n8n-webhooks.js";
import { checkEdgeFunctions } from "./checks/edge-functions.js";
import { checkRPCFunctions } from "./checks/rpc-functions.js";
import { generateReport, writeReport } from "./utils/report.js";
import { HealthCheckResult, Config } from "./types.js";

function getConfig(): Config {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const n8nWebhookBase = process.env.N8N_WEBHOOK_BASE;

  if (!supabaseUrl || !supabaseAnonKey || !n8nWebhookBase) {
    console.error("Missing required environment variables:");
    if (!supabaseUrl) console.error("  - SUPABASE_URL");
    if (!supabaseAnonKey) console.error("  - SUPABASE_ANON_KEY");
    if (!n8nWebhookBase) console.error("  - N8N_WEBHOOK_BASE");
    process.exit(1);
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    n8nWebhookBase,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    testProfileSlug: process.env.TEST_PROFILE_SLUG,
    testAnonSlug: process.env.TEST_ANON_SLUG,
    verbose: process.env.VERBOSE === "true",
    services: (process.env.SERVICES || "all").split(",").map((s) => s.trim()),
  };
}

async function main(): Promise<void> {
  const startTime = Date.now();
  const config = getConfig();

  console.log("Starting health checks...");
  console.log(`Supabase URL: ${config.supabaseUrl}`);
  console.log(`N8N Webhook Base: ${config.n8nWebhookBase}`);
  console.log(`Services: ${config.services.join(", ")}`);
  console.log(`Verbose: ${config.verbose}`);
  console.log(
    `Google Places API Key: ${config.googlePlacesApiKey ? "Provided" : "Not provided"}`
  );
  console.log(`Test Profile Slug: ${config.testProfileSlug || "(default: adam-janes)"}`);
  console.log("");

  const results: HealthCheckResult[] = [];
  const runAll = config.services.includes("all");

  // Run checks based on configuration
  if (runAll || config.services.includes("n8n")) {
    console.log("Checking N8N webhooks...");
    const n8nResults = await checkN8NWebhooks(config);
    results.push(...n8nResults);
    console.log(`  Completed: ${n8nResults.length} checks`);
  }

  if (runAll || config.services.includes("edge")) {
    console.log("Checking Supabase edge functions...");
    const edgeResults = await checkEdgeFunctions(config);
    results.push(...edgeResults);
    console.log(`  Completed: ${edgeResults.length} checks`);
  }

  if (runAll || config.services.includes("rpc")) {
    console.log("Checking Supabase RPC functions...");
    const rpcResults = await checkRPCFunctions(config);
    results.push(...rpcResults);
    console.log(`  Completed: ${rpcResults.length} checks`);
  }

  // Generate and write report
  const report = generateReport(results, startTime);
  await writeReport(report);

  // Exit with error code if any checks failed
  const hasFailures = results.some((r) => r.status === "fail");
  process.exit(hasFailures ? 1 : 0);
}

main().catch((err) => {
  console.error("Health check failed:", err);
  process.exit(1);
});
