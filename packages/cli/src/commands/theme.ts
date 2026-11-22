import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  BASE_COLOR_NAMES,
  generateBaseColorVars,
  generateTheme,
  isBaseColorName,
  normalizeBaseColor,
  themePayload,
  ThemeContrastError,
  type GeneratedTheme,
} from "../core/theme/theme";
import type { BaseColorName } from "../core/theme/palette";
import {
  DEFAULT_MONO,
  DEFAULT_SANS,
  resolveFont,
  resolveFontPreset,
  type FontSpec,
} from "../core/theme/fonts";
import {
  resolveRadius,
  resolveSurface,
  type ResolvedRadius,
  type SurfacePreset,
} from "../core/theme/geometry";
import { installItems } from "../core/install/engine";
import { applyFonts, detectCssPath } from "../core/install/apply-fonts";
import { mergeCssVars, type CssVars } from "../core/install/css-vars";
import { applyIconLibrary, resolveIconLibrary } from "../core/install/icons";
import {
  readRawConfig,
  updateRawConfig,
  type RawComponentsConfig,
} from "../lib/config";
import { ValidationError } from "../lib/errors";
import { info, success } from "../lib/logger";
import type { ThemeOptions } from "../types";

interface ThemeSelection {
  sans: FontSpec;
  mono: FontSpec;
  display?: FontSpec;
  fontPreset?: string;
  iconLibrary: string;
  baseColor?: BaseColorName;
  radius?: ResolvedRadius;
  surface?: SurfacePreset;
  hasFonts: boolean;
  hasIcon: boolean;
  hasTokens: boolean;
}

function resolveStandaloneBaseColor(value?: string): BaseColorName | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();

  if (!isBaseColorName(trimmed)) {
    throw new ValidationError(
      `Unknown base color "${value}".`,
      `Valid options: ${BASE_COLOR_NAMES.join(", ")}.`,
    );
  }

  return trimmed;
}

function firstDefined(values: Array<string | undefined>): string | undefined {
  return values.find((value) => value !== undefined);
}

function pickThemeFontSlots(
  raw: RawComponentsConfig | null,
  options: ThemeOptions,
) {
  const preset = options.fontPreset
    ? resolveFontPreset(options.fontPreset)
    : undefined;

  const sans =
    firstDefined([options.font, preset?.sans, raw?.font]) ?? DEFAULT_SANS;

  const mono =
    firstDefined([options.fontMono, preset?.mono, raw?.fontMono]) ??
    DEFAULT_MONO;

  const display = firstDefined([options.fontDisplay, preset?.display]);

  return { sans, mono, display, fontPreset: preset?.name };
}

function resolveTypographyFields(
  raw: RawComponentsConfig | null,
  options: ThemeOptions,
) {
  const slots = pickThemeFontSlots(raw, options);

  const fontFlags = [
    options.fontPreset,
    options.font,
    options.fontDisplay,
    options.fontMono,
  ];

  return {
    sans: resolveFont("sans", slots.sans),
    mono: resolveFont("mono", slots.mono),
    display: slots.display ? resolveFont("display", slots.display) : undefined,
    fontPreset: slots.fontPreset,
    hasFonts: fontFlags.some(Boolean),
  };
}

function resolveSelection(cwd: string, options: ThemeOptions): ThemeSelection {
  const raw = readRawConfig(cwd);
  const typo = resolveTypographyFields(raw, options);

  const baseColor = options.primary
    ? normalizeBaseColor(options.baseColor)
    : resolveStandaloneBaseColor(options.baseColor);

  const radius = options.radius ? resolveRadius(options.radius) : undefined;
  const surface = options.surface ? resolveSurface(options.surface) : undefined;

  return {
    ...typo,
    iconLibrary: resolveIconLibrary(options.icon ?? raw?.iconLibrary),
    baseColor,
    radius,
    surface,
    hasIcon: Boolean(options.icon),
    hasTokens: Boolean(baseColor || radius || surface),
  };
}

function persistThemeConfig(
  cwd: string,
  selection: ThemeSelection,
  defaultBaseColor?: BaseColorName,
): void {
  const raw = readRawConfig(cwd);

  if (!raw) return;

  const patch: Partial<RawComponentsConfig> = {};
  const nextBase = selection.baseColor ?? defaultBaseColor;

  if (nextBase) {
    patch.tailwind = { ...raw.tailwind, baseColor: nextBase };
  }

  if (selection.radius) patch.radius = selection.radius.name;

  if (selection.surface) patch.surface = selection.surface.name;

  if (Object.keys(patch).length > 0) {
    updateRawConfig(cwd, patch);
  }
}

async function applyTypography(
  cwd: string,
  selection: ThemeSelection,
  installer: ThemeOptions["installer"],
): Promise<void> {
  if (selection.hasFonts) {
    await applyFonts(cwd, selection.sans, selection.mono, {
      yes: true,
      installer,
      display: selection.display,
      fontPreset: selection.fontPreset,
    });
  }

  if (selection.hasIcon) {
    await applyIconLibrary(cwd, selection.iconLibrary, {
      yes: true,
      installer,
    });
  }
}

