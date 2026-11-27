import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readConfig } from "../../lib/config";
import { RegistryError, ValidationError } from "../../lib/errors";
import { toItemAddress } from "../../lib/namespace";
import {
  DEFAULT_REGISTRY_URL,
  KIRA_NAMESPACE,
  registryIndexSchema,
  registryItemPayloadSchema,
  type RegistryIndex,
  type RegistryIndexEntry,
  type RegistryItemPayload,
} from "../../lib/schemas";

export interface ResolvedAddress {
  kind: "url" | "file";
  location: string;
}

export interface ClientContext {
  cwd: string;
  registries?: Record<string, string>;
}

/** Build a ClientContext from a working directory and optional pre-read registries. */
export function createClientContext(
  cwd: string = process.cwd(),
  registries?: Record<string, string>,
): ClientContext {
  return {
    cwd,
    registries: registries ?? readConfig(cwd)?.registries,
  };
}

function classifyLocation(location: string, cwd: string): ResolvedAddress {
  if (location.startsWith("http://") || location.startsWith("https://")) {
    return { kind: "url", location };
  }

  if (location.startsWith("file://")) {
    return { kind: "file", location: fileURLToPath(location) };
  }

  return { kind: "file", location: resolve(cwd, location) };
}

function fromTemplate(
  template: string,
  name: string,
  cwd: string,
): ResolvedAddress {
  // file:// URLs percent-encode the placeholder braces.
  const normalized = template.replaceAll("%7Bname%7D", "{name}");

  const location = normalized.includes("{name}")
    ? normalized.replaceAll("{name}", name)
    : `${normalized.replace(/\/+$/, "")}/${name}.json`;

  return classifyLocation(location, cwd);
}

/** Resolve an item address (@ns/name, URL, file://, or local path). */
export function resolveAddress(
  address: string,
  ctx: ClientContext,
): ResolvedAddress {
  const normalized = toItemAddress(address);

  if (!normalized.startsWith("@")) return classifyLocation(normalized, ctx.cwd);

  const slash = normalized.indexOf("/");
  const ns = normalized.slice(0, slash);
  const name = normalized.slice(slash + 1);

  if (slash < 0 || !name) {
    throw new ValidationError(
      `Invalid registry address "${address}".`,
      "Use @namespace/name, a URL, or a local path.",
    );
  }

  const template =
    ctx.registries?.[ns] ??
    (ns === KIRA_NAMESPACE ? DEFAULT_REGISTRY_URL : undefined);

  if (!template) {
    throw new ValidationError(
      `Unknown registry namespace "${ns}".`,
      `Add registries["${ns}"] to components.json, or pass a full URL.`,
    );
  }

  return fromTemplate(template, name, ctx.cwd);
}

/**
 * Resolve a registryDependency in the declaring item's namespace: bare names
 * inherit the parent's @ns (or become sibling files/URLs of the parent).
 */
export function dependencyAddress(
  dep: string,
  parentAddress: string,
  parent: ResolvedAddress,
): string {
  if (
    dep.startsWith("@") ||
    dep.startsWith("http://") ||
    dep.startsWith("https://") ||
    dep.startsWith("file://")
  ) {
    return dep;
  }

  if (dep.startsWith("./") || dep.startsWith("../")) {
    return parent.kind === "file"
      ? join(dirname(parent.location), dep)
      : new URL(dep, parent.location).href;
  }

  if (parentAddress.startsWith("@")) {
    return `${parentAddress.slice(0, parentAddress.indexOf("/"))}/${dep}`;
  }

  if (parent.kind === "url") {
    const url = new URL(parent.location);
    url.pathname = url.pathname.replace(/[^/]+$/, `${dep}.json`);

    return url.href;
  }

  return join(dirname(parent.location), `${dep}.json`);
}

