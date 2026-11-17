/**
 * Maintainer bootstrap: (re)generate the source registry JSONs
 * (src/components/ui/registry.json, src/hooks/registry.json) with files,
 * dependencies, and registryDependencies extracted programmatically.
 * Titles/descriptions/categories come from a metadata JSON file (curated);
 * the emitted files are hand-maintained afterwards — rerunning only refreshes
 * dep/file facts and leaves curated fields intact when they already exist.
 *
 * Usage (from packages/cli): bun run scripts/scaffold-sources.ts
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractImports, packageNameOf } from "../src/core/registry/extract";

const REPO_ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..");
const METADATA_PATH = resolve(fileURLToPath(new URL(".", import.meta.url)), "registry-metadata.json");

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
  return JSON.parse(readFileSync(METADATA_PATH, "utf-8")) as Metadata;
}

const VERSION_RANGES: Record<string, string> = {
  // majors that matter for consumers get explicit ranges; bare elsewhere
  "react-day-picker": "^10.0.0",
  "embla-carousel": "8.6.0",
  "embla-carousel-react": "^8.6.0",
  "react-resizable-panels": "4.16.0",
  "modern-monaco": "^0.4.2",
  "recharts": "^3.10.0",
  "date-fns": "^4.4.0",
  "@date-fns/tz": "^1.5.0",
};
void VERSION_RANGES;

async function buildItems(
  dir: string,
  type: "registry:ui" | "registry:hook",
  filesGlob: (name: string, ext: string) => string,
): Promise<unknown[]> {
  const metadata = loadMetadata();
  const entries = readdirSync(dir).filter((f) => /\.tsx?$/.test(f));
  const items: unknown[] = [];

  for (const entry of entries) {
    const name = entry.replace(/\.(tsx|ts)$/, "");
    const ext = entry.slice(name.length);
    if (SUPPORT_FILES.has(name)) continue;
    const source = readFileSync(join(dir, entry), "utf-8");
    const { external, internal } = extractImports(source, entry);

    const dependencies = [
      ...new Set(
        external
          .map((entry) => packageNameOf(entry.specifier))
          .filter((pkg) => !IMPLICIT_DEPS.has(pkg)),
      ),
    ].sort();

    const registryDependencies = [
      ...new Set(
        internal
          .map((entry) => entry.specifier.replace(/.*\//, ""))
          .filter((dep) => !SUPPORT_FILES.has(dep))
          .map((dep) => `@kira-kit/${dep}`),
      ),
    ].sort();

    const supportFileNames = internal
      .map((entry) => entry.specifier.replace(/.*\//, "").replace(/\.(tsx|ts)?$/, ""))
      .filter((dep) => SUPPORT_FILES.has(dep));

    // shadcn registry schema requires file entries as objects with a path
    // (relative to the declaring registry.json) and a per-file item type.
    const files: Array<{ path: string; type: "registry:ui" | "registry:hook" }> = [
      { path: filesGlob(name, ext), type },
    ];
    for (const dep of supportFileNames) {
      files.push({ path: `${dep}.ts`, type });
    }

    const meta = metadata[name];
    items.push({
      name,
      type,
      title: meta?.title ?? name,
      description: meta?.description ?? `TODO: write a real description for ${name}.`,
      categories: meta?.categories ?? [],
      ...(dependencies.length > 0 ? { dependencies } : {}),
      ...(registryDependencies.length > 0 ? { registryDependencies } : {}),
      files: [...new Map(files.map((f) => [f.path, f])).values()].sort((a, b) =>
        a.path.localeCompare(b.path),
      ),
    });
  }

  items.sort((a, b) => (a as { name: string }).name.localeCompare((b as { name: string }).name));
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
  console.log(`Wrote ${uiItems.length} ui items and ${hookItems.length} hook items.`);
}

await main();
