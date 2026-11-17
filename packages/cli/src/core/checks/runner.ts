import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Finding, SourceFile } from "./types";
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
  registryMetadata,
  baseUiOnly,
  cnSource,
];

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

export function runChecks(options: CheckRunOptions): CheckRunResult {
  const { repoRoot } = options;

  const indexCssPath = join(repoRoot, "src/index.css");
  const indexCss = existsSync(indexCssPath)
    ? readFileSync(indexCssPath, "utf-8")
    : "";

  const itemMeta = loadItemMeta(repoRoot);

const SKIP_FILES = new Set(["registry", "content-keys", "index", "prop-guards"]);

  const defaultDirs: Array<[string, string]> = [
    [join(repoRoot, "src/components/ui"), "ui/"],
    [join(repoRoot, "src/hooks"), "hooks/"],
  ];

  const files: SourceFile[] = [];
  if (options.paths.length > 0) {
    for (const path of options.paths) {
      const abs = join(repoRoot, path);
      const prefix = abs.includes(join("src", "components", "ui"))
        ? "ui/"
        : "hooks/";
      if (existsSync(abs)) {
        for (const entry of readdirSync(abs)) {
          if (!/\.(tsx|ts)$/.test(entry)) continue;
          const name = entry.replace(/\.(tsx|ts)$/, "");
          if (SKIP_FILES.has(name)) continue;
          files.push({
            name: `${prefix}${name}`,
            path: join(abs, entry),
            content: readFileSync(join(abs, entry), "utf-8"),
          });
        }
      }
    }
  } else {
    for (const [dir, prefix] of defaultDirs) {
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
  }

  const ctx = { indexCss, items: itemMeta };

  const allFindings: Finding[] = [];
  let suppressed = 0;

  for (const file of files) {
    const fileFindings: Finding[] = [];
    for (const check of CHECKS) {
      fileFindings.push(...check(file, ctx));
    }
    const { errors, suppressions } = parseSuppressions(file.content, file.name);
    const valid = errors.filter((e) => e.checkId === "suppression" && e.severity === "error");
    const kept = fileFindings.filter(
      (finding) => !isSuppressed(finding, suppressions),
    );
    suppressed += fileFindings.length - kept.length;
    allFindings.push(
      ...kept,
      ...valid,
      ...unusedSuppressions(kept, suppressions, file.name),
    );
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

function loadItemMeta(
  repoRoot: string,
): Map<string, { dependencies: string[]; registryDependencies: string[]; files: string[]; description: string; categories: string[] }> {
  const metaByKey = new Map();
  // Registry file → the check-lookup prefix for its items ("ui/button" etc.).
  const registryFiles: Array<[string, string]> = [
    [join(repoRoot, "src/components/ui/registry.json"), "ui"],
    [join(repoRoot, "src/hooks/registry.json"), "hooks"],
    [join(repoRoot, "src/themes/registry.json"), "theme"],
  ];
  for (const [registryFile, prefix] of registryFiles) {
    if (!existsSync(registryFile)) continue;
    try {
      // SAFETY: these registry.json files are kira-kit's own, hand-maintained
      // sources; every field the metadata checks read is present or optional
      // per the schema, and a malformed file is skipped by the catch below.
      const data = JSON.parse(readFileSync(registryFile, "utf-8")) as RegistryIndex;
      for (const item of data.items ?? []) {
        const meta = {
          dependencies: item.dependencies ?? [],
          registryDependencies: item.registryDependencies ?? [],
          files: (item.files ?? []).map((f) =>
            typeof f === "string" ? f : f.path,
          ),
          description: item.description ?? "",
          categories: item.categories ?? [],
        };
        // Key by item name and prefixed name so lookups work for both plain
        // and "ui/button"-style naming schemes.
        metaByKey.set(item.name, meta);
        metaByKey.set(`${prefix}/${item.name}`, meta);
      }
    } catch {
      // Missing/invalid registry files make metadata checks skip, not crash.
    }
  }
  return metaByKey;
}

export function formatFindings(
  result: CheckRunResult,
  format: "pretty" | "json" | "github",
): string {
  if (format === "json") {
    return JSON.stringify(result, null, 2);
  }
  if (format === "github") {
    return result.findings
      .map((f) => {
        const level = f.severity === "error" ? "error" : "warning";
        const props = [
          `file=${f.file.replace(/^ui\//, "src/components/ui/").replace(/^hooks\//, "src/hooks/")}${f.line ? `,line=${f.line}` : ""}`,
          `title=${f.checkId}`,
        ].join(",");
        return `::${level} ${props}::${f.message}`;
      })
      .join("\n");
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