async function loadText(address: ResolvedAddress): Promise<string> {
  if (address.kind === "file") return loadLocalText(address.location);

  let response: Response;

  try {
    response = await fetch(address.location);
  } catch {
    throw new RegistryError(
      `Could not reach ${address.location}`,
      "Check your internet connection and the registry URL in components.json.",
    );
  }

  if (!response.ok) {
    throw new RegistryError(
      `Registry request failed (HTTP ${response.status}) for ${address.location}`,
      "Verify the item name and your components.json registry URL.",
    );
  }

  return response.text();
}

function loadLocalText(location: string): string {
  if (!existsSync(location)) {
    throw new RegistryError(
      `Registry item not found at ${location}`,
      "Check the item name or the registry URL in components.json.",
    );
  }

  return readFileSync(location, "utf-8");
}

function parseJsonText<T>(text: string, label: string): T {
  try {
    // SAFETY: JSON.parse yields untyped JSON; callers immediately validate
    // with the matching zod schema before reading any field.
    return JSON.parse(text) as T;
  } catch {
    throw new RegistryError(
      `Could not parse registry JSON for "${label}".`,
      "The payload must be valid JSON produced by kira-kit build.",
    );
  }
}

function parseItemText(text: string, label: string): RegistryItemPayload {
  const parsed = registryItemPayloadSchema.safeParse(
    parseJsonText<RegistryItemPayload>(text, label),
  );

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    throw new RegistryError(
      `Invalid registry item payload for "${label}": ${issue?.message ?? "unknown error"}`,
      "Rebuild the registry with kira-kit build, or update kira-kit.",
    );
  }

  return parsed.data;
}

/** Fetch and validate a single built item payload. */
export async function fetchItem(
  address: string,
  ctx: ClientContext,
): Promise<RegistryItemPayload> {
  const resolved = resolveAddress(address, ctx);

  return parseItemText(await loadText(resolved), address);
}

/** Fetch the registry index (registry.json) for the @kira-kit namespace. */
export async function fetchIndex(
  ctx: ClientContext,
): Promise<RegistryIndexEntry[]> {
  const template = (
    ctx.registries?.[KIRA_NAMESPACE] ?? DEFAULT_REGISTRY_URL
  ).replaceAll("%7Bname%7D", "{name}");

  const base = template.includes("{name}")
    ? template.replace(/\/?\{name\}(\.json)?$/, "")
    : template.replace(/\/+$/, "");

  const location = `${base}/registry.json`;
  const text = await loadText(classifyLocation(location, ctx.cwd));

  const parsed = registryIndexSchema.safeParse(
    parseJsonText<RegistryIndex>(text, location),
  );

  if (!parsed.success) {
    throw new RegistryError(
      `Invalid registry index at ${location}`,
      "Rebuild the registry with kira-kit build.",
    );
  }

  return parsed.data.items ?? [];
}

/**
 * Depth-first resolve of items and their registryDependencies. Dependencies
 * come before dependents where possible; each resolved location is fetched
 * once. Circular deps (legal ESM, e.g. input ↔ field) are deduped, not fatal.
 */
export async function resolveTree(
  addresses: string[],
  ctx: ClientContext,
): Promise<RegistryItemPayload[]> {
  const byLocation = new Map<string, RegistryItemPayload>();
  const ordered: RegistryItemPayload[] = [];
  const inFlight = new Set<string>();

  const visit = async (address: string): Promise<void> => {
    const normalized = toItemAddress(address);
    const resolved = resolveAddress(normalized, ctx);

    if (byLocation.has(resolved.location) || inFlight.has(resolved.location)) {
      return;
    }

    inFlight.add(resolved.location);

    const item = parseItemText(await loadText(resolved), normalized);

    for (const dep of item.registryDependencies ?? []) {
      await visit(dependencyAddress(dep, normalized, resolved));
    }

    inFlight.delete(resolved.location);
    byLocation.set(resolved.location, item);
    ordered.push(item);
  };

  for (const address of addresses) await visit(address);

  return ordered;
}
