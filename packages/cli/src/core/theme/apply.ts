import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  readRawConfig,
  updateThemeConfig,
  type RawKiraConfig,
  type RawKiraThemeConfig,
} from "../../lib/config";
import { ValidationError } from "../../lib/errors";
import type { RegistryItemPayload } from "../../lib/schemas";
import { mergeCssVars, type CssVars } from "../css/stylesheet";
import { detectCssPath } from "../install/apply-fonts";
import { installItems } from "../install/engine";
import { resolveIconLibrary } from "../install/icons";
import {
  DEFAULT_MONO,
  DEFAULT_SANS,
  FONT_PRESETS,
  resolveFont,
  resolveFontPreset,
  type FontSpec,
} from "./fonts";
import {
  resolveRadius,
  resolveSurface,
  type ResolvedRadius,
  type SurfacePreset,
} from "./geometry";
import type { BaseColorName } from "./palette";
import {
  BASE_COLOR_NAMES,
  generateBaseColorVars,
  generateTheme,
  isBaseColorName,
  ThemeContrastError,
  type GeneratedTheme,
} from "./theme";

export interface ThemeFlags {
  primary?: string;
  preset?: string;
  baseColor?: string;
  fontPreset?: string;
  font?: string;
  fontDisplay?: string;
  fontMono?: string;
  radius?: string;
  surface?: string;
  icon?: string;
}

export interface ResolvedThemeSelection {
  sans: FontSpec;
  mono: FontSpec;
  display?: FontSpec;
  headingTracking?: string;
  fontPreset?: string;
  iconLibrary: string;
  baseColor?: BaseColorName;
  radius?: ResolvedRadius;
  surface?: SurfacePreset;
  hasFonts: boolean;
  hasRequestedFonts: boolean;
  hasIcon: boolean;
  hasTokens: boolean;
}

function firstDefined(values: Array<string | undefined>): string | undefined {
  return values.find((value) => value !== undefined);
}

