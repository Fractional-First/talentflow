import { HealthCheckResult, Config } from "../types.js";
import { fetchWithRetry } from "../utils/http.js";

const WEBHOOK_ENDPOINTS = [
  { path: "/webhook/generate-profile", name: "Generate Profile (Documents)" },
  {
    path: "/webhook/generate-profile-linkedin",
    name: "Generate Profile (LinkedIn)",
  },
  { path: "/webhook/generate-profile-guest", name: "Generate Profile (Guest)" },
  { path: "/webhook/submit-profile", name: "Submit Profile" },
];

// Test LinkedIn URL that should work for happy path testing
const TEST_LINKEDIN_URL = "https://www.linkedin.com/in/adamjanes";

export async function checkN8NWebhooks(
  config: Config
): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];

  for (const endpoint of WEBHOOK_ENDPOINTS) {
    const url = `${config.n8nWebhookBase}${endpoint.path}`;
    const result = await checkEndpoint(url, endpoint.name, config.verbose);
    results.push(result);
  }

  // Add happy path test for LinkedIn webhook if TEST_USER_ID is provided
  if (config.testUserId) {
    const linkedinHappyPath = await checkLinkedInHappyPath(config);
    results.push(linkedinHappyPath);
  }

  return results;
}

async function checkLinkedInHappyPath(
  config: Config
): Promise<HealthCheckResult> {
  const url = `${config.n8nWebhookBase}/webhook/generate-profile-linkedin`;
  const startTime = Date.now();

  try {
    // Create FormData-style body with userId and linkedinUrl
    const formData = new URLSearchParams();
    formData.append("userId", config.testUserId!);
    formData.append("linkedinUrl", TEST_LINKEDIN_URL);

    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      timeout: 120000, // 2 minutes - LinkedIn processing can take time
      retries: 0, // Don't retry this expensive operation
    });

    const latencyMs = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        service: "n8n",
        name: "Generate Profile (LinkedIn) - Happy Path",
        status: "pass",
        latencyMs,
        message: `Profile generation successful (${response.status})`,
        details: config.verbose ? { url, userId: config.testUserId, response: data } : undefined,
      };
    }

    // Check for specific error types
    const errorText = await response.text().catch(() => "");
    let errorInfo: Record<string, unknown> = { status: response.status };
    try {
      errorInfo = JSON.parse(errorText);
    } catch {
      errorInfo.rawError = errorText;
    }

    return {
      service: "n8n",
      name: "Generate Profile (LinkedIn) - Happy Path",
      status: "fail",
      latencyMs,
      message: `Workflow failed: ${response.status} - ${errorInfo.message || errorText.substring(0, 100)}`,
      details: { url, userId: config.testUserId, error: errorInfo },
    };
  } catch (error) {
    return {
      service: "n8n",
      name: "Generate Profile (LinkedIn) - Happy Path",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
      details: { url, userId: config.testUserId, error: String(error) },
    };
  }
}

async function checkEndpoint(
  url: string,
  name: string,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Strategy 1: Try OPTIONS request (CORS preflight)
    const optionsResponse = await fetchWithRetry(url, {
      method: "OPTIONS",
      timeout: 10000,
      retries: 1,
    });

    if (optionsResponse.ok || optionsResponse.status === 204) {
      return {
        service: "n8n",
        name,
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: `OPTIONS returned ${optionsResponse.status}`,
        details: verbose ? { url, method: "OPTIONS" } : undefined,
      };
    }

    // Strategy 2: POST with minimal payload - expect 400 (validation error) not 500
    const postResponse = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _healthCheck: true }),
      timeout: 15000,
      retries: 1,
    });

    // 400 = endpoint alive, validating input
    // 401/403 = auth required (still alive)
    // 200/201 = somehow accepted (unexpected but alive)
    if (postResponse.status < 500) {
      return {
        service: "n8n",
        name,
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: `Endpoint responsive (POST returned ${postResponse.status})`,
        details: verbose
          ? { url, method: "POST", status: postResponse.status }
          : undefined,
      };
    }

    // 500+ = server error
    const errorText = await postResponse.text().catch(() => "");
    return {
      service: "n8n",
      name,
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: `Server error: ${postResponse.status}`,
      details: { url, status: postResponse.status, error: errorText },
    };
  } catch (error) {
    return {
      service: "n8n",
      name,
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
      details: { url, error: String(error) },
    };
  }
}
