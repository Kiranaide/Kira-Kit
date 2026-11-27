import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  CONFIG_FILENAME,
  DEFAULT_REGISTRY_URL,
  KIRA_NAMESPACE,
  readRawConfig,
  upsertKiraRegistry,
  type RawKiraConfig,
  type RawKiraThemeConfig,
} from "../lib/config";
import { KIRA_CONFIG_SCHEMA_URL } from "../core/registry/build";
import { BASE_CSS, UTILITIES_CSS } from "../generated/assets";
import { ensureNpmDeps, readConsumerPackage } from "../core/install/deps";
import { installItems } from "../core/install/engine";
import { DEFAULT_ALIASES } from "../core/install/targets";
import { applyFontToCss, detectCssPath } from "../core/install/apply-fonts";
import { applyIconLibrary } from "../core/install/icons";
import {
  detectProjectRuntime,
  type DetectedRuntime,
} from "../core/init/detect-runtime";
import { setupProjectRuntime } from "../core/init/setup";
import { buildBaseCss } from "../core/css/stylesheet";
import { generateTheme, themePayload } from "../core/theme/theme";
import {
  applyStandaloneTokens,
  applyThemePayload,
  attachThemeConfigFields,
  buildCustomTheme,
  persistThemeConfig,
  resolveThemeSelection,
  type ResolvedThemeSelection,
} from "../core/theme/apply";
import { PRESETS } from "../core/theme/presets";
import {
  DEFAULT_MONO,
  DEFAULT_SANS,
  MONO_FONTS,
  SANS_FONTS,
} from "../core/theme/fonts";
import { ValidationError } from "../lib/errors";
import { info, success, warning } from "../lib/logger";
import { select, text, confirm, type PromptContext } from "../lib/prompts";
import type { InitOptions } from "../types";

/** Packages every Kira Kit consumer needs, regardless of which items they add. */
function baseDeps(
  selection: ResolvedThemeSelection,
  runtime: DetectedRuntime,
): string[] {
  const deps = [
    "@base-ui/react",
    "cn",
    "class-variance-authority",
    selection.iconLibrary === "lucide" ? "lucide-react" : "@tabler/icons-react",
    ...runtime.tailwindDeps,
    "tw-animate-css",
    selection.sans.pkg,
    selection.mono.pkg,
  ];

  if (selection.display && selection.display.name !== selection.sans.name) {
    deps.push(selection.display.pkg);
  }

  return [...new Set(deps)];
}

function writeFreshConfig(
  cwd: string,
  css: string,
  selection: ResolvedThemeSelection,
  runtime: DetectedRuntime,
): void {
  const theme: RawKiraThemeConfig = {
    preset: "default",
    baseColor: selection.baseColor ?? "neutral",
    font: selection.sans.name,
    fontMono: selection.mono.name,
  };

  attachThemeConfigFields(theme, selection);

  const config: RawKiraConfig = {
    $schema: KIRA_CONFIG_SCHEMA_URL,
    css,
    rsc: runtime.isNext,
    iconLibrary: selection.iconLibrary,
    theme,
    aliases: { ...DEFAULT_ALIASES },
    registries: { [KIRA_NAMESPACE]: DEFAULT_REGISTRY_URL },
  };

  writeFileSync(
    join(cwd, CONFIG_FILENAME),
    JSON.stringify(config, null, 2) + "\n",
    "utf-8",
  );
  success("Created kira-kit.json (Base UI).");
}

function fillExistingConfig(
  cwd: string,
  raw: RawKiraConfig,
  css: string,
  selection: ResolvedThemeSelection,
): void {
  const theme: RawKiraThemeConfig = {
    ...raw.theme,
    font: selection.sans.name,
    fontMono: selection.mono.name,
  };

  if (selection.baseColor) {
    theme.baseColor = selection.baseColor;
  }

  attachThemeConfigFields(theme, selection);

  const next: RawKiraConfig = {
    ...raw,
    $schema: raw.$schema ?? KIRA_CONFIG_SCHEMA_URL,
    css: raw.css ?? css,
    iconLibrary: selection.iconLibrary,
    theme,
    aliases: { ...DEFAULT_ALIASES, ...raw.aliases },
  };

  writeFileSync(
    join(cwd, CONFIG_FILENAME),
    JSON.stringify(next, null, 2) + "\n",
    "utf-8",
  );
}

