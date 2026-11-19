import { dirname, resolve } from "node:path";
import { readConfig } from "../../lib/config";
import { ValidationError } from "../../lib/errors";
import { warning } from "../../lib/logger";
import type { RegistryItemPayload } from "../../lib/schemas";
import type { ComponentsConfig } from "../../types";
import { resolveTree } from "./client";
import { mergeCssVars } from "./css-vars";
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
}

function transformContent(
  file: { path: string; content: string },
  item: RegistryItemPayload,
  aliases: ImportAliases,
  config: ComponentsConfig,
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
  config: ComponentsConfig,
  options: InstallOptions,
): string {
  if (item.type === "registry:style") {
    const cssDir = dirname(
      resolve(options.cwd, config.tailwind?.css ?? "src/index.css"),
    );

    const base = file.path.replaceAll("\\", "/").split("/").pop() ?? file.path;

    return resolve(cssDir, file.target ?? base);
  }

  return targetForFile(file, item.type, roots, options.cwd, options.path);
}

function buildWriteRequests(
  items: RegistryItemPayload[],
  config: ComponentsConfig,
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

function applyCssVars(
  items: RegistryItemPayload[],
  config: ComponentsConfig,
  options: InstallOptions,
): boolean {
  const withVars = items.filter((item) => item.cssVars);

  if (withVars.length === 0 || options.dryRun) return false;

  const cssPath = config.tailwind?.css;

  if (!cssPath) {
    warning("No tailwind.css path in components.json — skipped CSS variables.");

    return false;
  }

  let changed = false;

  for (const item of withVars) {
    if (mergeCssVars(resolve(options.cwd, cssPath), item.cssVars ?? {})) {
      changed = true;
    }
  }

  return changed;
}

export interface InstallPlan {
  items: RegistryItemPayload[];
  planned: PlannedWrite[];
  npmDeps: string[];
  config: ComponentsConfig;
}

/** Resolve the item tree and plan writes without touching disk or network installs. */
export async function planInstall(
  input: InstallInput,
  options: InstallOptions,
): Promise<InstallPlan> {
  const config = readConfig(options.cwd);

  if (!config) {
    throw new ValidationError(
      "No components.json found.",
      "Run 'kira-kit init' first.",
    );
  }

  const items =
    input.items ??
    (await resolveTree(input.addresses ?? [], {
      cwd: options.cwd,
      registries: config.registries,
    }));

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
  const cssVarsApplied = applyCssVars(items, config, options);

  return {
    items: items.map((item) => item.name),
    written: outcome.written,
    skipped: outcome.skipped,
    conflicts: outcome.conflicts,
    npmDeps,
    cssVarsApplied,
  };
}