/** Validate an explicit `--base-color` flag; returns undefined when omitted. */
export function resolveBaseColorOption(
  value?: string,
): BaseColorName | undefined {
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

function pickFontSlots(flags: ThemeFlags, theme: RawKiraThemeConfig) {
  const preset = flags.fontPreset
    ? resolveFontPreset(flags.fontPreset)
    : undefined;

  return {
    sans: firstDefined([flags.font, preset?.sans, theme.font]) ?? DEFAULT_SANS,
    mono:
      firstDefined([flags.fontMono, preset?.mono, theme.fontMono]) ??
      DEFAULT_MONO,
    display: flags.fontDisplay ?? (preset ? preset.display : theme.fontDisplay),
    fontPreset: preset ? preset.name : theme.fontPreset,
  };
}

function resolveTypographySelection(
  flags: ThemeFlags,
  raw: RawKiraConfig | null,
) {
  const theme: RawKiraThemeConfig = raw?.theme ?? {};
  const slots = pickFontSlots(flags, theme);

  const headingTracking = Object.values(FONT_PRESETS).find(
    (item) => item.name === slots.fontPreset,
  )?.headingTracking;

  const fontFlags = [
    flags.fontPreset,
    flags.font,
    flags.fontDisplay,
    flags.fontMono,
  ];

  const configFonts = [theme.font, theme.fontDisplay, theme.fontMono];

  return {
    sans: resolveFont("sans", slots.sans),
    mono: resolveFont("mono", slots.mono),
    display: slots.display ? resolveFont("display", slots.display) : undefined,
    headingTracking,
    fontPreset: slots.fontPreset,
    hasFonts: fontFlags.some(Boolean),
    hasRequestedFonts: [...fontFlags, ...configFonts].some(Boolean),
  };
}

/**
 * Resolve theme, typography, geometry, and icon flags against `kira-kit.json`
 * with one precedence contract shared by `init` and `theme`.
 */
export function resolveThemeSelection(
  cwd: string,
  flags: ThemeFlags,
): ResolvedThemeSelection {
  const raw = readRawConfig(cwd);
  const typo = resolveTypographySelection(flags, raw);
  const baseColor = resolveBaseColorOption(flags.baseColor);
  const radius = flags.radius ? resolveRadius(flags.radius) : undefined;
  const surface = flags.surface ? resolveSurface(flags.surface) : undefined;
  const iconChoice = firstDefined([flags.icon, raw?.iconLibrary]);

  return {
    ...typo,
    iconLibrary: resolveIconLibrary(iconChoice),
    baseColor,
    radius,
    surface,
    hasIcon: Boolean(flags.icon),
    hasTokens: Boolean(baseColor || radius || surface),
  };
}

export function attachThemeConfigFields(
  target: RawKiraThemeConfig,
  selection: ResolvedThemeSelection,
): void {
  if (selection.display) target.fontDisplay = selection.display.name;

  if (selection.fontPreset) target.fontPreset = selection.fontPreset;

  if (selection.radius) target.radius = selection.radius.name;

  if (selection.surface) target.surface = selection.surface.name;
}

export interface PersistThemeOptions {
  defaultBaseColor?: BaseColorName;
  preset?: string;
  primary?: string;
}

export function persistThemeConfig(
  cwd: string,
  selection: ResolvedThemeSelection,
  options: PersistThemeOptions = {},
): void {
  const raw = readRawConfig(cwd);

  if (!raw) return;

  const patch: Partial<RawKiraThemeConfig> = {};
  const nextBase = selection.baseColor ?? options.defaultBaseColor;

  if (options.preset) {
    patch.preset = options.preset;
    patch.primary = undefined;
  } else if (options.primary) {
    patch.primary = options.primary;
    patch.preset = undefined;
  }

  if (nextBase) patch.baseColor = nextBase;

  if (selection.radius) patch.radius = selection.radius.name;

  if (selection.surface) patch.surface = selection.surface.name;

  if (Object.keys(patch).length > 0) {
    updateThemeConfig(cwd, patch);
  }
}

export function buildStandaloneTokenVars(
  selection: Pick<ResolvedThemeSelection, "baseColor" | "radius" | "surface">,
): CssVars | null {
  const cssVars: CssVars = {};
  let changed = false;

  if (selection.baseColor) {
    const baseVars = generateBaseColorVars(selection.baseColor);

    cssVars.light = { ...cssVars.light, ...baseVars.light };
    cssVars.dark = { ...cssVars.dark, ...baseVars.dark };
    changed = true;
  }

  if (selection.surface) {
    cssVars.light = { ...cssVars.light, ...selection.surface.light };
    cssVars.dark = { ...cssVars.dark, ...selection.surface.dark };
    changed = true;
  }

  if (selection.radius) {
    cssVars.theme = { ...cssVars.theme, "--radius": selection.radius.value };
    cssVars.light = { ...cssVars.light, "--radius": selection.radius.value };
    changed = true;
  }

  return changed ? cssVars : null;
}

export function applyStandaloneTokens(
  cwd: string,
  selection: ResolvedThemeSelection,
): boolean {
  const cssVars = buildStandaloneTokenVars(selection);

  if (!cssVars) return false;

  const cssPath = join(cwd, detectCssPath(cwd));

  if (!existsSync(cssPath)) return false;

  return mergeCssVars(cssPath, cssVars);
}

/** Generate a custom OKLCH theme, printing a clean error on contrast failure. */
export function buildCustomTheme(
  primary: string,
  selection: Pick<ResolvedThemeSelection, "baseColor" | "radius" | "surface">,
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

/** Write `kira-theme.json` and apply a theme payload to the project CSS. */
export async function applyThemePayload(
  cwd: string,
  payload: RegistryItemPayload,
  force: boolean,
): Promise<void> {
  writeFileSync(
    join(cwd, "kira-theme.json"),
    JSON.stringify(payload, null, 2) + "\n",
    "utf-8",
  );

  await installItems(
    { items: [payload] },
    { cwd, yes: true, overwrite: force, skipDeps: true },
  );
}
