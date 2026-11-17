import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ComponentsConfig } from "../types";
import { componentsConfigSchema, KIRA_NAMESPACE, DEFAULT_REGISTRY_URL } from "./schemas";

export { KIRA_NAMESPACE, DEFAULT_REGISTRY_URL };

export function findConfigFile(cwd: string): string | null {
  const path = join(cwd, "components.json");
  return existsSync(path) ? path : null;
}

export function readConfig(cwd: string): ComponentsConfig | null {
  const configPath = findConfigFile(cwd);
  if (!configPath) return null;
  try {
    const content = readFileSync(configPath, "utf-8");
    return componentsConfigSchema.parse(JSON.parse(content));
  } catch {
    return null;
  }
}

/**
 * components.json read raw from disk. The file is user-owned and
 * shape-unstable (shadcn owns its shape); unknown keys are preserved
 * verbatim on write, so only the keys kira-kit reads are typed here.
 */
export interface RawComponentsConfig {
  aliases?: Record<string, string>;
  registries?: Record<string, string>;
  /** Legacy pre-namespace registry URL (removed by `kira-kit migrate`). */
  registryUrl?: string;
}

/** Read components.json without zod defaults; preserves unknown keys on write. */
export function readRawConfig(cwd: string): RawComponentsConfig | null {
  const configPath = findConfigFile(cwd);
  if (!configPath) return null;
  try {
    return JSON.parse(readFileSync(configPath, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Idempotently register the @kira-kit namespace in components.json.
 * Never clobbers other registries or unknown keys.
 */
export function upsertKiraRegistry(
  cwd: string,
  url: string = DEFAULT_REGISTRY_URL,
): boolean {
  const config = readRawConfig(cwd);
  const next: RawComponentsConfig = config ?? {};
  const registries = {
    ...(next.registries ?? {}),
  };
  // Never clobber: an existing @kira-kit entry is the user's choice.
  if (registries[KIRA_NAMESPACE]) return false;
  registries[KIRA_NAMESPACE] = url;
  next.registries = registries;
  writeFileSync(
    join(cwd, "components.json"),
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
