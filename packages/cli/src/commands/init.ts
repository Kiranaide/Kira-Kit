import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  KIRA_NAMESPACE,
  DEFAULT_REGISTRY_URL,
  readRawConfig,
  upsertKiraRegistry,
  type RawComponentsConfig,
} from "../lib/config";
import { COMPONENTS_SCHEMA_URL } from "../core/registry/build";
import { BASE_CSS, UTILITIES_CSS } from "../generated/assets";
import { installNpmDeps, readConsumerPackage } from "../core/install/deps";
import { installItems } from "../core/install/engine";
import { DEFAULT_ALIASES } from "../core/install/targets";
import { applyFontToCss, detectCssPath } from "../core/install/apply-fonts";
import { applyIconLibrary, resolveIconLibrary } from "../core/install/icons";
import {
  detectProjectRuntime,
  type DetectedRuntime,
} from "../core/init/detect-runtime";
import { configureRuntime } from "../core/init/configure-runtime";
import { configureTsconfigPaths } from "../core/init/tsconfig";
import { buildBaseCss } from "../core/registry/css-assets";
import {
  generateBaseColorVars,
  generateTheme,
  isBaseColorName,
  normalizeBaseColor,
  themePayload,
  ThemeContrastError,
} from "../core/theme/theme";
import { PRESETS } from "../core/theme/presets";
import {
  DEFAULT_MONO,
  DEFAULT_SANS,
  FONT_PRESETS,
  MONO_FONTS,
  SANS_FONTS,
  resolveFont,
  resolveFontPreset,
  type FontSpec,
} from "../core/theme/fonts";
import {
  resolveRadius,
  resolveSurface,
  type SurfacePreset,
} from "../core/theme/geometry";
import { mergeCssVars, type CssVars } from "../core/install/css-vars";
import { ValidationError } from "../lib/errors";
import { info, success, warning } from "../lib/logger";
import { select, text, confirm, type PromptContext } from "../lib/prompts";
import type { RegistryItemPayload } from "../lib/schemas";
import type { InitOptions } from "../types";

interface Typography {
  sans: FontSpec;
  mono: FontSpec;
  display?: FontSpec;
  headingTracking?: string;
  fontPreset?: string;
  iconLibrary: string;
}

function resolveFontPresetOption(options: InitOptions) {
  return options.fontPreset ? resolveFontPreset(options.fontPreset) : undefined;
}

function firstDefined(values: Array<string | undefined>): string | undefined {
  return values.find((value) => value !== undefined);
}

function pickFontSlots(options: InitOptions, raw: RawComponentsConfig | null) {
  const preset = resolveFontPresetOption(options);
  const config: RawComponentsConfig = raw ?? {};

  const sans =
    firstDefined([options.font, preset?.sans, config.font]) ?? DEFAULT_SANS;

  const mono =
    firstDefined([options.fontMono, preset?.mono, config.fontMono]) ??
    DEFAULT_MONO;

  const display = firstDefined([
    options.fontDisplay,
    preset?.display,
    config.fontDisplay,
  ]);

  return {
    sans,
    mono,
    display,
    fontPreset: firstDefined([preset?.name, config.fontPreset]),
  };
}

function resolveTypography(cwd: string, options: InitOptions): Typography {
  const raw = readRawConfig(cwd);
  const slots = pickFontSlots(options, raw);
  const iconChoice = firstDefined([options.icon, raw?.iconLibrary]);

  return {
    sans: resolveFont("sans", slots.sans),
    mono: resolveFont("mono", slots.mono),
    display: slots.display ? resolveFont("display", slots.display) : undefined,
    headingTracking: Object.values(FONT_PRESETS).find(
      (preset) => preset.name === slots.fontPreset,
    )?.headingTracking,
    fontPreset: slots.fontPreset,
    iconLibrary: resolveIconLibrary(iconChoice),
  };
}

/** Packages every Kira Kit consumer needs, regardless of which items they add. */
function baseDeps(typo: Typography, runtime: DetectedRuntime): string[] {
  const deps = [
    "@base-ui/react",
    "cn",
    "class-variance-authority",
    typo.iconLibrary === "lucide" ? "lucide-react" : "@tabler/icons-react",
    ...runtime.tailwindDeps,
    "tw-animate-css",
    typo.sans.pkg,
    typo.mono.pkg,
  ];

  if (typo.display && typo.display.name !== typo.sans.name) {
    deps.push(typo.display.pkg);
  }

  return [...new Set(deps)];
}

