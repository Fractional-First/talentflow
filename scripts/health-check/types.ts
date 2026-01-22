export type HealthCheckStatus = "pass" | "warn" | "fail";

export interface HealthCheckResult {
  service: "n8n" | "edge-function" | "rpc";
  name: string;
  status: HealthCheckStatus;
  latencyMs: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface HealthCheckReport {
  timestamp: string;
  durationMs: number;
  summary: {
    total: number;
    passed: number;
    warned: number;
    failed: number;
  };
  results: HealthCheckResult[];
}

export interface Config {
  supabaseUrl: string;
  supabaseAnonKey: string;
  n8nWebhookBase: string;
  googlePlacesApiKey?: string;
  testProfileSlug?: string;
  testAnonSlug?: string;
  verbose: boolean;
  services: string[];
}
