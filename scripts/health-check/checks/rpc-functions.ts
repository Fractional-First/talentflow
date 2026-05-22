import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { HealthCheckResult, Config } from "../types.js";

interface PublishedProfile {
  profile_slug: string;
  anon_slug: string | null;
}

// Default test slug - should be a known published profile
const DEFAULT_TEST_SLUG = "adam-janes";

export async function checkRPCFunctions(
  config: Config
): Promise<HealthCheckResult[]> {
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  const results: HealthCheckResult[] = [];

  // Get test profile slug from env or use default
  const testSlug = config.testProfileSlug || DEFAULT_TEST_SLUG;

  // Find a published profile for happy path tests using RPC
  // (Direct table access is blocked by RLS for anon key)
  const testProfile = await findPublishedProfile(supabase, testSlug, config.verbose);

  // Happy path tests (if we have a published profile)
  if (testProfile) {
    // Test get_public_profile
    results.push(
      await checkGetPublicProfileHappy(
        supabase,
        testProfile.profile_slug,
        config.verbose
      )
    );

    // Test get_anon_profile (if anon_slug exists)
    if (testProfile.anon_slug) {
      results.push(
        await checkGetAnonProfileHappy(
          supabase,
          testProfile.anon_slug,
          config.verbose
        )
      );
    } else {
      results.push({
        service: "rpc",
        name: "get_anon_profile (happy path)",
        status: "warn",
        latencyMs: 0,
        message: `Test profile '${testSlug}' has no anon_slug - skipping`,
      });
    }
  } else {
    // Warn that we couldn't run happy path tests
    results.push({
      service: "rpc",
      name: "Happy path tests",
      status: "warn",
      latencyMs: 0,
      message: `Test profile '${testSlug}' not found or not published - set TEST_PROFILE_SLUG env var`,
    });
  }

  // Error handling tests (always run)
  results.push(await checkGetAnonProfileNotFound(supabase, config.verbose));
  results.push(await checkGetPublicProfileNotFound(supabase, config.verbose));
  results.push(await checkGetPublicProfileByIdNotFound(supabase, config.verbose));

  return results;
}

async function findPublishedProfile(
  supabase: SupabaseClient,
  testSlug: string,
  verbose: boolean
): Promise<PublishedProfile | null> {
  try {
    // Use RPC to find profile (direct table access blocked by RLS)
    const { data, error } = await supabase.rpc("get_public_profile", {
      profile_slug_param: testSlug,
    });

    if (error) {
      if (verbose) {
        console.log(`Profile '${testSlug}' lookup error:`, error.message);
      }
      return null;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result || !result.profile_slug) {
      if (verbose) {
        console.log(`Profile '${testSlug}' not found or not published`);
      }
      return null;
    }

    // We need to get the anon_slug separately via get_anon_profile
    // First, try to find anon profile with similar slug pattern
    const anonSlug = await findAnonSlug(supabase, testSlug, verbose);

    return {
      profile_slug: result.profile_slug,
      anon_slug: anonSlug,
    };
  } catch (err) {
    if (verbose) {
      console.log("Error finding profile:", err);
    }
    return null;
  }
}

async function findAnonSlug(
  supabase: SupabaseClient,
  profileSlug: string,
  verbose: boolean
): Promise<string | null> {
  // The anon slug is typically derived from the profile data
  // We'll try a few common patterns, or it can be set via env var
  const possibleAnonSlugs = [
    process.env.TEST_ANON_SLUG,
    // Add other patterns if needed
  ].filter(Boolean) as string[];

  for (const slug of possibleAnonSlugs) {
    const { data, error } = await supabase.rpc("get_anon_profile", {
      anon_slug_param: slug,
    });

    if (!error && data) {
      const result = Array.isArray(data) ? data[0] : data;
      if (result?.anon_slug) {
        return result.anon_slug;
      }
    }
  }

  if (verbose) {
    console.log(`No anon_slug found for profile '${profileSlug}' - set TEST_ANON_SLUG env var`);
  }
  return null;
}

