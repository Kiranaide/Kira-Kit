import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { KiraConfig } from "../types";
import {
  CONFIG_FILENAME,
  DEFAULT_REGISTRY_URL,
  KIRA_NAMESPACE,
  LEGACY_CONFIG_FILENAME,
  kiraConfigSchema,
} from "./schemas";

export {
  CONFIG_FILENAME,
  DEFAULT_REGISTRY_URL,
  KIRA_NAMESPACE,
  LEGACY_CONFIG_FILENAME,
};

export function findConfigFile(cwd: string): string | null {
  const path = join(cwd, CONFIG_FILENAME);

  return existsSync(path) ? path : null;
}

export function findLegacyConfigFile(cwd: string): string | null {
  const path = join(cwd, LEGACY_CONFIG_FILENAME);

  return existsSync(path) ? path : null;
}

export function readConfig(cwd: string): KiraConfig | null {
  const configPath = findConfigFile(cwd);

  if (!configPath) return null;

  try {
    const content = readFileSync(configPath, "utf-8");

    return kiraConfigSchema.parse(JSON.parse(content));
  } catch {
    return null;
  }
}

/** Theme section inside kira-kit.json. */
export interface RawKiraThemeConfig {
  preset?: string;
  primary?: string;
  baseColor?: string;
  font?: string;
  fontDisplay?: string;
  fontMono?: string;
  fontPreset?: string;
  radius?: string;
  surface?: string;
}

/**
 * kira-kit.json read raw from disk. The file is user-owned; unknown keys are
 * preserved verbatim on write, so only the keys kira-kit reads are typed here.
 */
export interface RawKiraConfig {
  $schema?: string;
  css?: string;
  rsc?: boolean;
  iconLibrary?: string;
  theme?: RawKiraThemeConfig;
  aliases?: Record<string, string>;
  registries?: Record<string, string>;
}

/** Legacy pre-0.6.0 `components.json` shape accepted by `kira-kit migrate`. */
export interface LegacyComponentsConfig extends RawKiraConfig {
  style?: string;
  tsx?: boolean;
  baseColor?: string;
  font?: string;
  fontDisplay?: string;
  fontMono?: string;
  fontPreset?: string;
  radius?: string;
  surface?: string;
  tailwind?: {
    config?: string;
    css?: string;
    baseColor?: string;
    cssVariables?: boolean;
    prefix?: string;
  };
  menuColor?: string;
  menuAccent?: string;
  registryUrl?: string;
}

/** Read kira-kit.json without zod defaults; preserves unknown keys on write. */
export function readRawConfig(cwd: string): RawKiraConfig | null {
  const configPath = findConfigFile(cwd);

  if (!configPath) return null;

  try {
    return JSON.parse(readFileSync(configPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Idempotently register the @kira-kit namespace in kira-kit.json.
 * Never clobbers other registries or unknown keys.
 */
export function upsertKiraRegistry(
  cwd: string,
  url: string = DEFAULT_REGISTRY_URL,
): boolean {
  const config = readRawConfig(cwd);
  const next: RawKiraConfig = config ?? {};

  const registries = {
    ...next.registries,
  };

  // Never clobber: an existing @kira-kit entry is the user's choice.
  if (registries[KIRA_NAMESPACE]) return false;
  registries[KIRA_NAMESPACE] = url;
  next.registries = registries;
  writeFileSync(
    join(cwd, CONFIG_FILENAME),
    JSON.stringify(next, null, 2) + "\n",
    "utf-8",
  );

  return true;
}

/** Resolve the @kira-kit registry base URL (without {name}.json suffix). */
export function getRegistryUrl(cwd: string): string {
  const config = readConfig(cwd);
  const url = config?.registries?.[KIRA_NAMESPACE];

  if (!url) return DEFAULT_REGISTRY_URL.replace("/{name}.json", "");

  return url.replace("/{name}.json", "");
}

/** Merge a patch into kira-kit.json, preserving unknown keys. */
export function updateRawConfig(
  cwd: string,
  patch: Partial<RawKiraConfig>,
): void {
  const next = { ...readRawConfig(cwd), ...patch };

  writeFileSync(
    join(cwd, CONFIG_FILENAME),
    JSON.stringify(next, null, 2) + "\n",
    "utf-8",
  );
}

/** Merge a patch into kira-kit.json's `theme` object, preserving other fields. */
export function updateThemeConfig(
  cwd: string,
  patch: Partial<RawKiraThemeConfig>,
): void {
  const raw = readRawConfig(cwd);
  const merged = { ...raw?.theme, ...patch };

  const theme: RawKiraThemeConfig = Object.fromEntries(
    Object.entries(merged).filter(([, value]) => value !== undefined),
  );

  updateRawConfig(cwd, { theme });
}
