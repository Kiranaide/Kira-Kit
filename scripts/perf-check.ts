import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { preview } from "vite";

interface BudgetUrl {
  slug: string;
  path: string;
}

interface BudgetConfig {
  urls: BudgetUrl[];
  modes: ("mobile" | "desktop")[];
  runs: number;
  thresholds: {
    performance: number;
    accessibility: number;
    "best-practices": number;
    seo: number;
  };
  metrics: {
    lcpMs: number;
    tbtMs: number;
    cls: number;
  };
  resourceBudgets: {
    initialJsGzipKb: number;
    initialCssGzipKb: number;
  };
}

interface LighthouseAudit {
  id: string;
  title: string;
  score: number | null;
  numericValue?: number;
  displayValue?: string;
}

interface LighthouseReport {
  categories: Record<string, { score: number | null; title: string }>;
  audits: Record<string, LighthouseAudit>;
}

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function detectChromePath(): string | undefined {
  const fromEnv = process.env.CHROME_PATH;

  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  return CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
}

function pct(score: number | null | undefined): number {
  return Math.round((score ?? 0) * 100);
}

function pickMedian(runs: { raw: string; report: LighthouseReport }[]): {
  raw: string;
  report: LighthouseReport;
} {
  const sorted = [...runs].sort((left, right) => {
    const leftPerf = pct(left.report.categories.performance?.score);
    const rightPerf = pct(right.report.categories.performance?.score);

    if (leftPerf !== rightPerf) return leftPerf - rightPerf;

    const leftLcp =
      left.report.audits["largest-contentful-paint"]?.numericValue ?? 0;

    const rightLcp =
      right.report.audits["largest-contentful-paint"]?.numericValue ?? 0;

    return leftLcp - rightLcp;
  });

  const middle = sorted[Math.floor(sorted.length / 2)];

  if (!middle) throw new Error("No Lighthouse runs collected.");

  return middle;
}

async function runSingleAudit(
  url: string,
  mode: "mobile" | "desktop",
  chromePath: string | undefined,
): Promise<{ raw: string; report: LighthouseReport }> {
  const args = [
    "bunx",
    "lighthouse",
    url,
    "--output=json",
    "--output-path=stdout",
    "--quiet",
    "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
  ];

  if (mode === "desktop") {
    args.push("--preset=desktop");
  }

  const env = chromePath
    ? { ...process.env, CHROME_PATH: chromePath }
    : { ...process.env };

  const child = Bun.spawn(args, { env, stdout: "pipe", stderr: "pipe" });

  const [raw, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);

  if (exitCode !== 0 || !raw.trim().startsWith("{")) {
    throw new Error(
      `Lighthouse failed (${exitCode}) for ${url} [${mode}]:\n${stderr.slice(0, 800)}`,
    );
  }

  // SAFETY: Lighthouse `--output=json` emits a valid JSON report matching LighthouseReport.
  const report = JSON.parse(raw) as LighthouseReport;

  return { raw, report };
}

async function checkInitialAssetBudgets(
  budget: BudgetConfig["resourceBudgets"],
): Promise<string[]> {
  const failures: string[] = [];
  const assetsDir = resolve("dist/assets");
  const files = await readdir(assetsDir);

  const entryJs = files.find(
    (name) => name.startsWith("index-") && name.endsWith(".js"),
  );

  const entryCss = files.find(
    (name) => name.startsWith("index-") && name.endsWith(".css"),
  );

  if (entryJs) {
    const gzKb =
      gzipSync(await readFile(join(assetsDir, entryJs))).length / 1024;

    if (gzKb > budget.initialJsGzipKb) {
      failures.push(
        `Entry JS ${entryJs} is ${gzKb.toFixed(1)} KB gzip (budget ${budget.initialJsGzipKb} KB)`,
      );
    }
  }

  if (entryCss) {
    const gzKb =
      gzipSync(await readFile(join(assetsDir, entryCss))).length / 1024;

    if (gzKb > budget.initialCssGzipKb) {
      failures.push(
        `Entry CSS ${entryCss} is ${gzKb.toFixed(1)} KB gzip (budget ${budget.initialCssGzipKb} KB)`,
      );
    }
  }

  return failures;
}

function parseCliOptions(argv: string[]) {
  let outDir = "perf/final";
  let skipBuild = false;
  let runsOverride: number | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--out" && argv[index + 1]) {
      outDir = argv[index + 1] ?? outDir;
      index += 1;
    } else if (token === "--skip-build") {
      skipBuild = true;
    } else if (token === "--runs" && argv[index + 1]) {
      runsOverride = Number(argv[index + 1]);
      index += 1;
    }
  }

  return { outDir: resolve(outDir), skipBuild, runsOverride };
}

interface EvaluationResult {
  row: string;
  violations: string[];
}