// Happy path: get_anon_profile with real slug
async function checkGetAnonProfileHappy(
  supabase: SupabaseClient,
  anonSlug: string,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const { data, error } = await supabase.rpc("get_anon_profile", {
      anon_slug_param: anonSlug,
    });

    if (error) {
      return {
        service: "rpc",
        name: "get_anon_profile (happy path)",
        status: "fail",
        latencyMs: Date.now() - startTime,
        message: `RPC error: ${error.message}`,
        details: { code: error.code, anonSlug },
      };
    }

    // Verify response has expected shape
    const result = Array.isArray(data) ? data[0] : data;
    if (result && result.anon_slug && result.anon_profile_data) {
      return {
        service: "rpc",
        name: "get_anon_profile (happy path)",
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: "Retrieved anon profile successfully",
        details: verbose
          ? { anonSlug: result.anon_slug, hasData: !!result.anon_profile_data }
          : undefined,
      };
    }

    return {
      service: "rpc",
      name: "get_anon_profile (happy path)",
      status: "warn",
      latencyMs: Date.now() - startTime,
      message: "Response missing expected fields",
      details: { data },
    };
  } catch (error) {
    return {
      service: "rpc",
      name: "get_anon_profile (happy path)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Happy path: get_public_profile with real slug
async function checkGetPublicProfileHappy(
  supabase: SupabaseClient,
  profileSlug: string,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const { data, error } = await supabase.rpc("get_public_profile", {
      profile_slug_param: profileSlug,
    });

    if (error) {
      return {
        service: "rpc",
        name: "get_public_profile (happy path)",
        status: "fail",
        latencyMs: Date.now() - startTime,
        message: `RPC error: ${error.message}`,
        details: { code: error.code, profileSlug },
      };
    }

    // Verify response has expected shape
    const result = Array.isArray(data) ? data[0] : data;
    if (result && result.profile_slug && result.profile_data) {
      return {
        service: "rpc",
        name: "get_public_profile (happy path)",
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: "Retrieved public profile successfully",
        details: verbose
          ? {
              profileSlug: result.profile_slug,
              hasData: !!result.profile_data,
              firstName: result.first_name,
            }
          : undefined,
      };
    }

    return {
      service: "rpc",
      name: "get_public_profile (happy path)",
      status: "warn",
      latencyMs: Date.now() - startTime,
      message: "Response missing expected fields",
      details: { data },
    };
  } catch (error) {
    return {
      service: "rpc",
      name: "get_public_profile (happy path)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Happy path: get_public_profile_by_id with real UUID
async function checkGetPublicProfileByIdHappy(
  supabase: SupabaseClient,
  profileId: string,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const { data, error } = await supabase.rpc("get_public_profile_by_id", {
      profile_id_param: profileId,
    });

    if (error) {
      return {
        service: "rpc",
        name: "get_public_profile_by_id (happy path)",
        status: "fail",
        latencyMs: Date.now() - startTime,
        message: `RPC error: ${error.message}`,
        details: { code: error.code, profileId },
      };
    }

    // Verify response has expected shape
    const result = Array.isArray(data) ? data[0] : data;
    if (result && result.profile_data) {
      return {
        service: "rpc",
        name: "get_public_profile_by_id (happy path)",
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: "Retrieved profile by ID successfully",
        details: verbose
          ? {
              profileSlug: result.profile_slug,
              hasData: !!result.profile_data,
            }
          : undefined,
      };
    }

    return {
      service: "rpc",
      name: "get_public_profile_by_id (happy path)",
      status: "warn",
      latencyMs: Date.now() - startTime,
      message: "Response missing expected fields",
      details: { data },
    };
  } catch (error) {
    return {
      service: "rpc",
      name: "get_public_profile_by_id (happy path)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Error handling: get_anon_profile with nonexistent slug
async function checkGetAnonProfileNotFound(
  supabase: SupabaseClient,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const fakeSlug = "__health_check_nonexistent__";

  try {
    const { data, error } = await supabase.rpc("get_anon_profile", {
      anon_slug_param: fakeSlug,
    });

    // Expected: empty result (not an error)
    if (!error) {
      const isEmpty =
        data === null || (Array.isArray(data) && data.length === 0);
      return {
        service: "rpc",
        name: "get_anon_profile (not found)",
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: isEmpty
          ? "Returns empty for nonexistent slug"
          : "Function invoked successfully",
        details: verbose ? { fakeSlug, resultType: typeof data } : undefined,
      };
    }

    return {
      service: "rpc",
      name: "get_anon_profile (not found)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: `Unexpected error: ${error.message}`,
      details: { code: error.code },
    };
  } catch (error) {
    return {
      service: "rpc",
      name: "get_anon_profile (not found)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Error handling: get_public_profile with nonexistent slug
async function checkGetPublicProfileNotFound(
  supabase: SupabaseClient,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const fakeSlug = "__health_check_nonexistent__";

  try {
    const { data, error } = await supabase.rpc("get_public_profile", {
      profile_slug_param: fakeSlug,
    });

    // Expected: empty result (not an error)
    if (!error) {
      const isEmpty =
        data === null || (Array.isArray(data) && data.length === 0);
      return {
        service: "rpc",
        name: "get_public_profile (not found)",
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: isEmpty
          ? "Returns empty for nonexistent slug"
          : "Function invoked successfully",
        details: verbose ? { fakeSlug, resultType: typeof data } : undefined,
      };
    }

    return {
      service: "rpc",
      name: "get_public_profile (not found)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: `Unexpected error: ${error.message}`,
      details: { code: error.code },
    };
  } catch (error) {
    return {
      service: "rpc",
      name: "get_public_profile (not found)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Error handling: get_public_profile_by_id with null UUID
async function checkGetPublicProfileByIdNotFound(
  supabase: SupabaseClient,
  verbose: boolean
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const nullUuid = "00000000-0000-0000-0000-000000000000";

  try {
    const { data, error } = await supabase.rpc("get_public_profile_by_id", {
      profile_id_param: nullUuid,
    });

    // Expected: empty result (not an error)
    if (!error) {
      const isEmpty =
        data === null || (Array.isArray(data) && data.length === 0);
      return {
        service: "rpc",
        name: "get_public_profile_by_id (not found)",
        status: "pass",
        latencyMs: Date.now() - startTime,
        message: isEmpty
          ? "Returns empty for nonexistent UUID"
          : "Function invoked successfully",
        details: verbose ? { nullUuid, resultType: typeof data } : undefined,
      };
    }

    return {
      service: "rpc",
      name: "get_public_profile_by_id (not found)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: `Unexpected error: ${error.message}`,
      details: { code: error.code },
    };
  } catch (error) {
    return {
      service: "rpc",
      name: "get_public_profile_by_id (not found)",
      status: "fail",
      latencyMs: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
