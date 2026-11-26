import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readConfig } from "../../lib/config";
import { extractImports } from "../registry/extract";
import { loadItemMetaMap, loadKitCss } from "../registry/loader";
import type { CheckContext, Finding, ItemMeta, SourceFile } from "./types";
import {
  isSuppressed,
  parseSuppressions,
  unusedSuppressions,
} from "./suppressions";
import { importsMatchDeps } from "./imports-deps";
import { deadAnimate } from "./dead-animate";
import { dataSlotAndCva } from "./data-slot-cva";
import { reducedMotion } from "./reduced-motion";
import { targetSize } from "./target-size";
import { rawColors } from "./raw-colors";
import { layoutTransitions } from "./layout-transitions";
import { arbitraryValues } from "./arbitrary-values";
import { spacingScale } from "./spacing-scale";
import { registryMetadata } from "./registry-metadata";
import { baseUiOnly } from "./base-ui-only";
import { cnSource } from "./cn-source";
import { libResolution } from "./lib-resolution";
import { checkRegistryGraph } from "./registry-graph";

const CHECKS = [
  importsMatchDeps,
  deadAnimate,
  dataSlotAndCva,
  reducedMotion,
  targetSize,
  rawColors,
  layoutTransitions,
  arbitraryValues,
  spacingScale,
  registryMetadata,
  baseUiOnly,
  cnSource,
  libResolution,
];

const SKIP_FILES = new Set([
  "registry",
  "content-keys",
  "index",
  "prop-guards",
]);

export interface CheckRunOptions {
  repoRoot: string;
  /** Explicit paths to check; defaults to src/components/ui + src/hooks. */
  paths: string[];
  ci: boolean;
}

export interface CheckRunResult {
  findings: Finding[];
  suppressed: number;
  ci: boolean;
  /** Number of findings that count as failures under the current mode. */
  failing: number;
  filesChecked: number;
}

function prefixForPath(abs: string): string {
  if (abs.includes(join("src", "components", "ui"))) return "ui/";

  if (abs.includes(join("src", "pages"))) return "pages/";

  if (abs.includes(join("src", "lib"))) return "lib/";

  return "hooks/";
}

function sourceDirs(
  repoRoot: string,
  paths: string[],
): Array<[string, string]> {
  if (paths.length === 0) {
    return [
      [join(repoRoot, "src/components/ui"), "ui/"],
      [join(repoRoot, "src/hooks"), "hooks/"],
      [join(repoRoot, "src/lib"), "lib/"],
    ];
  }

  return paths.map((path) => {
    const abs = join(repoRoot, path);

    return [abs, prefixForPath(abs)];
  });
}

function collectSourceFiles(
  repoRoot: string,
  paths: string[],
  items: Map<string, ItemMeta>,
): SourceFile[] {
  const files: SourceFile[] = [];

  for (const [dir, prefix] of sourceDirs(repoRoot, paths)) {
    if (!existsSync(dir)) continue;

    if (prefix === "lib/") {
      // Lib items may bundle subdirectories (camera/). Only scan files a
      // registry:lib item actually ships; docs-only modules stay unchecked.
      const walk = (rel: string): void => {
        for (const entry of readdirSync(join(dir, rel), {
          withFileTypes: true,
        })) {
          const relPath = rel ? `${rel}/${entry.name}` : entry.name;

          if (entry.isDirectory()) {
            walk(relPath);

            continue;
          }

          if (!/\.(tsx|ts)$/.test(entry.name)) continue;

          const name = `lib/${relPath.replace(/\.(tsx|ts)$/, "")}`;

          if (!items.has(name)) continue;

          files.push({
            name,
            path: join(dir, relPath),
            content: readFileSync(join(dir, relPath), "utf-8"),
          });
        }
      };

      walk("");

      continue;
    }

    for (const entry of readdirSync(dir)) {
      if (!/\.(tsx|ts)$/.test(entry)) continue;

      const name = entry.replace(/\.(tsx|ts)$/, "");

      if (SKIP_FILES.has(name)) continue;

      files.push({
        name: `${prefix}${name}`,
        path: join(dir, entry),
        content: readFileSync(join(dir, entry), "utf-8"),
      });
    }
  }

  return files;
}

interface FileCheckResult {
  findings: Finding[];
  suppressed: number;
}

function checkFile(file: SourceFile, ctx: CheckContext): FileCheckResult {
  const parsed: SourceFile = file.imports
    ? file
    : { ...file, imports: extractImports(file.content, file.path) };

  const fileFindings = CHECKS.flatMap((check) => check(parsed, ctx));
  const { errors, suppressions } = parseSuppressions(file.content, file.name);

  const valid = errors.filter(
    (e) => e.checkId === "suppression" && e.severity === "error",
  );

  const kept = fileFindings.filter(
    (finding) => !isSuppressed(finding, suppressions),
  );

  return {
    findings: [
      ...kept,
      ...valid,
      ...unusedSuppressions(fileFindings, suppressions, file.name),
    ],
    suppressed: fileFindings.length - kept.length,
  };
}

export function runChecks(options: CheckRunOptions): CheckRunResult {
  const { repoRoot } = options;

  const ctx: CheckContext = {
    indexCss: loadKitCss(repoRoot),
    items: loadItemMetaMap(repoRoot),
    iconLibrary: readConfig(repoRoot)?.iconLibrary,
  };

  const files = collectSourceFiles(repoRoot, options.paths, ctx.items);
  const allFindings: Finding[] = [];
  let suppressed = 0;

  for (const file of files) {
    const result = checkFile(file, ctx);

    suppressed += result.suppressed;
    allFindings.push(...result.findings);
  }

  if (options.paths.length === 0) {
    allFindings.push(...checkRegistryGraph(ctx.items));
  }

  const failing = options.ci
    ? allFindings.length
    : allFindings.filter((f) => f.severity === "error").length;

  return {
    findings: allFindings,
    suppressed,
    ci: options.ci,
    failing,
    filesChecked: files.length,
  };
}

function githubAnnotation(f: Finding): string {
  const level = f.severity === "error" ? "error" : "warning";
  const lineProp = f.line ? `,line=${f.line}` : "";

  const filePath = f.file
    .replace(/^ui\//, "src/components/ui/")
    .replace(/^hooks\//, "src/hooks/")
    .replace(/^lib\//, "src/lib/")
    .replace(/^pages\//, "src/pages/components/");

  const props = [`file=${filePath}${lineProp}`, `title=${f.checkId}`].join(",");

  return `::${level} ${props}::${f.message}`;
}

export function formatFindings(
  result: CheckRunResult,
  format: "pretty" | "json" | "github",
): string {
  if (format === "json") {
    return JSON.stringify(result, null, 2);
  }

  if (format === "github") {
    return result.findings.map(githubAnnotation).join("\n");
  }

  const lines: string[] = [];

  for (const finding of result.findings) {
    const at = finding.line ? `:${finding.line}` : "";

    lines.push(
      `  ${finding.severity === "error" ? "✖" : "⚠"} [${finding.checkId}] ${finding.file}${at} — ${finding.message}`,
    );
  }

  if (result.suppressed > 0) {
    lines.push(`  (${result.suppressed} finding(s) suppressed)`);
  }

  return lines.join("\n");
}
