import { writeFile } from "fs/promises";
import { HealthCheckResult, HealthCheckReport } from "../types.js";

export function generateReport(
  results: HealthCheckResult[],
  startTime: number
): HealthCheckReport {
  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    warned: results.filter((r) => r.status === "warn").length,
    failed: results.filter((r) => r.status === "fail").length,
  };

  return {
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    summary,
    results,
  };
}

export async function writeReport(report: HealthCheckReport): Promise<void> {
  // Write JSON report
  await writeFile("report.json", JSON.stringify(report, null, 2));

  // Generate markdown summary
  const statusEmoji = (s: string) =>
    s === "pass" ? "\u2705" : s === "warn" ? "\u26a0\ufe0f" : "\u274c";

  const overallStatus =
    report.summary.failed > 0
      ? "\u274c FAILED"
      : report.summary.warned > 0
        ? "\u26a0\ufe0f PASSED WITH WARNINGS"
        : "\u2705 ALL PASSED";

  const md = `# Health Check Report

**Status**: ${overallStatus}
**Time**: ${report.timestamp}
**Duration**: ${report.durationMs}ms

## Summary

| Status | Count |
|--------|-------|
| \u2705 Passed | ${report.summary.passed} |
| \u26a0\ufe0f Warned | ${report.summary.warned} |
| \u274c Failed | ${report.summary.failed} |
| **Total** | ${report.summary.total} |

## Results

| Service | Check | Status | Latency | Message |
|---------|-------|--------|---------|---------|
${report.results
  .map(
    (r) =>
      `| ${r.service} | ${r.name} | ${statusEmoji(r.status)} | ${r.latencyMs}ms | ${r.message} |`
  )
  .join("\n")}

${
  report.summary.failed > 0
    ? `
## Failed Checks Details

${report.results
  .filter((r) => r.status === "fail")
  .map(
    (r) => `### ${r.service}: ${r.name}
- **Message**: ${r.message}
- **Details**: \`${JSON.stringify(r.details || {})}\`
`
  )
  .join("\n")}
`
    : ""
}
`;

  await writeFile("report.md", md);

  // Output to console
  console.log("\n" + "=".repeat(60));
  console.log("HEALTH CHECK RESULTS");
  console.log("=".repeat(60));
  console.log(
    `Total: ${report.summary.total} | Pass: ${report.summary.passed} | Warn: ${report.summary.warned} | Fail: ${report.summary.failed}`
  );
  console.log("-".repeat(60));

  for (const result of report.results) {
    const icon = statusEmoji(result.status);
    console.log(
      `${icon} [${result.service}] ${result.name}: ${result.message} (${result.latencyMs}ms)`
    );
  }

  console.log("=".repeat(60));
  console.log(`\nOverall: ${overallStatus}`);
}
