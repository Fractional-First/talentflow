import { HealthCheckResult, Config } from "../types.js";
import { fetchWithRetry } from "../utils/http.js";

const EDGE_FUNCTIONS = [
  { name: "google-places", requiredParam: "input" },
  { name: "google-place-details", requiredParam: "placeId" },
];

// Known test data for happy path
const TEST_DATA = {
  "google-places": {
    input: "San Francisco, CA",
    types: "geocode",
  },
  "google-place-details": {
    // San Francisco City Hall - a well-known, stable place ID
    placeId: "ChIJIQBpAG2ahYAR_6128GcTUEo",
    fields: "place_id,name,formatted_address",
  },
};

export async function checkEdgeFunctions(
  config: Config
): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];

  for (const fn of EDGE_FUNCTIONS) {
    // Always run invocation test
    const invocationResult = await checkEdgeFunctionInvocation(
      fn.name,
      fn.requiredParam,
      config
    );
    results.push(invocationResult);

    // Run happy path test if Google API key is available
    if (config.googlePlacesApiKey) {
      const happyPathResult = await checkEdgeFunctionHappyPath(fn.name, config);
      results.push(happyPathResult);
    }
  }

  return results;
}

async function checkEdgeFunctionInvocation(
  functionName: string,
  requiredParam: string,
  config: Config
): Promise<HealthCheckResult> {
  const url = `${config.supabaseUrl}/functions/v1/${functionName}`;
  const startTime = Date.now();

  try {
    // Test with empty payload - should return validation error, not crash
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        apikey: config.supabaseAnonKey,
      },
      body: JSON.stringify({}),
      timeout: 15000,
      retries: 1,
    });

    const data = await response.json();

    // Check if function responded with expected validation error
    const errorMessage = data.error || "";
    if (
      response.status === 500 &&
      errorMessage.toLowerCase().includes(requiredParam.toLowerCase())
    ) {
      return {
        service: "edge-function",
        name: `${functionName} (invocation)`,
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: "Function deployed and validating input",
        details: config.verbose ? { expectedError: errorMessage } : undefined,
      };
    }

    // Function responded but not with expected validation
    return {
      service: "edge-function",
      name: `${functionName} (invocation)`,
      status: "warn",
      latencyMs: Date.now() - startTime,
      message: `Unexpected response: ${response.status}`,
      details: { status: response.status, body: data },
    };
  } catch (error) {
    return {
      service: "edge-function",
      name: `${functionName} (invocation)`,
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
      details: { error: String(error) },
    };
  }
}

async function checkEdgeFunctionHappyPath(
  functionName: string,
  config: Config
): Promise<HealthCheckResult> {
  const url = `${config.supabaseUrl}/functions/v1/${functionName}`;
  const startTime = Date.now();
  const testPayload =
    TEST_DATA[functionName as keyof typeof TEST_DATA] || {};

  try {
    const response = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        apikey: config.supabaseAnonKey,
      },
      body: JSON.stringify(testPayload),
      timeout: 15000,
      retries: 1,
    });

    const data = await response.json();

    if (functionName === "google-places") {
      // Expect OK or ZERO_RESULTS status from Google API
      if (
        response.ok &&
        (data.status === "OK" || data.status === "ZERO_RESULTS")
      ) {
        const predictionsCount = data.predictions?.length || 0;
        return {
          service: "edge-function",
          name: `${functionName} (happy path)`,
          status: "pass",
          latencyMs: Date.now() - startTime,
          message: `Google API returned ${predictionsCount} predictions`,
          details: config.verbose
            ? { status: data.status, predictionsCount }
            : undefined,
        };
      }
    }

    if (functionName === "google-place-details") {
      // Expect OK status with result
      if (response.ok && data.status === "OK" && data.result) {
        return {
          service: "edge-function",
          name: `${functionName} (happy path)`,
          status: "pass",
          latencyMs: Date.now() - startTime,
          message: `Retrieved place: ${data.result.name || "unknown"}`,
          details: config.verbose
            ? { placeId: data.result.place_id, name: data.result.name }
            : undefined,
        };
      }
    }

    // Unexpected response
    return {
      service: "edge-function",
      name: `${functionName} (happy path)`,
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: `API error: ${data.status || data.error || response.status}`,
      details: { response: data },
    };
  } catch (error) {
    return {
      service: "edge-function",
      name: `${functionName} (happy path)`,
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
      details: { error: String(error) },
    };
  }
}