function attachPresetConfigFields(
  target: RawComponentsConfig,
  typo: Typography,
  options: InitOptions,
): void {
  if (typo.display) target.fontDisplay = typo.display.name;

  if (typo.fontPreset) target.fontPreset = typo.fontPreset;

  if (options.radius) target.radius = resolveRadius(options.radius).name;

  if (options.surface) target.surface = resolveSurface(options.surface).name;
}

function writeFreshConfig(
  cwd: string,
  css: string,
  typo: Typography,
  runtime: DetectedRuntime,
  options: InitOptions,
): void {
  const config: RawComponentsConfig & { rsc: boolean; tsx: boolean } = {
    $schema: COMPONENTS_SCHEMA_URL,
    style: "kira",
    rsc: runtime.isNext,
    tsx: true,
    tailwind: {
      css,
      baseColor: normalizeBaseColor(options.baseColor),
      cssVariables: true,
    },
    iconLibrary: typo.iconLibrary,
    font: typo.sans.name,
    fontMono: typo.mono.name,
    aliases: { ...DEFAULT_ALIASES },
    registries: { [KIRA_NAMESPACE]: DEFAULT_REGISTRY_URL },
  };

  attachPresetConfigFields(config, typo, options);

  writeFileSync(
    join(cwd, "components.json"),
    JSON.stringify(config, null, 2) + "\n",
    "utf-8",
  );
  success("Created components.json (kira style, Base UI).");
}

function fillExistingConfig(
  cwd: string,
  raw: RawComponentsConfig,
  css: string,
  typo: Typography,
  options: InitOptions,
): void {
  const tailwind = { ...raw.tailwind, css: raw.tailwind?.css ?? css };

  if (options.baseColor) {
    tailwind.baseColor = normalizeBaseColor(options.baseColor);
  }

  const next: RawComponentsConfig = {
    ...raw,
    iconLibrary: typo.iconLibrary,
    font: typo.sans.name,
    fontMono: typo.mono.name,
    aliases: { ...DEFAULT_ALIASES, ...raw.aliases },
    tailwind,
  };

  attachPresetConfigFields(next, typo, options);

  writeFileSync(
    join(cwd, "components.json"),
    JSON.stringify(next, null, 2) + "\n",
    "utf-8",
  );
}

function ensureKiraConfig(
  cwd: string,
  typo: Typography,
  runtime: DetectedRuntime,
  options: InitOptions,
): void {
  const css = detectCssPath(cwd);
  const raw = readRawConfig(cwd);

  if (raw) {
    fillExistingConfig(cwd, raw, css, typo, options);
  } else {
    writeFreshConfig(cwd, css, typo, runtime, options);
  }

  if (upsertKiraRegistry(cwd)) {
    success("Registered the @kira-kit registry in components.json.");
  }
}

function reactFloor(range: string): [number, number] | null {
  const match = range.match(/(\d+)\.(\d+)/);

  return match ? [Number(match[1]), Number(match[2])] : null;
}

function belowReactFloor(floor: [number, number]): boolean {
  const [major, minor] = floor;

  return major < 19 || (major === 19 && minor < 2);
}

/** Kira Kit uses React 19.2 APIs (useEffectEvent); older floors are rejected. */
function checkReactVersion(cwd: string): void {
  const pkg = readConsumerPackage(cwd);

  const range =
    pkg.dependencies?.react ??
    pkg.devDependencies?.react ??
    pkg.peerDependencies?.react;

  if (!range) {
    warning("No react dependency found — Kira Kit requires React 19.2+.");

    return;
  }

  const floor = reactFloor(range);

  if (!floor) {
    warning(
      `Could not parse react range "${range}" — Kira Kit requires React 19.2+.`,
    );

    return;
  }

  if (belowReactFloor(floor)) {
    throw new ValidationError(
      `Kira Kit requires React 19.2+ (found "${range}").`,
      "Upgrade react and react-dom to ^19.2.0 or newer, then retry.",
    );
  }
}

function writeBaseCss(
  cwd: string,
  options: InitOptions,
  typo: Typography,
  fontsRequested: boolean,
): void {
  const cssRel = detectCssPath(cwd);
  const cssPath = join(cwd, cssRel);

  const hasTheme =
    existsSync(cssPath) && readFileSync(cssPath, "utf-8").includes(":root");

  if (hasTheme && !options.force) {
    if (fontsRequested) {
      const css = readFileSync(cssPath, "utf-8");

      const next = applyFontToCss(
        css,
        typo.sans,
        typo.mono,
        typo.display,
        typo.headingTracking,
      );

      if (next !== css) {
        writeFileSync(cssPath, next, "utf-8");
        success(
          `Fonts applied to ${cssRel} (${typo.sans.name} + ${typo.mono.name}).`,
        );

        return;
      }
    }

    info("A theme is already configured — leaving the CSS untouched.");

    return;
  }

  mkdirSync(dirname(cssPath), { recursive: true });
  writeFileSync(
    cssPath,
    buildBaseCss(BASE_CSS, "./kira-utilities.css", typo),
    "utf-8",
  );
  writeFileSync(
    join(dirname(cssPath), "kira-utilities.css"),
    UTILITIES_CSS,
    "utf-8",
  );
  success(
    `Wrote the Kira base stylesheet to ${cssRel} (+ kira-utilities.css).`,
  );
}