function ensureKiraConfig(
  cwd: string,
  selection: ResolvedThemeSelection,
  runtime: DetectedRuntime,
): void {
  const css = detectCssPath(cwd);
  const raw = readRawConfig(cwd);

  if (raw) {
    fillExistingConfig(cwd, raw, css, selection);
  } else {
    writeFreshConfig(cwd, css, selection, runtime);
  }

  if (upsertKiraRegistry(cwd)) {
    success("Registered the @kira-kit registry in kira-kit.json.");
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
  typo: ResolvedThemeSelection,
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
  typo: ResolvedThemeSelection,
  runtime: DetectedRuntime,
): Promise<void> {
  await ensureNpmDeps(
    cwd,
    baseDeps(typo, runtime),
    { yes: options.yes },
    options.installer,
  );
}

async function applyCustomTheme(
  cwd: string,
  primary: string,
  selection: ResolvedThemeSelection,
  force: boolean,
): Promise<number> {
  const generated = buildCustomTheme(primary, selection);

  if (!generated) return 1;

  await applyThemePayload(cwd, themePayload(generated.item), force);
  persistThemeConfig(cwd, selection, { primary, defaultBaseColor: "neutral" });
  success("Custom theme applied.");

  return 0;
}

async function applyPreset(
  cwd: string,
  options: InitOptions,
  selection: ResolvedThemeSelection,
): Promise<number> {
  const preset = PRESETS.find((p) => p.name === options.preset);

  if (preset) {
    const generated = generateTheme({
      ...preset,
      baseColor: selection.baseColor ?? preset.baseColor,
      radius: selection.radius?.name ?? preset.radius,
      surface: selection.surface?.name ?? preset.surface,
    });

    await applyThemePayload(cwd, themePayload(generated.item), options.force);
    persistThemeConfig(cwd, selection, {
      preset: preset.name,
      defaultBaseColor: preset.baseColor,
    });
    success(`Theme preset "${preset.name}" applied.`);

    return 0;
  }

  await installItems(
    { addresses: [`@kira-kit/theme-${options.preset}`] },
    { cwd, yes: true, overwrite: options.force, skipDeps: true },
  );
  persistThemeConfig(cwd, selection, { preset: options.preset });
  success(`Theme preset "${options.preset}" applied.`);

  return 0;
}

async function promptFonts(
  ctx: PromptContext,
  options: InitOptions,
  raw: RawKiraConfig | null,
): Promise<void> {
  if (options.font && options.fontMono) return;

  const theme = raw?.theme;

  if (!options.font) {
    options.font = await select(
      ctx,
      "Sans font",
      Object.values(SANS_FONTS).map((font) => ({
        value: font.name,
        label: font.family,
      })),
      theme?.font ?? DEFAULT_SANS,
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
      theme?.fontMono ?? DEFAULT_MONO,
    );
  }
}

async function promptIcon(
  ctx: PromptContext,
  options: InitOptions,
  raw: RawKiraConfig | null,
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
  selection: ResolvedThemeSelection,
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

  return applyCustomTheme(cwd, primary, selection, force);
}

function applyProjectSetup(cwd: string, runtime: DetectedRuntime): void {
  const configNote = runtime.configFile ? ` (${runtime.configFile})` : "";

  info(`Detected ${runtime.label} project${configNote}.`);

  const setup = setupProjectRuntime(cwd, runtime);

  for (const note of setup.notes) {
    success(note);
  }

  for (const warn of setup.warnings) {
    warning(warn);
  }
}

export async function init(options: InitOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();

  checkReactVersion(cwd);

  const runtime = detectProjectRuntime(cwd);

  await interactiveTypography(cwd, options);

  const selection = resolveThemeSelection(cwd, options);

  ensureKiraConfig(cwd, selection, runtime);
  writeBaseCss(cwd, options, selection, selection.hasRequestedFonts);
  applyProjectSetup(cwd, runtime);
  await installBaseDeps(cwd, options, selection, runtime);
  await applyIconLibrary(cwd, selection.iconLibrary, {
    yes: options.yes,
    installer: options.installer,
  });

  if (options.preset) return applyPreset(cwd, options, selection);

  if (options.primary) {
    return applyCustomTheme(cwd, options.primary, selection, options.force);
  }

  applyStandaloneTokens(cwd, selection);

  const interactiveCode = await interactiveTheme(cwd, options, selection);

  if (interactiveCode !== null) return interactiveCode;

  success(
    "Kira Kit initialized with the default Kira theme. Try: kira-kit add button",
  );

  return 0;
}
