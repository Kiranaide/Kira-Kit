import { formatFindings, runChecks } from "../core/checks/runner";
import { error as logError, info } from "../lib/logger";
import { EXIT_CHECKS, EXIT_OK } from "../lib/errors";
import type { CheckOptions } from "../types";

export async function check(options: CheckOptions): Promise<number> {
  // Strict mode is opt-in: CI env vars alone shouldn't turn warnings into
  // failures (§8 — warnings are non-blocking heuristics).
  const ci = Boolean(options.ci);
  const format = options.json ? "json" : (options.format ?? "pretty");

  const result = runChecks({
    repoRoot: process.cwd(),
    paths: options.paths ?? [],
    ci,
  });

  if (format === "json") {
    console.log(formatFindings(result, "json"));
  } else if (format === "github") {
    console.log(formatFindings(result, "github"));
  } else {
    if (result.findings.length > 0) {
      console.log(`\n${formatFindings(result, "pretty")}\n`);
    }
    info(
      `${result.filesChecked} files checked — ${result.findings.length} finding(s)` +
        (ci ? " (CI mode: every unsuppressed finding fails)" : ""),
    );
  }

  if (result.failing > 0) {
    logError(
      ci
        ? `${result.failing} finding(s) must be fixed or suppressed with a reason (kira-kit check --ci).`
        : `${result.failing} error(s) found.`,
    );
    return EXIT_CHECKS;
  }
  return EXIT_OK;
}
