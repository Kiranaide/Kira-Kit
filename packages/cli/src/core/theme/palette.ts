import type { OklchColor } from "./color";

export type BaseColorName =
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

export type BaseColorFamily = "achromatic" | "warm" | "cool" | "tinted";

/**
 * Perceptually calibrated OKLCH envelope for a neutral/tinted base foundation.
 * Chroma follows a bell curve across lightness (gentle on the lightest canvas,
 * peaking across borders/muted/dark cards) so every base has unmistakable
 * atmosphere without breaking readability.
 */
export interface BaseColorSpec extends OklchColor {
  name: BaseColorName;
  title: string;
  description: string;
  family: BaseColorFamily;
  /** Hue used on dark surfaces (allows warm paper → roasted umber shifts). */
  darkH: number;
  /** Light-mode page background lightness. */
  lightBgL: number;
  /** Light-mode elevated card/popover lightness. */
  lightCardL: number;
  /** Dark-mode page background lightness. */
  darkBgL: number;
  /** Dark-mode elevated card lightness. */
  darkCardL: number;
  /** Peak light mid-tone chroma (borders, muted surfaces, muted text). */
  lightC: number;
  /** Peak dark surface chroma (cards, secondary, borders). */
  darkC: number;
}

function baseSpec(spec: Omit<BaseColorSpec, "l" | "c">): BaseColorSpec {
  return {
    ...spec,
    l: 0,
    c: spec.lightC,
  };
}

/** Curated OKLCH base color foundations (light + dark surface ramps). */
export const BASE_COLORS: Record<BaseColorName, BaseColorSpec> = {
  neutral: baseSpec({
    name: "neutral",
    title: "Neutral",
    description: "True achromatic gallery white and pure carbon dark.",
    family: "achromatic",
    h: 0,
    darkH: 0,
    lightBgL: 0.992,
    lightCardL: 1,
    darkBgL: 0.145,
    darkCardL: 0.195,
    lightC: 0,
    darkC: 0,
  }),
  paper: baseSpec({
    name: "paper",
    title: "Paper",
    description: "Warm book-linen light canvas paired with roasted umber dark.",
    family: "warm",
    h: 84,
    darkH: 62,
    lightBgL: 0.975,
    lightCardL: 0.992,
    darkBgL: 0.165,
    darkCardL: 0.215,
    lightC: 0.026,
    darkC: 0.028,
  }),
  stone: baseSpec({
    name: "stone",
    title: "Stone",
    description:
      "Mineral limestone neutrals and grounded basalt dark surfaces.",
    family: "warm",
    h: 60,
    darkH: 52,
    lightBgL: 0.978,
    lightCardL: 0.994,
    darkBgL: 0.16,
    darkCardL: 0.208,
    lightC: 0.016,
    darkC: 0.016,
  }),
  taupe: baseSpec({
    name: "taupe",
    title: "Taupe",
    description: "Soft architectural sand-gray with subtle clay warmth.",
    family: "warm",
    h: 72,
    darkH: 66,
    lightBgL: 0.976,
    lightCardL: 0.993,
    darkBgL: 0.162,
    darkCardL: 0.212,
    lightC: 0.02,
    darkC: 0.022,
  }),
  zinc: baseSpec({
    name: "zinc",
    title: "Zinc",
    description: "Minimal cool-gray foundation for crisp SaaS workspaces.",
    family: "cool",
    h: 263,
    darkH: 263,
    lightBgL: 0.985,
    lightCardL: 0.998,
    darkBgL: 0.145,
    darkCardL: 0.196,
    lightC: 0.01,
    darkC: 0.014,
  }),
  gray: baseSpec({
    name: "gray",
    title: "Gray",
    description: "Balanced cool silver neutral suited to enterprise tools.",
    family: "cool",
    h: 235,
    darkH: 240,
    lightBgL: 0.984,
    lightCardL: 0.997,
    darkBgL: 0.15,
    darkCardL: 0.202,
    lightC: 0.014,
    darkC: 0.018,
  }),
  anthracite: baseSpec({
    name: "anthracite",
    title: "Anthracite",
    description: "Dark-first OLED graphite with crisp cool silver daylight.",
    family: "cool",
    h: 268,
    darkH: 268,
    lightBgL: 0.985,
    lightCardL: 1,
    darkBgL: 0.132,
    darkCardL: 0.188,
    lightC: 0.014,
    darkC: 0.02,
  }),
  slate: baseSpec({
    name: "slate",
    title: "Slate",
    description: "Technical steel blue-gray and deep midnight-slate dark mode.",
    family: "cool",
    h: 250,
    darkH: 260,
    lightBgL: 0.976,
    lightCardL: 0.994,
    darkBgL: 0.155,
    darkCardL: 0.205,
    lightC: 0.026,
    darkC: 0.038,
  }),
  mist: baseSpec({
    name: "mist",
    title: "Mist",
    description:
      "Glacier aqua frost in daylight and deep fjord petrol at night.",
    family: "tinted",
    h: 204,
    darkH: 214,
    lightBgL: 0.975,
    lightCardL: 0.993,
    darkBgL: 0.158,
    darkCardL: 0.208,
    lightC: 0.028,
    darkC: 0.032,
  }),
  olive: baseSpec({
    name: "olive",
    title: "Olive",
    description:
      "Low-fatigue matcha wash paired with pine-shadow dark surfaces.",
    family: "tinted",
    h: 130,
    darkH: 140,
    lightBgL: 0.975,
    lightCardL: 0.993,
    darkBgL: 0.16,
    darkCardL: 0.21,
    lightC: 0.028,
    darkC: 0.029,
  }),
  mauve: baseSpec({
    name: "mauve",
    title: "Mauve",
    description: "Dusty lilac studio chalk and velvet aubergine dark surfaces.",
    family: "tinted",
    h: 328,
    darkH: 318,
    lightBgL: 0.975,
    lightCardL: 0.993,
    darkBgL: 0.16,
    darkCardL: 0.21,
    lightC: 0.026,
    darkC: 0.032,
  }),
};