async function installBaseDeps(
  cwd: string,
  options: InitOptions,
  typo: Typography,
  runtime: DetectedRuntime,
): Promise<void> {
  const pkg = readConsumerPackage(cwd);

  const present = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);

  const missing = baseDeps(typo, runtime).filter((dep) => !present.has(dep));

  await installNpmDeps(cwd, missing, { yes: options.yes }, options.installer);
}

async function applyTheme(
  cwd: string,
  payload: RegistryItemPayload,
  force: boolean,
  label: string,
): Promise<number> {
  writeFileSync(
    join(cwd, "kira-theme.json"),
    JSON.stringify(payload, null, 2) + "\n",
    "utf-8",
  );

  await installItems(
    { items: [payload] },
    { cwd, yes: true, overwrite: force, skipDeps: true },
  );
  success(`${label} applied.`);

  return 0;
}

async function applyCustomTheme(
  cwd: string,
  primary: string,
  baseColor: string | undefined,
  force: boolean,
  radius?: string,
  surface?: string,
): Promise<number> {
  let generated;

  try {
    generated = generateTheme({
      name: "custom",
      title: "Custom Kira Kit theme",
      description: `Custom OKLCH theme generated from primary ${primary}.`,
      primary,
      baseColor: normalizeBaseColor(baseColor),
      radius,
      surface: surface ? resolveSurface(surface).name : undefined,
    });
  } catch (error) {
    if (error instanceof ThemeContrastError) {
      console.error(`error: ${error.message}`);

      return 1;
    }

    throw error;
  }

  return applyTheme(cwd, themePayload(generated.item), force, "Custom theme");
}

async function applyPreset(cwd: string, options: InitOptions): Promise<number> {
  const preset = PRESETS.find((p) => p.name === options.preset);

  if (preset) {
    const generated = generateTheme({
      name: preset.name,
      title: preset.title,
      description: preset.description,
      primary: preset.primary,
      baseColor: options.baseColor
        ? normalizeBaseColor(options.baseColor)
        : preset.baseColor,
      chartHues: preset.chartHues,
      radius: options.radius ?? preset.radius,
      surface: options.surface
        ? resolveSurface(options.surface).name
        : preset.surface,
    });

    return applyTheme(
      cwd,
      themePayload(generated.item),
      options.force,
      `Theme preset "${preset.name}"`,
    );
  }

  await installItems(
    { addresses: [`@kira-kit/theme-${options.preset}`] },
    { cwd, yes: true, overwrite: options.force, skipDeps: true },
  );
  success(`Theme preset "${options.preset}" applied.`);

  return 0;
}

function buildStandaloneInitCssVars(options: InitOptions): CssVars | null {
  const cssVars: CssVars = {};
  let changed = false;

  if (options.baseColor && isBaseColorName(options.baseColor)) {
    const baseVars = generateBaseColorVars(options.baseColor);

    cssVars.light = { ...cssVars.light, ...baseVars.light };
    cssVars.dark = { ...cssVars.dark, ...baseVars.dark };
    changed = true;
  }

  if (options.surface) {
    const surface: SurfacePreset = resolveSurface(options.surface);

    cssVars.light = { ...cssVars.light, ...surface.light };
    cssVars.dark = { ...cssVars.dark, ...surface.dark };
    changed = true;
  }

  if (options.radius) {
    const radius = resolveRadius(options.radius);

    cssVars.theme = { ...cssVars.theme, "--radius": radius.value };
    cssVars.light = { ...cssVars.light, "--radius": radius.value };
    changed = true;
  }

  return changed ? cssVars : null;
}

function applyStandaloneInitTokens(cwd: string, options: InitOptions): void {
  const cssVars = buildStandaloneInitCssVars(options);

  if (!cssVars) return;

  const cssPath = join(cwd, detectCssPath(cwd));

  if (existsSync(cssPath)) {
    mergeCssVars(cssPath, cssVars);
  }
}

function hasRequestedFonts(
  options: InitOptions,
  raw: RawComponentsConfig | null,
): boolean {
  const flags = [
    options.fontPreset,
    options.font,
    options.fontDisplay,
    options.fontMono,
    raw?.font,
    raw?.fontDisplay,
    raw?.fontMono,
  ];

  return flags.some(Boolean);
}

