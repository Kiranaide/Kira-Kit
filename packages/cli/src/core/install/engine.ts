import { dirname, resolve } from "node:path";
import { findLegacyConfigFile, readConfig } from "../../lib/config";
import { ValidationError } from "../../lib/errors";
import { warning } from "../../lib/logger";
import type { RegistryItemPayload } from "../../lib/schemas";
import type { KiraConfig } from "../../types";
import { createClientContext, resolveTree } from "./client";
import { applyItemStyles, type ApplyItemStylesResult } from "../css/stylesheet";
import {
  installNpmDeps,
  planNpmDeps,
  readConsumerPackage,
  type DepInstaller,
} from "./deps";
import { rewriteIconImports } from "./icons";
import {
  resolveAliasRoots,
  targetForFile,
  importAliases,
  type AliasRoots,
} from "./targets";
import {
  prependUseClient,
  rewriteImports,
  type ImportAliases,
} from "./transform";
import {
  applyWrites,
  planWrites,
  type PlannedWrite,
  type WriteRequest,
} from "./write";

export interface InstallOptions {
  cwd: string;
  yes?: boolean;
  overwrite?: boolean;
  dryRun?: boolean;
  /** --path override for ui item targets. */
  path?: string;
  skipDeps?: boolean;
  installer?: DepInstaller;
}

export interface InstallInput {
  addresses?: string[];
  /** In-memory payloads (generated themes, init assets) — skips the network. */
  items?: RegistryItemPayload[];
}

export interface InstallResult {
  items: string[];
  written: string[];
  skipped: string[];
  conflicts: string[];
  npmDeps: string[];
  cssVarsApplied: boolean;
  cssRulesApplied: boolean;
}

function transformContent(
  file: { path: string; content: string },
  item: RegistryItemPayload,
  aliases: ImportAliases,
  config: KiraConfig,
): string {
  const content = file.content.replaceAll("\r\n", "\n");

  if (!/\.(tsx|ts)$/.test(file.path)) return content;

  const rewritten = rewriteImports(content, aliases);

  const iconized =
    config.iconLibrary === "lucide" ? rewriteIconImports(rewritten) : rewritten;

  const needsClient =
    config.rsc === true &&
    (item.type === "registry:ui" || item.type === "registry:hook");

  return needsClient ? prependUseClient(iconized) : iconized;
}

function fileTarget(
  file: { path: string; target?: string },
  item: RegistryItemPayload,
  roots: AliasRoots,
  config: KiraConfig,
  options: InstallOptions,
): string {
  if (item.type === "registry:style") {
    const cssDir = dirname(resolve(options.cwd, config.css ?? "src/index.css"));

    const base = file.path.replaceAll("\\", "/").split("/").pop() ?? file.path;

    return resolve(cssDir, file.target ?? base);
  }

  return targetForFile(file, item.type, roots, options.cwd, options.path);
}

function buildWriteRequests(
  items: RegistryItemPayload[],
  config: KiraConfig,
  options: InstallOptions,
): WriteRequest[] {
  const roots = resolveAliasRoots(options.cwd, config);
  const aliases = importAliases(config);
  const requests: WriteRequest[] = [];

  for (const item of items) {
    for (const file of item.files ?? []) {
      requests.push({
        target: fileTarget(file, item, roots, config, options),
        content: transformContent(file, item, aliases, config),
        item: item.name,
      });
    }
  }

  return requests;
}

function applyStyles(
  items: RegistryItemPayload[],
  config: KiraConfig,
  options: InstallOptions,
): ApplyItemStylesResult {
  const styled = items.filter((item) => item.cssVars || item.css);

  if (styled.length === 0 || options.dryRun) {
    return { cssVarsApplied: false, cssRulesApplied: false };
  }

  const cssPath = config.css;

  if (!cssPath) {
    warning("No css path in kira-kit.json — skipped item styles.");

    return { cssVarsApplied: false, cssRulesApplied: false };
  }

  return applyItemStyles(resolve(options.cwd, cssPath), styled);
}

export interface InstallPlan {
  items: RegistryItemPayload[];
  planned: PlannedWrite[];
  npmDeps: string[];
  config: KiraConfig;
}

/** Resolve the item tree and plan writes without touching disk or network installs. */
export async function planInstall(
  input: InstallInput,
  options: InstallOptions,
): Promise<InstallPlan> {
  const config = readConfig(options.cwd);

  if (!config) {
    if (findLegacyConfigFile(options.cwd)) {
      throw new ValidationError(
        "No kira-kit.json found (detected legacy components.json).",
        "Run 'kira-kit migrate' to convert it to kira-kit.json, or 'kira-kit init' to start fresh.",
      );
    }

    throw new ValidationError(
      "No kira-kit.json found.",
      "Run 'kira-kit init' first.",
    );
  }

  const items =
    input.items ??
    (await resolveTree(
      input.addresses ?? [],
      createClientContext(options.cwd, config.registries),
    ));

  if (items.length === 0) {
    throw new ValidationError(
      "No registry items to install.",
      "Pass item names, e.g. 'kira-kit add button'.",
    );
  }

  const npmDeps = planNpmDeps(
    items,
    readConsumerPackage(options.cwd),
    config.iconLibrary,
  );

  const requests = buildWriteRequests(items, config, options);

  return { items, planned: planWrites(requests), npmDeps, config };
}

/**
 * Native install: resolve the item tree, install missing npm deps, write
 * transformed files, and merge cssVars into the consumer's global CSS.
 */
export async function installItems(
  input: InstallInput,
  options: InstallOptions,
): Promise<InstallResult> {
  const { items, planned, npmDeps, config } = await planInstall(input, options);

  if (!options.dryRun && !options.skipDeps) {
    await installNpmDeps(
      options.cwd,
      npmDeps,
      { yes: options.yes },
      options.installer,
    );
  }

  const outcome = await applyWrites(planned, options);

  const { cssVarsApplied, cssRulesApplied } = applyStyles(
    items,
    config,
    options,
  );

  return {
    items: items.map((item) => item.name),
    written: outcome.written,
    skipped: outcome.skipped,
    conflicts: outcome.conflicts,
    npmDeps,
    cssVarsApplied,
    cssRulesApplied,
  };
}