// SAFETY: BASE_COLORS is declared with exactly one entry per BaseColorName
// member and no extras, so Object.keys returns the union members.
export const BASE_COLOR_NAMES = Object.keys(BASE_COLORS) as BaseColorName[];

export const BASE_COLOR_LIST: BaseColorSpec[] = BASE_COLOR_NAMES.map(
  (name) => BASE_COLORS[name],
);

/** Open token map: every semantic token name → its OKLCH color. */
export interface TokenMap {
  [token: string]: OklchColor;
}

export interface PaletteInput {
  primary: OklchColor;
  baseColor: BaseColorName;
  lightPrimaryForegroundLightness?: number;
  /** 4 hue offsets (degrees) after the primary for chart series 2-5. */
  chartHues?: number[];
}

export interface ThemeSchemes {
  light: TokenMap;
  dark: TokenMap;
}

export const DEFAULT_CHART_HUES = [60, 120, 200, 280];

function lightBaseTokens(base: BaseColorSpec): TokenMap {
  const { h, darkH, lightBgL, lightCardL, lightC: c } = base;
  const sidebarL = Math.max(0.955, lightBgL - 0.014);

  return {
    background: { l: lightBgL, c: c * 0.58, h },
    foreground: { l: 0.18, c: c * 0.85, h: darkH },
    card: { l: lightCardL, c: c * 0.3, h },
    "card-foreground": { l: 0.18, c: c * 0.85, h: darkH },
    popover: { l: lightCardL, c: c * 0.28, h },
    "popover-foreground": { l: 0.18, c: c * 0.85, h: darkH },
    secondary: { l: 0.936, c: c * 0.92, h },
    "secondary-foreground": { l: 0.24, c: c * 0.9, h: darkH },
    muted: { l: 0.936, c: c * 0.92, h },
    "muted-foreground": { l: 0.48, c: c * 1.15, h: darkH },
    accent: { l: 0.925, c: c * 0.98, h },
    "accent-foreground": { l: 0.2, c: c * 0.9, h: darkH },
    border: { l: 0.862, c: c * 1.0, h },
    input: { l: 0.862, c: c * 1.0, h },
    sidebar: { l: sidebarL, c: c * 0.72, h },
    "sidebar-foreground": { l: 0.18, c: c * 0.85, h: darkH },
    "sidebar-accent": { l: 0.922, c: c * 0.96, h },
    "sidebar-accent-foreground": { l: 0.2, c: c * 0.9, h: darkH },
    "sidebar-border": { l: 0.868, c: c * 0.98, h },
  };
}

function darkBaseTokens(base: BaseColorSpec): TokenMap {
  const { h: lightH, darkH: h, darkBgL, darkCardL, darkC: c } = base;

  return {
    background: { l: darkBgL, c: c * 0.78, h },
    foreground: { l: 0.96, c: c * 0.36, h: lightH },
    card: { l: darkCardL, c: c * 0.9, h },
    "card-foreground": { l: 0.96, c: c * 0.36, h: lightH },
    popover: { l: darkCardL + 0.015, c: c * 0.92, h },
    "popover-foreground": { l: 0.96, c: c * 0.36, h: lightH },
    secondary: { l: darkCardL + 0.055, c: c * 1.0, h },
    "secondary-foreground": { l: 0.91, c: c * 0.48, h: lightH },
    muted: { l: darkCardL + 0.045, c: c * 0.96, h },
    "muted-foreground": { l: 0.71, c: c * 0.82, h: lightH },
    accent: { l: darkCardL + 0.072, c: c * 1.04, h },
    "accent-foreground": { l: 0.96, c: c * 0.36, h: lightH },
    border: { l: darkCardL + 0.125, c: c * 1.0, h },
    input: { l: darkCardL + 0.125, c: c * 1.0, h },
    sidebar: { l: darkBgL + 0.022, c: c * 0.84, h },
    "sidebar-foreground": { l: 0.96, c: c * 0.36, h: lightH },
    "sidebar-accent": { l: darkCardL + 0.055, c: c * 0.98, h },
    "sidebar-accent-foreground": { l: 0.96, c: c * 0.36, h: lightH },
    "sidebar-border": { l: darkCardL + 0.12, c: c * 0.96, h },
  };
}

