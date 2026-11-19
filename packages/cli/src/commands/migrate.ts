import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { ValidationError } from "../lib/errors";
import { info, success, warning } from "../lib/logger";
import {
  readConfig,
  readRawConfig,
  upsertKiraRegistry,
  getRegistryUrl,
  findConfigFile,
  type RawComponentsConfig,
} from "../lib/config";
import { fetchItem } from "../core/install/client";
import { installNpmDeps, readConsumerPackage } from "../core/install/deps";
import { migrateCnSource } from "../core/migrate/cn-codemod";
import { COMPONENTS_SCHEMA_URL } from "../core/registry/build";
import { DEFAULT_REGISTRY_URL, type RegistryItemPayload } from "../lib/schemas";
import type { MigrateOptions } from "../types";

const LEGACY_CN_SPECIFIERS = [
  "@/lib/cn",
  "@/lib/cn.ts",
  "@/utils/cn",
  "@/helpers/cn",
  "clsx",
  "tailwind-merge",
];

interface ImportRewrite {
  file: string;
  from: string;
  to: string;
}

interface DivergentComponent {
  name: string;
  changedFiles: number;
}

async function collectSourceFiles(dir: string, out: string[]): Promise<void> {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".git" ||
      entry.name === "dist"
    )
      continue;

    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectSourceFiles(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

/**
 * Detect legacy `cn` imports (clsx / tailwind-merge / @/lib/cn) that the
 * native codemod will rewrite to the `cn` npm package.
 */
async function planCnRewrites(sourceDir: string): Promise<ImportRewrite[]> {
  const files: string[] = [];

  await collectSourceFiles(sourceDir, files);

  const rewrites: ImportRewrite[] = [];

  for (const file of files) {
    const content = await readFile(file, "utf-8");

    for (const specifier of LEGACY_CN_SPECIFIERS) {
      if (
        content.includes(`from "${specifier}"`) ||
        content.includes(`from '${specifier}'`)
      ) {
        rewrites.push({
          file: relative(process.cwd(), file),
          from: specifier,
          to: "cn",
        });
      }
    }
  }

  return rewrites;
}

async function countChangedFiles(
  cwd: string,
  item: RegistryItemPayload,
): Promise<number> {
  let changed = 0;

  for (const registryFile of item.files ?? []) {
    if (
      !registryFile.path.endsWith(".tsx") &&
      !registryFile.path.endsWith(".ts")
    )
      continue;

    const localPath = resolve(cwd, registryFile.path);
    let localContent: string;

    try {
      localContent = await readFile(localPath, "utf-8");
    } catch {
      continue;
    }

    if (localContent.trim() !== registryFile.content.trim()) changed += 1;
  }

  return changed;
}

/** Compare local component copies with the published registry. Never modifies anything. */
async function findDivergentComponents(
  options: MigrateOptions,
): Promise<DivergentComponent[]> {
  const ctx = {
    cwd: options.cwd,
    registries: readConfig(options.cwd)?.registries,
  };

  const componentsDir = resolve(options.cwd, "src", "components", "ui");
  let localNames: string[];

  try {
    localNames = (await readdir(componentsDir)).filter((n) =>
      n.endsWith(".tsx"),
    );
  } catch {
    return [];
  }

  const divergent: DivergentComponent[] = [];

  for (const file of localNames) {
    const name = file.replace(/\.tsx$/, "");

    if (name === "index" || name === "registry") continue;

    let item: RegistryItemPayload;

    try {
      item = await fetchItem(`@kira-kit/${name}`, ctx);
    } catch {
      continue;
    }

    const changed = await countChangedFiles(options.cwd, item);

    if (changed > 0) divergent.push({ name, changedFiles: changed });
  }

  return divergent;
}

interface MigrationFacts {
  utilsAlias: string;
  hadLegacyRegistryUrl: boolean;
  alreadyHasNamespace: boolean;
  legacyAlias: boolean;
  legacySchema: boolean;
}

function configFacts(raw: RawComponentsConfig | null): MigrationFacts {
  const aliases: Record<string, string> = raw?.aliases ?? {};
  const schema = raw?.$schema ?? "";

  return {
    utilsAlias:
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- migrate reads legacy/possibly-invalid components.json raw; field guards are the boundary parse
      typeof aliases.utils === "string" ? aliases.utils : "@/lib/utils",
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- legacy registryUrl may be any JSON value; only a string counts as present
    hadLegacyRegistryUrl: typeof raw?.registryUrl === "string",
    alreadyHasNamespace: "@kira-kit" in (raw?.registries ?? {}),
    legacyAlias: aliases.lib === "@/lib/cn" || aliases.lib === "@/lib",
    legacySchema: schema.includes("ui.shadcn.com"),
  };
}

interface MigrationPlan {
  configPath: string;
  raw: RawComponentsConfig | null;
  facts: MigrationFacts;
  cnRewrites: ImportRewrite[];
}

async function planMigration(options: MigrateOptions): Promise<MigrationPlan> {
  const configPath = findConfigFile(options.cwd);

  if (!configPath) {
    throw new ValidationError(
      "No components.json found.",
      "Run `kira-kit init` first to generate one.",
    );
  }

  const raw = await readRawConfig(options.cwd);
  const facts = configFacts(raw);
  const sourceDir = resolve(options.cwd, "src");
  let sourceDirExists = true;

  try {
    await stat(sourceDir);
  } catch {
    sourceDirExists = false;
  }

  const cnRewrites = sourceDirExists ? await planCnRewrites(sourceDir) : [];

  return { configPath, raw, facts, cnRewrites };
}

function printDryRun(facts: MigrationFacts, cnRewrites: ImportRewrite[]): void {
  console.log("Dry run — no files will be modified:\n");

  if (facts.hadLegacyRegistryUrl) {
    console.log(
      `  components.json: remove "registryUrl" (legacy), add "registries['@kira-kit']"`,
    );
  } else if (facts.alreadyHasNamespace) {
    console.log("  components.json: already up to date");
  } else {
    console.log(`  components.json: add "registries['@kira-kit']"`);
  }

  if (facts.legacyAlias) {
    console.log(
      `  components.json: update aliases.lib to "${facts.utilsAlias}"`,
    );
  }

  if (facts.legacySchema) {
    console.log(
      `  components.json: replace the legacy $schema/style with kira values`,
    );
  }

  console.log(`  rewrite cn imports and calls to the \`cn\` npm package`);

  for (const rewrite of cnRewrites) {
    console.log(`  ${rewrite.file}: "${rewrite.from}" → "${rewrite.to}"`);
  }

  console.log("\nApply with `kira-kit migrate` (no --dry-run).");
}

/** Drop legacy keys from a raw config; returns whether anything changed. */
function normalizeLegacyKeys(
  updated: RawComponentsConfig,
  facts: MigrationFacts,
): boolean {
  let changed = false;

  if (facts.hadLegacyRegistryUrl) {
    delete updated.registryUrl;
    changed = true;
  }

  if (facts.legacySchema) {
    updated.$schema = COMPONENTS_SCHEMA_URL;
    updated.style = "kira";
    changed = true;
  }

  return changed;
}

/** components.json: legacy registryUrl → registries map (idempotent). */
async function updateRegistryConfig(
  options: MigrateOptions,
  configPath: string,
  raw: RawComponentsConfig | null,
  facts: MigrationFacts,
): Promise<void> {
  if (
    !facts.hadLegacyRegistryUrl &&
    facts.alreadyHasNamespace &&
    !facts.legacySchema
  ) {
    info("components.json already has the @kira-kit registry (nothing to do)");

    return;
  }

  // SAFETY: hadLegacyRegistryUrl was set by `typeof raw.registryUrl === "string"`,
  // so the legacy value is a string at this point.
  const url = facts.hadLegacyRegistryUrl
    ? (raw?.registryUrl as string)
    : (getRegistryUrl(options.cwd) ?? DEFAULT_REGISTRY_URL);

  upsertKiraRegistry(
    options.cwd,
    url.endsWith("/{name}.json")
      ? url
      : `${url.replace(/\/$/, "")}/{name}.json`,
  );

  // SAFETY: this is components.json, user-owned and shape-unstable; we only
  // touch the legacy keys and stringify the rest back verbatim.
  const updated = JSON.parse(
    await readFile(resolve(configPath), "utf-8"),
  ) as RawComponentsConfig;

  if (normalizeLegacyKeys(updated, facts)) {
    await writeFile(
      resolve(configPath),
      JSON.stringify(updated, null, 2) + "\n",
      "utf-8",
    );
  }

  success("components.json updated (@kira-kit registry namespace)");
}

/** Native cn codemod: legacy imports/calls → the `cn` npm package. */
async function applyCnMigration(
  options: MigrateOptions,
  cnRewrites: ImportRewrite[],
): Promise<void> {
  let rewritten = 0;

  for (const rewrite of cnRewrites) {
    const fullPath = resolve(process.cwd(), rewrite.file);
    const content = await readFile(fullPath, "utf-8");

    await writeFile(fullPath, migrateCnSource(content), "utf-8");
    rewritten += 1;
  }

  if (rewritten === 0) {
    info("No legacy cn imports found");

    return;
  }

  success(
    `Rewrote ${rewritten} file${rewritten === 1 ? "" : "s"} to the cn package`,
  );

  const pkg = readConsumerPackage(options.cwd);
  const hasCn = Object.hasOwn(pkg.dependencies ?? {}, "cn");

  if (!hasCn) {
    await installNpmDeps(options.cwd, ["cn"], { yes: options.yes });
  }
}

/** Report divergent components (never auto-modify). */
async function reportDivergence(options: MigrateOptions): Promise<void> {
  if (options.yes) return;

  info("Checking local components against the registry…");

  const divergent = await findDivergentComponents(options);

  if (divergent.length === 0) {
    success("All local components match the registry");

    return;
  }

  warning(
    `${divergent.length} component${divergent.length === 1 ? "" : "s"} differ from the registry:`,
  );

  for (const item of divergent) {
    console.log(
      `  ${item.name} (${item.changedFiles} file${item.changedFiles === 1 ? "" : "s"})`,
    );
  }

  console.log("\nReview and update individually with:");
  console.log(
    `  kira-kit add <name> --diff   # e.g. kira-kit add ${divergent[0].name} --diff`,
  );
}

export async function migrateProject(options: MigrateOptions): Promise<number> {
  const { configPath, raw, facts, cnRewrites } = await planMigration(options);

  if (options.dryRun) {
    printDryRun(facts, cnRewrites);

    return 0;
  }

  await updateRegistryConfig(options, configPath, raw, facts);
  await applyCnMigration(options, cnRewrites);
  await reportDivergence(options);

  return 0;
}