function collectMetricViolations(
  label: string,
  lcpMs: number,
  tbtMs: number,
  cls: number,
  metrics: BudgetConfig["metrics"],
): string[] {
  const violations: string[] = [];

  if (lcpMs > metrics.lcpMs) {
    violations.push(
      `${label}: LCP ${Math.round(lcpMs)}ms > ${metrics.lcpMs}ms`,
    );
  }

  if (tbtMs > metrics.tbtMs) {
    violations.push(
      `${label}: TBT ${Math.round(tbtMs)}ms > ${metrics.tbtMs}ms`,
    );
  }

  if (cls > metrics.cls) {
    violations.push(`${label}: CLS ${cls.toFixed(3)} > ${metrics.cls}`);
  }

  return violations;
}

function auditNumeric(report: LighthouseReport, id: string): number {
  return report.audits[id]?.numericValue ?? 0;
}

function evaluateReport(
  label: string,
  report: LighthouseReport,
  budget: BudgetConfig,
): EvaluationResult {
  const perf = pct(report.categories.performance?.score);
  const a11y = pct(report.categories.accessibility?.score);
  const bp = pct(report.categories["best-practices"]?.score);
  const seo = pct(report.categories.seo?.score);
  const lcpMs = auditNumeric(report, "largest-contentful-paint");
  const tbtMs = auditNumeric(report, "total-blocking-time");
  const cls = auditNumeric(report, "cumulative-layout-shift");

  const categoryChecks: [string, number, number][] = [
    ["Performance", perf, budget.thresholds.performance],
    ["Accessibility", a11y, budget.thresholds.accessibility],
    ["Best Practices", bp, budget.thresholds["best-practices"]],
    ["SEO", seo, budget.thresholds.seo],
  ];

  const violations = collectMetricViolations(
    label,
    lcpMs,
    tbtMs,
    cls,
    budget.metrics,
  );

  for (const [name, actual, min] of categoryChecks) {
    if (actual < min) violations.push(`${label}: ${name} ${actual} < ${min}`);
  }

  const row = `| \`${label}\` | ${perf} | ${a11y} | ${bp} | ${seo} | ${Math.round(lcpMs)}ms | ${Math.round(tbtMs)}ms | ${cls.toFixed(3)} |`;

  return { row, violations };
}

async function runBuildIfNeeded(skipBuild: boolean): Promise<void> {
  if (skipBuild) return;

  const build = Bun.spawn(["bun", "run", "build"], {
    stdout: "inherit",
    stderr: "inherit",
  });

  if ((await build.exited) !== 0) process.exit(1);
}

async function auditTarget(
  origin: string,
  target: BudgetUrl,
  mode: "mobile" | "desktop",
  runsPerTarget: number,
  outDir: string,
  chromePath: string | undefined,
  budget: BudgetConfig,
) {
  const collected: { raw: string; report: LighthouseReport }[] = [];

  for (let run = 0; run < runsPerTarget; run += 1) {
    collected.push(
      await runSingleAudit(`${origin}${target.path}`, mode, chromePath),
    );
  }

  const median = pickMedian(collected);

  await writeFile(
    join(outDir, `${target.slug}-${mode}.json`),
    median.raw,
    "utf8",
  );

  return evaluateReport(`${target.path} [${mode}]`, median.report, budget);
}

async function main(): Promise<void> {
  const { outDir, skipBuild, runsOverride } = parseCliOptions(
    process.argv.slice(2),
  );

  // SAFETY: lighthouse-budget.json is checked into the repo root with this exact schema.
  const budget = JSON.parse(
    await readFile(resolve("lighthouse-budget.json"), "utf8"),
  ) as BudgetConfig;

  await runBuildIfNeeded(skipBuild);

  const failures = await checkInitialAssetBudgets(budget.resourceBudgets);
  const runsPerTarget = runsOverride ?? budget.runs;
  const chromePath = detectChromePath();

  await mkdir(outDir, { recursive: true });
  const server = await preview({ preview: { host: "127.0.0.1", port: 0 } });
  const rows: string[] = [];

  try {
    const origin = server.resolvedUrls?.local[0]?.replace(/\/$/, "");

    if (!origin) throw new Error("Failed to start Vite preview server.");

    for (const target of budget.urls) {
      for (const mode of budget.modes) {
        const result = await auditTarget(
          origin,
          target,
          mode,
          runsPerTarget,
          outDir,
          chromePath,
          budget,
        );

        rows.push(result.row);
        failures.push(...result.violations);
      }
    }
  } finally {
    await server.close();
  }

  const summary = [
    "# Lighthouse Performance Check",
    "",
    "| Target | Perf | A11y | BP | SEO | LCP | TBT | CLS |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...rows,
    "",
  ].join("\n");

  await writeFile(join(outDir, "summary.md"), summary, "utf8");
  console.log(summary);

  if (failures.length > 0) {
    console.error("Performance budget violations:");

    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }

    process.exit(1);
  }
}

await main();