function lightSemanticTokens(): TokenMap {
  return {
    destructive: { l: 0.55, c: 0.21, h: 25 },
    "destructive-foreground": { l: 0.985, c: 0.01, h: 25 },
    info: { l: 0.54, c: 0.17, h: 242 },
    "info-foreground": { l: 0.985, c: 0.01, h: 242 },
    success: { l: 0.5, c: 0.15, h: 152 },
    "success-foreground": { l: 0.985, c: 0.01, h: 152 },
    warning: { l: 0.78, c: 0.16, h: 78 },
    "warning-foreground": { l: 0.22, c: 0.04, h: 78 },
  };
}

function darkSemanticTokens(): TokenMap {
  return {
    destructive: { l: 0.62, c: 0.2, h: 24 },
    "destructive-foreground": { l: 0.2, c: 0.01, h: 24 },
    info: { l: 0.7, c: 0.15, h: 236 },
    "info-foreground": { l: 0.16, c: 0.04, h: 236 },
    success: { l: 0.7, c: 0.16, h: 152 },
    "success-foreground": { l: 0.16, c: 0.04, h: 152 },
    warning: { l: 0.78, c: 0.15, h: 80 },
    "warning-foreground": { l: 0.18, c: 0.04, h: 80 },
  };
}

function lightScheme(
  base: BaseColorSpec,
  primary: OklchColor,
  hueOffsets: number[],
  foregroundLightness = 0.99,
): TokenMap {
  const primaryForeground = { l: foregroundLightness, c: 0.01, h: primary.h };

  return {
    ...lightBaseTokens(base),
    primary,
    "primary-foreground": primaryForeground,
    ...lightSemanticTokens(),
    ring: { ...primary },
    "chart-1": { l: 0.58, c: Math.min(primary.c, 0.16), h: primary.h },
    "chart-2": {
      l: 0.6,
      c: Math.min(primary.c, 0.15),
      h: wrapHue(primary.h + hueOffsets[0]),
    },
    "chart-3": {
      l: 0.6,
      c: Math.min(primary.c, 0.15),
      h: wrapHue(primary.h + hueOffsets[1]),
    },
    "chart-4": {
      l: 0.6,
      c: Math.min(primary.c, 0.15),
      h: wrapHue(primary.h + hueOffsets[2]),
    },
    "chart-5": {
      l: 0.6,
      c: Math.min(primary.c, 0.15),
      h: wrapHue(primary.h + hueOffsets[3]),
    },
    "sidebar-primary": { ...primary },
    "sidebar-primary-foreground": primaryForeground,
    "sidebar-ring": { ...primary },
  };
}

function darkScheme(
  base: BaseColorSpec,
  primary: OklchColor,
  hueOffsets: number[],
): TokenMap {
  const darkPrimary = { l: 0.72, c: primary.c, h: primary.h };

  return {
    ...darkBaseTokens(base),
    primary: darkPrimary,
    "primary-foreground": { l: 0.16, c: primary.c * 0.25, h: primary.h },
    ...darkSemanticTokens(),
    ring: { ...darkPrimary },
    "chart-1": { l: 0.72, c: Math.min(primary.c, 0.15), h: primary.h },
    "chart-2": {
      l: 0.72,
      c: Math.min(primary.c, 0.14),
      h: wrapHue(primary.h + hueOffsets[0]),
    },
    "chart-3": {
      l: 0.72,
      c: Math.min(primary.c, 0.14),
      h: wrapHue(primary.h + hueOffsets[1]),
    },
    "chart-4": {
      l: 0.72,
      c: Math.min(primary.c, 0.14),
      h: wrapHue(primary.h + hueOffsets[2]),
    },
    "chart-5": {
      l: 0.72,
      c: Math.min(primary.c, 0.14),
      h: wrapHue(primary.h + hueOffsets[3]),
    },
    "sidebar-primary": { ...darkPrimary },
    "sidebar-primary-foreground": {
      l: 0.16,
      c: primary.c * 0.25,
      h: primary.h,
    },
    "sidebar-ring": { ...darkPrimary },
  };
}

/**
 * Build standalone neutral surface/border/text/sidebar tokens for a base color
 * without touching primary, accent status, or chart tokens.
 */
export function buildBaseSchemes(baseColor: BaseColorName): ThemeSchemes {
  const base = BASE_COLORS[baseColor];

  return {
    light: lightBaseTokens(base),
    dark: darkBaseTokens(base),
  };
}

/**
 * Build the initial light + dark token maps numerically from the primary
 * and base color. Foregrounds are derived from the primary (or base) hue;
 * contrast verification adjusts lightness afterwards.
 */
export function buildSchemes(input: PaletteInput): ThemeSchemes {
  const base = BASE_COLORS[input.baseColor];
  const primary = { ...input.primary };
  const hueOffsets = input.chartHues ?? DEFAULT_CHART_HUES;

  return {
    light: lightScheme(
      base,
      primary,
      hueOffsets,
      input.lightPrimaryForegroundLightness,
    ),
    dark: darkScheme(base, primary, hueOffsets),
  };
}

function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360;
}