function applyStandaloneTokens(cwd: string, selection: ThemeSelection): void {
  const cssVars: CssVars = {};

  if (selection.baseColor) {
    const baseVars = generateBaseColorVars(selection.baseColor);

    cssVars.light = { ...cssVars.light, ...baseVars.light };
    cssVars.dark = { ...cssVars.dark, ...baseVars.dark };
  }

  if (selection.surface) {
    cssVars.light = { ...cssVars.light, ...selection.surface.light };
    cssVars.dark = { ...cssVars.dark, ...selection.surface.dark };
  }

  if (selection.radius) {
    cssVars.theme = { ...cssVars.theme, "--radius": selection.radius.value };
    cssVars.light = { ...cssVars.light, "--radius": selection.radius.value };
  }

  const cssPath = join(cwd, detectCssPath(cwd));

  if (existsSync(cssPath)) {
    mergeCssVars(cssPath, cssVars);
  }

  persistThemeConfig(cwd, selection);
}

function reportContrast(generated: GeneratedTheme): void {
  for (const adjustment of generated.adjustments) {
    info(
      `adjusted ${adjustment.scheme}.${adjustment.token} lightness ${adjustment.fromL} → ${adjustment.toL} for contrast`,
    );
  }

  const weakest = [...generated.apca].sort((a, b) => a.lc - b.lc)[0];

  if (weakest) {
    info(
      `APCA (informational): weakest text pair ${weakest.pair} at Lc ${weakest.lc.toFixed(1)}`,
    );
  }
}

function buildPrimaryTheme(
  primary: string,
  selection: ThemeSelection,
): GeneratedTheme | null {
  try {
    return generateTheme({
      name: "custom",
      title: "Custom Kira Kit theme",
      description: `Custom OKLCH theme generated from primary ${primary}.`,
      primary,
      baseColor: selection.baseColor ?? "neutral",
      radius: selection.radius?.name,
      surface: selection.surface?.name,
    });
  } catch (error) {
    if (error instanceof ThemeContrastError) {
      console.error(`error: ${error.message}`);

      return null;
    }

    throw error;
  }
}

async function applyPrimaryTheme(
  cwd: string,
  primary: string,
  options: ThemeOptions,
  selection: ThemeSelection,
): Promise<number> {
  const generated = buildPrimaryTheme(primary, selection);

  if (!generated) return 1;

  reportContrast(generated);

  const outPath = options.out
    ? join(cwd, options.out)
    : join(cwd, "kira-theme.json");

  writeFileSync(
    outPath,
    JSON.stringify(generated.item, null, 2) + "\n",
    "utf-8",
  );
  success(`Wrote theme registry item to ${outPath}`);

  if (!options.apply) {
    info(`Apply it with: kira-kit theme --primary ${primary} --apply`);

    return 0;
  }

  await installItems(
    { items: [themePayload(generated.item)] },
    { cwd, yes: true, overwrite: true, skipDeps: true },
  );
  persistThemeConfig(cwd, selection, "neutral");
  await applyTypography(cwd, selection, options.installer);
  success("Theme applied.");

  return 0;
}

function hasAnyThemeOption(options: ThemeOptions): boolean {
  const flags = [
    options.primary,
    options.baseColor,
    options.fontPreset,
    options.font,
    options.fontDisplay,
    options.fontMono,
    options.radius,
    options.surface,
    options.icon,
  ];

  return flags.some(Boolean);
}

function formatDryRunSummary(selection: ThemeSelection): string {
  const parts: string[] = [];

  if (selection.baseColor) parts.push(`base=${selection.baseColor}`);

  if (selection.radius) parts.push(`radius=${selection.radius.name}`);

  if (selection.surface) parts.push(`surface=${selection.surface.name}`);

  if (selection.display) parts.push(`display=${selection.display.name}`);

  parts.push(
    `sans=${selection.sans.name}`,
    `mono=${selection.mono.name}`,
    `icons=${selection.iconLibrary}`,
  );

  return parts.join(", ");
}

export async function theme(options: ThemeOptions): Promise<number> {
  const cwd = options.cwd || process.cwd();

  if (!hasAnyThemeOption(options)) {
    throw new ValidationError(
      "Nothing to generate or apply.",
      "Pass --primary <color>, --base-color <name>, --font-preset <name>, --font <name>, --font-display <name>, --font-mono <name>, --radius <preset>, --surface <preset>, or --icon <library>.",
    );
  }

  const selection = resolveSelection(cwd, options);

  if (options.primary) {
    return applyPrimaryTheme(cwd, options.primary, options, selection);
  }

  if (!options.apply) {
    info(`Would apply: ${formatDryRunSummary(selection)}.`);
    info("Re-run with --apply to write the CSS, config, and packages.");

    return 0;
  }

  if (selection.hasTokens) {
    applyStandaloneTokens(cwd, selection);
  }

  await applyTypography(cwd, selection, options.installer);
  success("Theme options applied.");

  return 0;
}
