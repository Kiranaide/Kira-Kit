import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  sourceRegistrySchema,
  type SourceRegistry,
  type SourceRegistryItem,
} from "../../lib/schemas";
import { ValidationError } from "../../lib/errors";
import type { ItemMeta } from "../checks/types";

export interface LoadedRegistry {
  root: SourceRegistry;
  items: SourceRegistryItem[];
  /** Item name → absolute dir of the registry file that declared it. */
  origins: Map<string, string>;
}

function parseRegistryFile(
  filePath: string,
  label: string,
  hint: string,
): SourceRegistry {
  try {
    return sourceRegistrySchema.parse(
      JSON.parse(readFileSync(filePath, "utf-8")),
    );
  } catch (error) {
    throw new ValidationError(
      `Could not read ${label}: ${error instanceof Error ? error.message : String(error)}`,
      hint,
    );
  }
}

function collectItems(root: SourceRegistry, rootPath: string) {
  const items: SourceRegistryItem[] = [];
  const origins = new Map<string, string>();
  const seen = new Set<string>();

  for (const include of root.include ?? []) {
    const includePath = join(dirname(rootPath), include);

    const included = parseRegistryFile(
      includePath,
      `included registry ${include}`,
      "Every include must be a valid registry file with an items array.",
    );

    for (const item of included.items ?? []) {
      if (seen.has(item.name)) {
        throw new ValidationError(
          `Duplicate registry item "${item.name}" (from ${include}).`,
          "Item names must be unique across all included registries.",
        );
      }

      seen.add(item.name);
      items.push(item);
      origins.set(item.name, dirname(includePath));
    }
  }

  for (const item of root.items ?? []) {
    if (!seen.has(item.name)) {
      seen.add(item.name);
      items.push(item);
      origins.set(item.name, dirname(rootPath));
    }
  }

  return { items, origins };
}

/**
 * Load the root source registry and resolve its `include` list. The root
 * registry.json is the source of truth for metadata; the native build
 * consumes the same files.
 */
export function loadSourceRegistry(rootDir: string): LoadedRegistry {
  const rootPath = resolve(rootDir, "registry.json");

  const root = parseRegistryFile(
    rootPath,
    `source registry at ${rootPath}`,
    "Fix registry.json (and any included files) so it matches the registry schema.",
  );

  const { items, origins } = collectItems(root, rootPath);

  return { root, items, origins };
}

const TYPE_TO_PREFIX: Partial<Record<SourceRegistryItem["type"], string>> = {
  "registry:ui": "ui",
  "registry:hook": "hooks",
  "registry:lib": "lib",
  "registry:theme": "theme",
  "registry:block": "blocks",
  "registry:page": "pages",
};

/** Read the kit's combined CSS sources (`src/index.css` + `src/styles/kira-utilities.css`). */
export function loadKitCss(repoRoot: string): string {
  const parts: string[] = [];

  for (const rel of ["src/index.css", "src/styles/kira-utilities.css"]) {
    const full = join(repoRoot, rel);

    if (existsSync(full)) parts.push(readFileSync(full, "utf-8"));
  }

  return parts.join("\n");
}

function toItemMeta(item: SourceRegistryItem): ItemMeta {
  return {
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files: (item.files ?? []).map((file) => file.path),
    description: item.description,
    categories: item.categories ?? [],
  };
}

/**
 * Index all source registry items by plain name, prefixed key (`ui/button`,
 * `hooks/use-camera`, etc.), and shipped lib module subpath. Returns an empty
 * map when `registry.json` is absent so `kira-kit check` stays safe in consumer repos.
 */
export function loadItemMetaMap(repoRoot: string): Map<string, ItemMeta> {
  const metaByKey = new Map<string, ItemMeta>();

  if (!existsSync(resolve(repoRoot, "registry.json"))) return metaByKey;

  let loaded: LoadedRegistry;

  try {
    loaded = loadSourceRegistry(repoRoot);
  } catch {
    return metaByKey;
  }

  for (const item of loaded.items) {
    const meta = toItemMeta(item);
    const prefix = TYPE_TO_PREFIX[item.type];

    metaByKey.set(item.name, meta);

    if (prefix) metaByKey.set(`${prefix}/${item.name}`, meta);

    if (prefix === "lib") {
      for (const path of meta.files) {
        metaByKey.set(`lib/${path.replace(/\.(tsx|ts)$/, "")}`, meta);
      }
    }
  }

  return metaByKey;
}
