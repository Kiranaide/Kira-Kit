/**
 * Maintainer bootstrap: regenerates the source registry JSONs with files,
 * dependencies, and registryDependencies extracted programmatically.
 * Curated titles/descriptions/categories come from a metadata JSON and are
 * left intact on reruns. Usage: `bun run scripts/scaffold-sources.ts`.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractImports, packageNameOf } from "../src/core/registry/extract";
import { libItemNameFor } from "../src/core/registry/lib-items";
import type { SourceRegistryItem } from "../src/lib/schemas";

const REPO_ROOT = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../../..",
);

const METADATA_PATH = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "registry-metadata.json",
);

/** npm packages every UI item implicitly relies on but should NOT declare. */
const IMPLICIT_DEPS = new Set(["react", "react-dom", "@types/react"]);

/** Kira Kit support modules that are embedded, not registry items. */
const SUPPORT_FILES = new Set(["prop-guards", "content-keys"]);

type Metadata = Record<
  string,
  { title: string; description: string; categories: string[] }
>;

function loadMetadata(): Metadata {
  if (!existsSync(METADATA_PATH)) return {};

  // SAFETY: registry-metadata.json is a curated maintainer file whose entries are exactly title/description/categories triples.
  return JSON.parse(readFileSync(METADATA_PATH, "utf-8")) as Metadata;
}

interface ScaffoldItem {
  name: string;
  type: "registry:ui" | "registry:hook";
  title: string;
  description: string;
  categories: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  files: Array<{ path: string; type: "registry:ui" | "registry:hook" }>;
  css?: string;
  cssVars?: SourceRegistryItem["cssVars"];
  docs?: string;
}

/** Curated fields the scaffold does not compute; carried over on reruns. */
function loadExistingItems(dir: string): Map<string, SourceRegistryItem> {
  const path = join(dir, "registry.json");

  if (!existsSync(path)) return new Map();

  // SAFETY: registry.json is this script's own output, validated by the
  // registry loader on every build; only curated fields are read back.
  const parsed = JSON.parse(readFileSync(path, "utf-8")) as {
    items?: SourceRegistryItem[];
  };

  return new Map((parsed.items ?? []).map((item) => [item.name, item]));
}

/** Curated fields the scaffold does not compute; carried over on reruns. */
function curatedFields(
  prior: SourceRegistryItem | undefined,
): Pick<ScaffoldItem, "css" | "cssVars" | "docs"> {
  const curated: Pick<ScaffoldItem, "css" | "cssVars" | "docs"> = {};

  if (prior?.css !== undefined) curated.css = prior.css;

  if (prior?.cssVars !== undefined) curated.cssVars = prior.cssVars;

  if (prior?.docs !== undefined) curated.docs = prior.docs;

  return curated;
}

function buildItem(
  entry: string,
  dir: string,
  type: "registry:ui" | "registry:hook",
  filesGlob: (name: string, ext: string) => string,
  metadata: Metadata,
  existing: Map<string, SourceRegistryItem>,
): ScaffoldItem {
  const name = entry.replace(/\.(tsx|ts)$/, "");
  const ext = entry.slice(name.length);
  const source = readFileSync(join(dir, entry), "utf-8");
  const { external, internal, lib } = extractImports(source, entry);

  const dependencies = [
    ...new Set(
      external
        .map((imp) => packageNameOf(imp.specifier))
        .filter((pkg) => !IMPLICIT_DEPS.has(pkg)),
    ),
  ].sort();

  const registryDependencies = [
    ...new Set([
      ...internal
        .map((imp) => imp.specifier.replace(/.*\//, ""))
        .filter((dep) => !SUPPORT_FILES.has(dep))
        .map((dep) => `@kira-kit/${dep}`),
      ...lib.flatMap((imp) => {
        const item = libItemNameFor(imp.specifier);

        return item ? [`@kira-kit/${item}`] : [];
      }),
    ]),
  ].sort();

  const supportFileNames = internal
    .map((imp) => imp.specifier.replace(/.*\//, "").replace(/\.(tsx|ts)?$/, ""))
    .filter((dep) => SUPPORT_FILES.has(dep));

  // shadcn registry schema requires file entries as objects with a path
  // (relative to the declaring registry.json) and a per-file item type.
  const files: Array<{ path: string; type: "registry:ui" | "registry:hook" }> =
    [{ path: filesGlob(name, ext), type }];

  for (const dep of supportFileNames) {
    files.push({ path: `${dep}.ts`, type });
  }

  const meta = metadata[name];

  const item: Omit<ScaffoldItem, "files"> = {
    name,
    type,
    title: meta?.title ?? name,
    description:
      meta?.description ?? `TODO: write a real description for ${name}.`,
    categories: meta?.categories ?? [],
  };

  if (dependencies.length > 0) item.dependencies = dependencies;

  if (registryDependencies.length > 0)
    item.registryDependencies = registryDependencies;

  return {
    ...item,
    files: [...new Map(files.map((f) => [f.path, f])).values()].sort((a, b) =>
      a.path.localeCompare(b.path),
    ),
    ...curatedFields(existing.get(name)),
  };
}

async function buildItems(
  dir: string,
  type: "registry:ui" | "registry:hook",
  filesGlob: (name: string, ext: string) => string,
): Promise<ScaffoldItem[]> {
  const metadata = loadMetadata();
  const existing = loadExistingItems(dir);
  const entries = readdirSync(dir).filter((f) => /\.tsx?$/.test(f));
  const items: ScaffoldItem[] = [];

  for (const entry of entries) {
    const name = entry.replace(/\.(tsx|ts)$/, "");

    if (SUPPORT_FILES.has(name)) continue;

    items.push(buildItem(entry, dir, type, filesGlob, metadata, existing));
  }

  items.sort((a, b) => a.name.localeCompare(b.name));

  return items;
}

async function main() {
  const uiItems = await buildItems(
    join(REPO_ROOT, "src/components/ui"),
    "registry:ui",
    (name, ext) => `${name}${ext}`,
  );

  const hookItems = await buildItems(
    join(REPO_ROOT, "src/hooks"),
    "registry:hook",
    (name, ext) => `${name}${ext}`,
  );

  const uiRegistry = {
    items: uiItems,
  };

  const hooksRegistry = {
    items: hookItems,
  };

  writeFileSync(
    join(REPO_ROOT, "src/components/ui/registry.json"),
    JSON.stringify(uiRegistry, null, 2) + "\n",
    "utf-8",
  );
  writeFileSync(
    join(REPO_ROOT, "src/hooks/registry.json"),
    JSON.stringify(hooksRegistry, null, 2) + "\n",
    "utf-8",
  );
  console.log(
    `Wrote ${uiItems.length} ui items and ${hookItems.length} hook items.`,
  );
}

await main();
