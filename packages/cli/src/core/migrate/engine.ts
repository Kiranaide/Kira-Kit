import { readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { ValidationError } from "../../lib/errors";
import { collectSourceFiles } from "../../lib/fs-walk";
import {
  CONFIG_FILENAME,
  DEFAULT_REGISTRY_URL,
  KIRA_NAMESPACE,
  findConfigFile,
  findLegacyConfigFile,
  readConfig,
  type LegacyComponentsConfig,
  type RawKiraConfig,
  type RawKiraThemeConfig,
} from "../../lib/config";
import { fetchItem as defaultFetchItem } from "../install/client";
import { ensureNpmDeps } from "../install/deps";
import { KIRA_CONFIG_SCHEMA_URL } from "../registry/build";
import type { RegistryItemPayload } from "../../lib/schemas";
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
  fromLegacyConfigFile: boolean;
  hadLegacyRegistryUrl: boolean;
  alreadyHasNamespace: boolean;
  legacyAlias: boolean;
  legacySchema: boolean;
  legacyFields: boolean;
}

export interface MigrationPlan {
  configPath: string;
  raw: LegacyComponentsConfig | null;
  facts: MigrationFacts;
  cnRewrites: ImportRewrite[];
}

export interface MigrationOutcome {
  plan: MigrationPlan;
  configUpdated: boolean;
  removedLegacyConfig: boolean;
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

const LEGACY_TOP_LEVEL_KEYS: ReadonlyArray<keyof LegacyComponentsConfig> = [
  "tailwind",
  "style",
  "tsx",
  "baseColor",
  "font",
  "fontDisplay",
  "fontMono",
  "fontPreset",
  "radius",
  "surface",
  "menuColor",
  "menuAccent",
];

const LEGACY_THEME_KEYS: ReadonlyArray<
  keyof Pick<
    RawKiraThemeConfig,
    "font" | "fontDisplay" | "fontMono" | "fontPreset" | "radius" | "surface"
  >
> = ["font", "fontDisplay", "fontMono", "fontPreset", "radius", "surface"];

function hasLegacyFields(
  raw: LegacyComponentsConfig | null,
  aliases: Record<string, string>,
): boolean {
  if (!raw) return false;

  return (
    aliases.utils !== undefined ||
    LEGACY_TOP_LEVEL_KEYS.some((key) => raw[key] !== undefined)
  );
}

function configFacts(
  raw: LegacyComponentsConfig | null,
  fromLegacyConfigFile: boolean,
): MigrationFacts {
  const aliases: Record<string, string> = raw?.aliases ?? {};
  const schema = raw?.$schema ?? "";

  return {
    fromLegacyConfigFile,
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- legacy registryUrl may be any JSON value; only a string counts as present
    hadLegacyRegistryUrl: typeof raw?.registryUrl === "string",
    alreadyHasNamespace: KIRA_NAMESPACE in (raw?.registries ?? {}),
    legacyAlias: aliases.lib === "@/lib/cn",
    legacySchema:
      schema.includes("ui.shadcn.com") ||
      schema.includes("/schema/components.json"),
    legacyFields: hasLegacyFields(raw, aliases),
  };
}

function resolveRegistryUrl(
  raw: LegacyComponentsConfig,
  facts: MigrationFacts,
): string {
  // SAFETY: hadLegacyRegistryUrl was set by `typeof raw.registryUrl === "string"`.
  const existing = facts.hadLegacyRegistryUrl
    ? (raw.registryUrl as string)
    : raw.registries?.[KIRA_NAMESPACE];

  if (!existing) return DEFAULT_REGISTRY_URL;

  return existing.endsWith("/{name}.json")
    ? existing
    : `${existing.replace(/\/$/, "")}/{name}.json`;
}

function cleanAliases(
  aliases: Record<string, string> | undefined,
  legacyAlias: boolean,
): Record<string, string> | undefined {
  if (!aliases) return undefined;

  const { utils: _droppedUtils, ...rest } = aliases;

  if (legacyAlias) rest.lib = STANDARD_LIB_ALIAS;

  return Object.keys(rest).length > 0 ? rest : undefined;
}

function buildMigratedTheme(
  raw: LegacyComponentsConfig,
): RawKiraThemeConfig | undefined {
  const merged: RawKiraThemeConfig = {
    ...raw.theme,
  };

  const baseColor =
    raw.theme?.baseColor ?? raw.baseColor ?? raw.tailwind?.baseColor;

  if (baseColor) merged.baseColor = baseColor;

  for (const key of LEGACY_THEME_KEYS) {
    const value = raw[key];

    if (value && !merged[key]) merged[key] = value;
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}

function buildMigratedConfig(
  raw: LegacyComponentsConfig,
  facts: MigrationFacts,
): RawKiraConfig {
  const {
    style: _style,
    tsx: _tsx,
    baseColor: _baseColor,
    font: _font,
    fontDisplay: _fontDisplay,
    fontMono: _fontMono,
    fontPreset: _fontPreset,
    radius: _radius,
    surface: _surface,
    tailwind,
    theme: _theme,
    registryUrl: _registryUrl,
    menuColor: _menuColor,
    menuAccent: _menuAccent,
    aliases,
    registries,
    ...rest
  } = raw;

  const next: RawKiraConfig = {
    ...rest,
    $schema: KIRA_CONFIG_SCHEMA_URL,
  };

  const css = raw.css ?? tailwind?.css;

  if (css) next.css = css;

  const theme = buildMigratedTheme(raw);

  if (theme) next.theme = theme;

  const cleanedAliases = cleanAliases(aliases, facts.legacyAlias);

  if (cleanedAliases) next.aliases = cleanedAliases;

  next.registries = {
    ...registries,
    [KIRA_NAMESPACE]: resolveRegistryUrl(raw, facts),
  };

  return next;
}

function isLegacyKiraConfig(
  raw: LegacyComponentsConfig | null,
  facts: MigrationFacts,
): boolean {
  if (!raw) return false;

  const schema = raw.$schema ?? "";

  return (
    raw.style === "kira" ||
    schema.includes("kira") ||
    facts.hadLegacyRegistryUrl ||
    facts.alreadyHasNamespace
  );
}

export async function planMigration(
  options: MigrateOptions,
): Promise<MigrationPlan> {
  const kiraPath = findConfigFile(options.cwd);
  const legacyPath = kiraPath ? null : findLegacyConfigFile(options.cwd);
  const configPath = kiraPath ?? legacyPath;

  if (!configPath) {
    throw new ValidationError(
      "No kira-kit.json or legacy components.json found.",
      "Run `kira-kit init` first to generate kira-kit.json.",
    );
  }

  let raw: LegacyComponentsConfig | null = null;

  try {
    // SAFETY: user-owned JSON config; validated field-by-field in configFacts.
    raw = JSON.parse(
      await readFile(configPath, "utf-8"),
    ) as LegacyComponentsConfig;
  } catch {
    raw = null;
  }

  const facts = configFacts(raw, Boolean(legacyPath));
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

function needsConfigUpdate(facts: MigrationFacts): boolean {
  return (
    facts.fromLegacyConfigFile ||
    facts.hadLegacyRegistryUrl ||
    !facts.alreadyHasNamespace ||
    facts.legacyAlias ||
    facts.legacySchema ||
    facts.legacyFields
  );
}

async function updateRegistryConfig(
  options: MigrateOptions,
  plan: MigrationPlan,
): Promise<{ configUpdated: boolean; removedLegacyConfig: boolean }> {
  const { configPath, raw, facts } = plan;

  if (!needsConfigUpdate(facts)) {
    return { configUpdated: false, removedLegacyConfig: false };
  }

  const migrated = buildMigratedConfig(raw ?? {}, facts);
  const targetPath = join(options.cwd, CONFIG_FILENAME);

  await writeFile(
    targetPath,
    JSON.stringify(migrated, null, 2) + "\n",
    "utf-8",
  );

  let removedLegacyConfig = false;

  if (facts.fromLegacyConfigFile && isLegacyKiraConfig(raw, facts)) {
    await rm(configPath, { force: true });
    removedLegacyConfig = true;
  }

  return { configUpdated: true, removedLegacyConfig };
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
      removedLegacyConfig: false,
      rewrittenFiles: 0,
      installedCn: false,
      divergent: [],
    };
  }

  const { configUpdated, removedLegacyConfig } = await updateRegistryConfig(
    options,
    plan,
  );

  const { rewrittenFiles, installedCn } = await applyCnRewrites(
    options,
    plan.cnRewrites,
  );

  const divergent = options.yes ? [] : await findDivergentComponents(options);

  return {
    plan,
    configUpdated,
    removedLegacyConfig,
    rewrittenFiles,
    installedCn,
    divergent,
  };
}
