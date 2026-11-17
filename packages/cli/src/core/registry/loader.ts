import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  sourceRegistrySchema,
  type SourceRegistry,
  type SourceRegistryItem,
} from "../../lib/schemas";
import { ValidationError } from "../../lib/errors";

export interface LoadedRegistry {
  root: SourceRegistry;
  items: SourceRegistryItem[];
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

function collectItems(
  root: SourceRegistry,
  rootPath: string,
): SourceRegistryItem[] {
  const items: SourceRegistryItem[] = [];
  const seen = new Set<string>();

  for (const include of root.include ?? []) {
    const included = parseRegistryFile(
      join(dirname(rootPath), include),
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
    }
  }

  for (const item of root.items ?? []) {
    if (!seen.has(item.name)) {
      seen.add(item.name);
      items.push(item);
    }
  }

  return items;
}

/**
 * Load the root source registry and resolve its `include` list. The root
 * registry.json is the source of truth for metadata; shadcn build consumes
 * the same files.
 */
export function loadSourceRegistry(rootDir: string): LoadedRegistry {
  const rootPath = resolve(rootDir, "registry.json");

  const root = parseRegistryFile(
    rootPath,
    `source registry at ${rootPath}`,
    "Fix registry.json (and any included files) so it matches the shadcn registry schema.",
  );

  return { root, items: collectItems(root, rootPath) };
}
