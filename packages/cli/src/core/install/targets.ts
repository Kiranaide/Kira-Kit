import { dirname, join, resolve } from "node:path";
import ts from "typescript";
import { warning } from "../../lib/logger";
import type { ComponentsConfig } from "../../types";
import type { ImportAliases } from "./transform";

export const DEFAULT_ALIASES = {
  components: "@/components",
  ui: "@/components/ui",
  hooks: "@/hooks",
  lib: "@/lib",
  utils: "@/lib/utils",
} satisfies ImportAliases;

/** Absolute consumer directories for each alias root. */
export interface AliasRoots {
  components: string;
  ui: string;
  hooks: string;
  lib: string;
}

interface PathsConfig {
  baseUrl: string;
  /** [pattern, first target] pairs, longest pattern first. */
  patterns: Array<[string, string]>;
}

/** Read tsconfig paths (JSONC + extends handled by the TypeScript API). */
function readPaths(cwd: string): PathsConfig | null {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, "tsconfig.json");

  if (!configPath) return null;

  const raw = ts.readConfigFile(configPath, ts.sys.readFile);

  if (raw.error) return null;

  const parsed = ts.parseJsonConfigFileContent(
    raw.config,
    ts.sys,
    dirname(configPath),
  );

  const patterns: Array<[string, string]> = [];

  for (const [pattern, targets] of Object.entries(parsed.options.paths ?? {})) {
    if (targets[0]) patterns.push([pattern, targets[0]]);
  }

  if (patterns.length === 0) return null;

  patterns.sort((a, b) => b[0].length - a[0].length);

  return { baseUrl: parsed.options.baseUrl ?? dirname(configPath), patterns };
}

function applyPattern(
  alias: string,
  pattern: string,
  target: string,
): string | null {
  if (pattern === alias) return target;

  if (pattern.endsWith("/*") && alias.startsWith(pattern.slice(0, -1))) {
    const rest = alias.slice(pattern.length - 1);

    return target.endsWith("*") ? target.slice(0, -1) + rest : target;
  }

  return null;
}

function aliasToDir(
  alias: string,
  cwd: string,
  paths: PathsConfig | null,
): string {
  if (!alias.startsWith("@")) return resolve(cwd, alias);

  if (paths) {
    for (const [pattern, target] of paths.patterns) {
      const mapped = applyPattern(alias, pattern, target);

      if (mapped) return join(paths.baseUrl, mapped);
    }
  }

  return resolve(cwd, "src", alias.replace(/^@\/?/, ""));
}

export function importAliases(config: ComponentsConfig | null): ImportAliases {
  const configured = config?.aliases ?? {};

  return {
    components: configured.components ?? DEFAULT_ALIASES.components,
    ui: configured.ui ?? DEFAULT_ALIASES.ui,
    hooks: configured.hooks ?? DEFAULT_ALIASES.hooks,
    lib: configured.lib ?? DEFAULT_ALIASES.lib,
    utils: configured.utils ?? DEFAULT_ALIASES.utils,
  };
}

/** Resolve alias roots from tsconfig paths; fall back to @/ → src/. */
export function resolveAliasRoots(
  cwd: string,
  config: ComponentsConfig | null,
): AliasRoots {
  const paths = readPaths(cwd);

  if (!paths) {
    warning("No tsconfig path aliases found — assuming @/ maps to src/.");
  }

  const aliases = importAliases(config);

  return {
    components: aliasToDir(aliases.components, cwd, paths),
    ui: aliasToDir(aliases.ui, cwd, paths),
    hooks: aliasToDir(aliases.hooks, cwd, paths),
    lib: aliasToDir(aliases.lib, cwd, paths),
  };
}

export interface TargetFile {
  path: string;
  target?: string;
}

/** Absolute write target for a payload file, per item type. */
export function targetForFile(
  file: TargetFile,
  itemType: string | undefined,
  roots: AliasRoots,
  cwd: string,
  pathOverride?: string,
): string {
  if (file.target) return resolve(cwd, file.target);

  const posix = file.path.replaceAll("\\", "/");
  const base = posix.split("/").pop() ?? posix;

  if (itemType === "registry:lib") {
    return join(roots.lib, posix.replace(/^(src\/)?lib\//, ""));
  }

  if (itemType === "registry:hook") return join(roots.hooks, base);

  if (itemType === "registry:ui" || itemType === undefined) {
    return pathOverride ? join(cwd, pathOverride, base) : join(roots.ui, base);
  }

  return resolve(cwd, posix);
}