async function promptFonts(
  ctx: PromptContext,
  options: InitOptions,
  raw: RawComponentsConfig | null,
): Promise<void> {
  if (options.font && options.fontMono) return;

  if (!options.font) {
    options.font = await select(
      ctx,
      "Sans font",
      Object.values(SANS_FONTS).map((font) => ({
        value: font.name,
        label: font.family,
      })),
      raw?.font ?? DEFAULT_SANS,
    );
  }

  if (!options.fontMono) {
    options.fontMono = await select(
      ctx,
      "Mono font",
      Object.values(MONO_FONTS).map((font) => ({
        value: font.name,
        label: font.family,
      })),
      raw?.fontMono ?? DEFAULT_MONO,
    );
  }
}

async function promptIcon(
  ctx: PromptContext,
  options: InitOptions,
  raw: RawComponentsConfig | null,
): Promise<void> {
  if (options.icon) return;

  options.icon = await select(
    ctx,
    "Icon library",
    [
      { value: "tabler", label: "Tabler (the kit default)" },
      { value: "lucide", label: "Lucide" },
    ],
    raw?.iconLibrary ?? "tabler",
  );
}

/** Interactive font/icon choice; explicit flags and --yes skip the prompts. */
async function interactiveTypography(
  cwd: string,
  options: InitOptions,
): Promise<void> {
  if (options.yes || !process.stdin.isTTY) return;

  const raw = readRawConfig(cwd);
  const ctx = { yes: options.yes };

  await promptFonts(ctx, options, raw);
  await promptIcon(ctx, options, raw);
}

/** Interactive theme choice; null means "keep the default/current theme". */
async function interactiveTheme(
  cwd: string,
  options: InitOptions,
): Promise<number | null> {
  if (options.yes || !process.stdin.isTTY) return null;

  const ctx = { yes: options.yes };

  const choice = await select(
    ctx,
    "How should the theme be set up?",
    [
      { value: "keep", label: "Keep the default Kira theme" },
      {
        value: "custom",
        label: "Generate a custom theme from a primary color",
      },
    ],
    "keep",
  );

  if (choice !== "custom") return null;

  const primary = await text(
    ctx,
    "Primary color (hex, e.g. #e2694a)",
    "#e2694a",
    (value) =>
      /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim())
        ? undefined
        : "Enter a hex color like #e2694a",
  );

  const cssPath = join(cwd, detectCssPath(cwd));

  const hasTheme =
    existsSync(cssPath) && readFileSync(cssPath, "utf-8").includes(":root");

  const force = hasTheme
    ? await confirm(ctx, "A theme already exists. Overwrite it?", true)
    : true;

  return applyCustomTheme(cwd, primary, options.baseColor, force);
}

function applyProjectSetup(cwd: string, runtime: DetectedRuntime): void {
  const configNote = runtime.configFile ? ` (${runtime.configFile})` : "";

  info(`Detected ${runtime.label} project${configNote}.`);

  const tsResult = configureTsconfigPaths(cwd);

  if (tsResult.updatedFiles.length > 0) {
    success(
      `Configured "@/*" -> "${tsResult.aliasTarget}" in ${tsResult.updatedFiles.join(", ")}.`,
    );
  }

  const runtimeResult = configureRuntime(cwd, runtime);

  for (const note of runtimeResult.notes) {
    success(note);
  }

  for (const warn of runtimeResult.warnings) {
    warning(warn);
  }
}

export async function init(options: InitOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();

  checkReactVersion(cwd);

  const runtime = detectProjectRuntime(cwd);

  await interactiveTypography(cwd, options);

  const raw = readRawConfig(cwd);
  const fontsRequested = hasRequestedFonts(options, raw);
  const typo = resolveTypography(cwd, options);

  ensureKiraConfig(cwd, typo, runtime, options);
  writeBaseCss(cwd, options, typo, fontsRequested);
  applyProjectSetup(cwd, runtime);
  await installBaseDeps(cwd, options, typo, runtime);
  await applyIconLibrary(cwd, typo.iconLibrary, {
    yes: options.yes,
    installer: options.installer,
  });

  if (options.preset) return applyPreset(cwd, options);

  if (options.primary) {
    return applyCustomTheme(
      cwd,
      options.primary,
      options.baseColor,
      options.force,
      options.radius,
      options.surface,
    );
  }

  applyStandaloneInitTokens(cwd, options);

  const interactiveCode = await interactiveTheme(cwd, options);

  if (interactiveCode !== null) return interactiveCode;

  success(
    "Kira Kit initialized with the default Kira theme. Try: kira-kit add button",
  );

  return 0;
}
