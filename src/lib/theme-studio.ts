import themeCatalog from "@/themes/catalog.json";
import { loadDocsFont } from "@/lib/docs-fonts";

export type DocBaseColorName =
  | "neutral"
  | "paper"
  | "stone"
  | "taupe"
  | "zinc"
  | "gray"
  | "anthracite"
  | "slate"
  | "mist"
  | "olive"
  | "mauve";

export type DocRadiusPresetName =
  "sharp" | "crisp" | "balanced" | "soft" | "pill";

export type DocSurfacePresetName = "hairline" | "tactile" | "elevated";

export type DocFontPresetName =
  "precision" | "editorial" | "atelier" | "terminal" | "expressive" | "fintech";

export interface DocBaseColorPreset {
  name: DocBaseColorName;
  title: string;
  family: "achromatic" | "warm" | "cool" | "tinted";
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface DocRadiusPreset {
  name: DocRadiusPresetName;
  title: string;
  value: string;
  description: string;
}

export interface DocSurfacePreset {
  name: DocSurfacePresetName;
  title: string;
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface DocsFont {
  name: string;
  family: string;
  stack: string;
  category: "sans" | "serif" | "mono";
}

export interface DocFontPreset {
  name: DocFontPresetName;
  title: string;
  badge: string;
  description: string;
  display: string;
  sans: string;
  mono: string;
  headingTracking: string;
}

export interface ThemeRecipeMeta {
  baseColor: DocBaseColorName;
  fontPreset: DocFontPresetName;
  radius?: DocRadiusPresetName;
  surface: DocSurfacePresetName;
}

export interface ThemeCssVars {
  theme?: Record<string, string>;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface ThemeTokenSelection {
  cssVars?: ThemeCssVars;
  baseColor: "auto" | DocBaseColorName;
  radius: "auto" | DocRadiusPresetName;
  surface: "auto" | DocSurfacePresetName;
}

export interface ResolvedThemeTokens {
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface GeneratedThemeCatalog {
  baseColors: DocBaseColorPreset[];
  radiusPresets: DocRadiusPreset[];
  surfacePresets: DocSurfacePreset[];
  fonts: {
    sans: DocsFont[];
    serif: DocsFont[];
    mono: DocsFont[];
  };
  fontPresets: DocFontPreset[];
  recipes: Record<string, ThemeRecipeMeta>;
}

// SAFETY: src/themes/catalog.json is emitted by kira-kit build directly from
// packages/cli/src/core/theme/* with the exact GeneratedThemeCatalog shape.
const catalog = themeCatalog as GeneratedThemeCatalog;

export const DOC_BASE_COLORS: DocBaseColorPreset[] = catalog.baseColors;

export const DOC_RADIUS_PRESETS: DocRadiusPreset[] = catalog.radiusPresets;

export const DOC_SURFACE_PRESETS: DocSurfacePreset[] = catalog.surfacePresets;

export const DOC_SANS_FONTS: DocsFont[] = catalog.fonts.sans;

export const DOC_SERIF_FONTS: DocsFont[] = catalog.fonts.serif;

export const DOC_DISPLAY_FONTS: DocsFont[] = [
  ...DOC_SANS_FONTS,
  ...DOC_SERIF_FONTS,
];

export const DOC_MONO_FONTS: DocsFont[] = catalog.fonts.mono;

export const DOC_FONT_PRESETS: DocFontPreset[] = catalog.fontPresets;

export const THEME_RECIPE_META: Record<string, ThemeRecipeMeta> =
  catalog.recipes;

export const DEFAULT_DOC_SANS = "geist";

export const DEFAULT_DOC_DISPLAY = "geist";

export const DEFAULT_DOC_MONO = "geist-mono";

export const DEFAULT_DOC_FONT_PRESET: DocFontPresetName = "precision";

export function findBaseColor(name: string): DocBaseColorPreset | undefined {
  return DOC_BASE_COLORS.find((item) => item.name === name);
}

export function findRadiusPreset(name: string): DocRadiusPreset | undefined {
  return DOC_RADIUS_PRESETS.find((item) => item.name === name);
}

export function findSurfacePreset(name: string): DocSurfacePreset | undefined {
  return DOC_SURFACE_PRESETS.find((item) => item.name === name);
}

export function findThemeRecipeMeta(name: string): ThemeRecipeMeta | undefined {
  if (!Object.hasOwn(THEME_RECIPE_META, name)) return undefined;

  return THEME_RECIPE_META[name];
}

export function findDocFont(
  kind: "sans" | "display" | "mono",
  name: string,
): DocsFont {
  let list = DOC_SANS_FONTS;

  if (kind === "mono") {
    list = DOC_MONO_FONTS;
  } else if (kind === "display") {
    list = DOC_DISPLAY_FONTS;
  }

  return list.find((font) => font.name === name) ?? list[0];
}

export function findDocFontPreset(name: string): DocFontPreset {
  return (
    DOC_FONT_PRESETS.find((preset) => preset.name === name) ??
    DOC_FONT_PRESETS[0]
  );
}

/**
 * Single pure token-cascade engine: compose preset cssVars + optional
 * baseColor, surface, and radius overrides for both light and dark modes.
 */
export function resolveThemeTokens(
  selection: ThemeTokenSelection,
): ResolvedThemeTokens {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  if (selection.cssVars) {
    Object.assign(light, selection.cssVars.light, selection.cssVars.theme);
    Object.assign(dark, selection.cssVars.dark, selection.cssVars.theme);
  }

  if (selection.baseColor !== "auto") {
    const base = findBaseColor(selection.baseColor);

    if (base) {
      Object.assign(light, base.light);
      Object.assign(dark, base.dark);
    }
  }

  if (selection.surface !== "auto") {
    const surf = findSurfacePreset(selection.surface);

    if (surf) {
      Object.assign(light, surf.light);
      Object.assign(dark, surf.dark);
    }
  }

  if (selection.radius !== "auto") {
    const rad = findRadiusPreset(selection.radius);

    if (rad) {
      light["--radius"] = rad.value;
      dark["--radius"] = rad.value;
    }
  }

  return { light, dark };
}

function formatDeclarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([token, value]) => `${token}:${value};`)
    .join("");
}

/** Compose a `:root` + `.dark` stylesheet from a theme selection, or null when empty. */
export function composeThemeCss(selection: ThemeTokenSelection): string | null {
  const { light, dark } = resolveThemeTokens(selection);

  if (Object.keys(light).length === 0 && Object.keys(dark).length === 0) {
    return null;
  }

  return `:root{${formatDeclarations(light)}}.dark{${formatDeclarations(dark)}}`;
}

const FONT_STYLE_ID = "kira-font-preview";

/**
 * Docs-only live font preview. Unlayered rules beat Tailwind's layered font
 * utilities (which inline literal stacks via @theme inline) and the :root
 * tokens retarget `var(--font-*)` consumers.
 */
export function applyFontPreview(
  sans: string,
  mono: string,
  display?: string,
  headingTracking?: string,
): void {
  const sansFont = findDocFont("sans", sans);
  const monoFont = findDocFont("mono", mono);
  const displayName = display ?? sans;
  const displayFont = findDocFont("display", displayName);
  const existing = document.getElementById(FONT_STYLE_ID);

  if (
    sans === DEFAULT_DOC_SANS &&
    mono === DEFAULT_DOC_MONO &&
    displayName === DEFAULT_DOC_DISPLAY
  ) {
    existing?.remove();

    return;
  }

  loadDocsFont(sans);
  loadDocsFont(mono);
  loadDocsFont(displayName);

  const style = existing ?? document.createElement("style");

  const trackingToken = headingTracking
    ? `;--tracking-kira-heading:${headingTracking}`
    : "";

  style.id = FONT_STYLE_ID;
  style.textContent = `:root{--font-sans:${sansFont.stack};--font-display:${displayFont.stack};--font-mono:${monoFont.stack}${trackingToken}}body{font-family:${sansFont.stack}}.font-display{font-family:${displayFont.stack}}.font-mono,code,pre,kbd,samp{font-family:${monoFont.stack}}`;

  if (!existing) document.head.appendChild(style);
}

export function initFontPreview(): void {
  try {
    const presetName = localStorage.getItem("kira-font-preset");

    if (presetName && presetName !== DEFAULT_DOC_FONT_PRESET) {
      const preset = findDocFontPreset(presetName);

      applyFontPreview(
        preset.sans,
        preset.mono,
        preset.display,
        preset.headingTracking,
      );

      return;
    }

    applyFontPreview(
      localStorage.getItem("kira-font") ?? DEFAULT_DOC_SANS,
      localStorage.getItem("kira-font-mono") ?? DEFAULT_DOC_MONO,
      localStorage.getItem("kira-font-display") ?? undefined,
    );
  } catch {
    // Storage unavailable — the preview stays at the defaults.
  }
}
