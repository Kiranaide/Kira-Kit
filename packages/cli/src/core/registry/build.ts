import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { z } from "zod";
import {
  componentsConfigSchema,
  registryItemPayloadSchema,
  sourceRegistrySchema,
  type RegistryItemPayload,
  type SourceRegistry,
  type SourceRegistryItem,
} from "../../lib/schemas";
import { buildBaseCss } from "../css/stylesheet";
import {
  deriveMotionCss,
  extractMotionAssets,
  type MotionAssets,
} from "./motion-css";
import { loadKitCss, type LoadedRegistry } from "./loader";

export const REGISTRY_SCHEMA_URL =
  "https://kira-kit.vercel.app/schema/registry.json";

export const REGISTRY_ITEM_SCHEMA_URL =
  "https://kira-kit.vercel.app/schema/registry-item.json";

export const COMPONENTS_SCHEMA_URL =
  "https://kira-kit.vercel.app/schema/components.json";

function itemPayload(
  repoRoot: string,
  item: SourceRegistryItem,
  baseDir: string,
  motion?: MotionAssets,
): RegistryItemPayload {
  const files = (item.files ?? []).map((file) => ({
    path: relative(repoRoot, join(baseDir, file.path)).replaceAll("\\", "/"),
    type: file.type ?? item.type,
    target: file.target,
    content: readFileSync(join(baseDir, file.path), "utf-8"),
  }));

  let css = item.css;

  if (motion) {
    const source = files
      .filter((file) => /\.(tsx|ts)$/.test(file.path))
      .map((file) => file.content)
      .join("\n");

    const derived = deriveMotionCss(source, motion, item.css);

    if (derived) css = css ? `${css}\n\n${derived}` : derived;
  }

  return {
    $schema: REGISTRY_ITEM_SCHEMA_URL,
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    categories: item.categories,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files,
    cssVars: item.cssVars,
    css,
    docs: item.docs,
  };
}

/** registry:style item shipping the kit base CSS + vendored utilities. */
export function kiraBasePayload(repoRoot: string): RegistryItemPayload {
  const indexCss = readFileSync(join(repoRoot, "src/index.css"), "utf-8");

  const utilities = readFileSync(
    join(repoRoot, "src/styles/kira-utilities.css"),
    "utf-8",
  );

  return {
    $schema: REGISTRY_ITEM_SCHEMA_URL,
    name: "kira-base",
    type: "registry:style",
    title: "Kira Base",
    description:
      "The kit's base stylesheet: Tailwind imports, responsive safelists, design tokens, and the vendored utility classes.",
    files: [
      {
        path: "kira-base.css",
        type: "registry:style",
        content: buildBaseCss(indexCss, "./kira-utilities.css"),
      },
      {
        path: "kira-utilities.css",
        type: "registry:style",
        content: utilities,
      },
    ],
  };
}

/** Inline every source item's file contents into built payloads. */
export function buildPayloads(
  repoRoot: string,
  loaded: LoadedRegistry,
): RegistryItemPayload[] {
  const motion = extractMotionAssets(loadKitCss(repoRoot));

  const payloads = loaded.items.map((item) =>
    itemPayload(
      repoRoot,
      item,
      loaded.origins.get(item.name) ?? repoRoot,
      motion,
    ),
  );

  payloads.push(kiraBasePayload(repoRoot));

  return payloads;
}

function indexEntry(payload: RegistryItemPayload) {
  return {
    ...payload,
    files: payload.files?.map((file) => ({
      path: file.path,
      type: file.type,
      target: file.target,
    })),
  };
}

type JsonDocument = RegistryItemPayload | z.core.JSONSchema.BaseSchema;

function writeJson(path: string, data: JsonDocument): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/** Write per-item payloads, the metadata index, and the published schemas. */
export function writeRegistryOutputs(
  repoRoot: string,
  outDir: string,
  root: SourceRegistry,
  payloads: RegistryItemPayload[],
): void {
  mkdirSync(outDir, { recursive: true });

  for (const payload of payloads) {
    const itemPath = join(outDir, `${payload.name}.json`);

    mkdirSync(dirname(itemPath), { recursive: true });
    writeJson(itemPath, payload);
  }

  writeJson(join(outDir, "registry.json"), {
    $schema: REGISTRY_SCHEMA_URL,
    name: root.name ?? "kira-kit",
    homepage: root.homepage,
    items: payloads.map(indexEntry),
  });

  const schemaDir = join(repoRoot, "public/schema");
  mkdirSync(schemaDir, { recursive: true });

  writeJson(
    join(schemaDir, "registry.json"),
    z.toJSONSchema(sourceRegistrySchema),
  );
  writeJson(
    join(schemaDir, "registry-item.json"),
    z.toJSONSchema(registryItemPayloadSchema),
  );
  writeJson(
    join(schemaDir, "components.json"),
    z.toJSONSchema(componentsConfigSchema),
  );
}
