import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
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
    ];
  }

  return paths.map((path) => {
    const abs = join(repoRoot, path);

    return [abs, prefixForPath(abs)];
  });
}

function collectSourceFiles(repoRoot: string, paths: string[]): SourceFile[] {
  const files: SourceFile[] = [];

  for (const [dir, prefix] of sourceDirs(repoRoot, paths)) {
    if (!existsSync(dir)) continue;

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
  const fileFindings = CHECKS.flatMap((check) => check(file, ctx));
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
  const indexCssPath = join(repoRoot, "src/index.css");

  const indexCss = existsSync(indexCssPath)
    ? readFileSync(indexCssPath, "utf-8")
    : "";

  const ctx: CheckContext = { indexCss, items: loadItemMeta(repoRoot) };
  const files = collectSourceFiles(repoRoot, options.paths);
  const allFindings: Finding[] = [];
  let suppressed = 0;

  for (const file of files) {
    const result = checkFile(file, ctx);

    suppressed += result.suppressed;
    allFindings.push(...result.findings);
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

/** Subset of a registry item that metadata checks read from registry.json. */
interface RegistryIndexItem {
  name: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: Array<string | { path: string }>;
  description?: string;
  categories?: string[];
}

/** Shape of a source registry.json file as parsed for metadata checks. */
interface RegistryIndex {
  items?: RegistryIndexItem[];
}

function readRegistryItems(registryFile: string): RegistryIndexItem[] {
  if (!existsSync(registryFile)) return [];

  try {
    // SAFETY: these registry.json files are kira-kit's own, hand-maintained
    // sources; every field the metadata checks read is present or optional
    // per the schema, and a malformed file is skipped by the catch below.
    const data = JSON.parse(
      readFileSync(registryFile, "utf-8"),
    ) as RegistryIndex;

    return data.items ?? [];
  } catch {
    // Missing/invalid registry files make metadata checks skip, not crash.
    return [];
  }
}

function toItemMeta(item: RegistryIndexItem): ItemMeta {
  return {
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- the shadcn registry schema allows files as strings or {path} objects; typeof discriminates that union
    files: (item.files ?? []).map((f) => (typeof f === "string" ? f : f.path)),
    description: item.description ?? "",
    categories: item.categories ?? [],
  };
}

function loadItemMeta(repoRoot: string): Map<string, ItemMeta> {
  const metaByKey = new Map<string, ItemMeta>();

  // Registry file → the check-lookup prefix for its items ("ui/button" etc.).
  const registryFiles: Array<[string, string]> = [
    [join(repoRoot, "src/components/ui/registry.json"), "ui"],
    [join(repoRoot, "src/hooks/registry.json"), "hooks"],
    [join(repoRoot, "src/themes/registry.json"), "theme"],
  ];

  for (const [registryFile, prefix] of registryFiles) {
    for (const item of readRegistryItems(registryFile)) {
      const meta = toItemMeta(item);

      // Key by item name and prefixed name so lookups work for both plain
      // and "ui/button"-style naming schemes.
      metaByKey.set(item.name, meta);
      metaByKey.set(`${prefix}/${item.name}`, meta);
    }
  }

  return metaByKey;
}

function githubAnnotation(f: Finding): string {
  const level = f.severity === "error" ? "error" : "warning";
  const lineProp = f.line ? `,line=${f.line}` : "";

  const filePath = f.file
    .replace(/^ui\//, "src/components/ui/")
    .replace(/^hooks\//, "src/hooks/")
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
