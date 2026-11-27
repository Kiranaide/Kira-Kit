import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { ValidationError } from "../../lib/errors";
import { collectSourceFiles } from "../../lib/fs-walk";
import {
  readConfig,
  readRawConfig,
  upsertKiraRegistry,
  getRegistryUrl,
  findConfigFile,
  type RawComponentsConfig,
} from "../../lib/config";
import { fetchItem as defaultFetchItem } from "../install/client";
import { ensureNpmDeps } from "../install/deps";
import { COMPONENTS_SCHEMA_URL } from "../registry/build";
import {
  DEFAULT_REGISTRY_URL,
  type RegistryItemPayload,
} from "../../lib/schemas";
import type { MigrateOptions } from "../../types";
import { migrateCnSource } from "./cn-codemod";

const LEGACY_CN_SPECIFIERS = [
  "@/lib/cn",
  "@/lib/cn.ts",
  "@/utils/cn",
  "@/helpers/cn",
  "clsx",
  "tailwind-merge",
];

const STANDARD_LIB_ALIAS = "@/lib";

export interface ImportRewrite {
  file: string;
  from: string;
  to: string;
}

export interface DivergentComponent {
  name: string;
  changedFiles: number;
}

export interface MigrationFacts {
  hadLegacyRegistryUrl: boolean;
  alreadyHasNamespace: boolean;
  legacyAlias: boolean;
  legacySchema: boolean;
}

export interface MigrationPlan {
  configPath: string;
  raw: RawComponentsConfig | null;
  facts: MigrationFacts;
  cnRewrites: ImportRewrite[];
}

export interface MigrationOutcome {
  plan: MigrationPlan;
  configUpdated: boolean;
  rewrittenFiles: number;
  installedCn: boolean;
  divergent: DivergentComponent[];
}

async function planCnRewrites(
  cwd: string,
  sourceDir: string,
): Promise<ImportRewrite[]> {
  const files = collectSourceFiles(sourceDir);
  const rewrites: ImportRewrite[] = [];

  for (const file of files) {
    const content = await readFile(file, "utf-8");

    for (const specifier of LEGACY_CN_SPECIFIERS) {
      if (
        content.includes(`from "${specifier}"`) ||
        content.includes(`from '${specifier}'`)
      ) {
        rewrites.push({
          file: relative(cwd, file),
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

async function findDivergentComponents(
  options: MigrateOptions,
): Promise<DivergentComponent[]> {
  const fetchRegistryItem = options.fetchItem ?? defaultFetchItem;

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
      item = await fetchRegistryItem(`@kira-kit/${name}`, ctx);
    } catch {
      continue;
    }

    const changed = await countChangedFiles(options.cwd, item);

    if (changed > 0) divergent.push({ name, changedFiles: changed });
  }

  return divergent;
}

function configFacts(raw: RawComponentsConfig | null): MigrationFacts {
  const aliases: Record<string, string> = raw?.aliases ?? {};
  const schema = raw?.$schema ?? "";

  return {
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- legacy registryUrl may be any JSON value; only a string counts as present
    hadLegacyRegistryUrl: typeof raw?.registryUrl === "string",
    alreadyHasNamespace: "@kira-kit" in (raw?.registries ?? {}),
    legacyAlias: aliases.lib === "@/lib/cn",
    legacySchema: schema.includes("ui.shadcn.com"),
  };
}

export async function planMigration(
  options: MigrateOptions,
): Promise<MigrationPlan> {
  const configPath = findConfigFile(options.cwd);

  if (!configPath) {
    throw new ValidationError(
      "No components.json found.",
      "Run `kira-kit init` first to generate one.",
    );
  }

  const raw = readRawConfig(options.cwd);
  const facts = configFacts(raw);
  const sourceDir = resolve(options.cwd, "src");
  let sourceDirExists = true;

  try {
    await stat(sourceDir);
  } catch {
    sourceDirExists = false;
  }

  const cnRewrites = sourceDirExists
    ? await planCnRewrites(options.cwd, sourceDir)
    : [];

  return { configPath, raw, facts, cnRewrites };
}

function normalizeLegacyKeys(
  updated: RawComponentsConfig,
  facts: MigrationFacts,
): boolean {
  let changed = false;

  if (facts.hadLegacyRegistryUrl) {
    delete updated.registryUrl;
    changed = true;
  }

  if (facts.legacyAlias) {
    updated.aliases = { ...updated.aliases, lib: STANDARD_LIB_ALIAS };
    changed = true;
  }

  if (facts.legacySchema) {
    updated.$schema = COMPONENTS_SCHEMA_URL;
    updated.style = "kira";
    changed = true;
  }

  return changed;
}

async function updateRegistryConfig(
  options: MigrateOptions,
  plan: MigrationPlan,
): Promise<boolean> {
  const { configPath, raw, facts } = plan;

  if (
    !facts.hadLegacyRegistryUrl &&
    facts.alreadyHasNamespace &&
    !facts.legacyAlias &&
    !facts.legacySchema
  ) {
    return false;
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

  return true;
}

async function applyCnRewrites(
  options: MigrateOptions,
  cnRewrites: ImportRewrite[],
): Promise<{ rewrittenFiles: number; installedCn: boolean }> {
  const uniqueFiles = [...new Set(cnRewrites.map((r) => r.file))];

  for (const relPath of uniqueFiles) {
    const fullPath = resolve(options.cwd, relPath);
    const content = await readFile(fullPath, "utf-8");

    await writeFile(fullPath, migrateCnSource(content), "utf-8");
  }

  if (uniqueFiles.length === 0) {
    return { rewrittenFiles: 0, installedCn: false };
  }

  const installedCn = await ensureNpmDeps(
    options.cwd,
    ["cn"],
    { yes: options.yes },
    options.installer,
  );

  return { rewrittenFiles: uniqueFiles.length, installedCn };
}

/** Plan and optionally apply all Kira Kit migrations in `options.cwd`. */
export async function runMigration(
  options: MigrateOptions,
): Promise<MigrationOutcome> {
  const plan = await planMigration(options);

  if (options.dryRun) {
    return {
      plan,
      configUpdated: false,
      rewrittenFiles: 0,
      installedCn: false,
      divergent: [],
    };
  }

  const configUpdated = await updateRegistryConfig(options, plan);

  const { rewrittenFiles, installedCn } = await applyCnRewrites(
    options,
    plan.cnRewrites,
  );

  const divergent = options.yes ? [] : await findDivergentComponents(options);

  return { plan, configUpdated, rewrittenFiles, installedCn, divergent };
}
