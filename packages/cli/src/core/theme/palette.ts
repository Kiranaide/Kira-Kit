import type { OklchColor } from "./color";

export type BaseColorName =
  | "neutral"
  | "stone"
  | "zinc"
  | "gray"
  | "slate"
  | "mauve"
  | "olive"
  | "mist"
  | "taupe";

/** Subtle hue/chroma signature per base color (OKLCH). */
export const BASE_COLORS: Record<BaseColorName, OklchColor> = {
  neutral: { l: 0, c: 0, h: 0 },
  stone: { l: 0, c: 0.004, h: 67 },
  zinc: { l: 0, c: 0.002, h: 263 },
  gray: { l: 0, c: 0.002, h: 220 },
  slate: { l: 0, c: 0.004, h: 233 },
  mauve: { l: 0, c: 0.004, h: 320 },
  olive: { l: 0, c: 0.005, h: 110 },
  mist: { l: 0, c: 0.006, h: 200 },
  taupe: { l: 0, c: 0.005, h: 80 },
};

// SAFETY: BASE_COLORS is declared with exactly one entry per BaseColorName
// member and no extras, so Object.keys returns the union members.
export const BASE_COLOR_NAMES = Object.keys(BASE_COLORS) as BaseColorName[];

/** Open token map: every shadcn semantic token name → its OKLCH color. */
export interface TokenMap {
  [token: string]: OklchColor;
}

export interface PaletteInput {
  primary: OklchColor;
  baseColor: BaseColorName;
  /** 4 hue offsets (degrees) after the primary for chart series 2-5. */
  chartHues?: number[];
}

export interface ThemeSchemes {
  light: TokenMap;
  dark: TokenMap;
}

export const DEFAULT_CHART_HUES = [60, 120, 200, 280];

/**
 * Build the initial light + dark token maps numerically from the primary
 * and base color. Foregrounds are derived from the primary (or base) hue;
 * contrast verification adjusts lightness afterwards.
 */
export function buildSchemes(input: PaletteInput): ThemeSchemes {
  const base = BASE_COLORS[input.baseColor];
  const primary = { ...input.primary };
  const hueOffsets = input.chartHues ?? DEFAULT_CHART_HUES;

  const light: TokenMap = {
    background: { l: 1, c: base.c * 0.1, h: base.h },
    foreground: { l: 0.16, c: base.c, h: base.h },
    card: { l: 1, c: base.c * 0.1, h: base.h },
    "card-foreground": { l: 0.16, c: base.c, h: base.h },
    popover: { l: 1, c: base.c * 0.1, h: base.h },
    "popover-foreground": { l: 0.16, c: base.c, h: base.h },
    primary,
    "primary-foreground": { l: 0.99, c: 0.01, h: primary.h },
    secondary: { l: 0.965, c: base.c * 1.5, h: base.h },
    "secondary-foreground": { l: 0.25, c: base.c, h: base.h },
    muted: { l: 0.965, c: base.c * 1.5, h: base.h },
    "muted-foreground": { l: 0.55, c: base.c, h: base.h },
    accent: { l: 0.965, c: base.c * 1.5, h: base.h },
    "accent-foreground": { l: 0.2, c: base.c, h: base.h },
    destructive: { l: 0.58, c: 0.21, h: 27 },
    "destructive-foreground": { l: 0.985, c: 0.01, h: 27 },
    border: { l: 0.9, c: base.c * 2, h: base.h },
    input: { l: 0.9, c: base.c * 2, h: base.h },
    ring: { ...primary },
    "chart-1": { l: 0.6, c: Math.min(primary.c, 0.16), h: primary.h },
    "chart-2": { l: 0.62, c: Math.min(primary.c, 0.15), h: wrapHue(primary.h + hueOffsets[0]) },
    "chart-3": { l: 0.62, c: Math.min(primary.c, 0.15), h: wrapHue(primary.h + hueOffsets[1]) },
    "chart-4": { l: 0.62, c: Math.min(primary.c, 0.15), h: wrapHue(primary.h + hueOffsets[2]) },
    "chart-5": { l: 0.62, c: Math.min(primary.c, 0.15), h: wrapHue(primary.h + hueOffsets[3]) },
    sidebar: { l: 0.99, c: base.c * 0.5, h: base.h },
    "sidebar-foreground": { l: 0.16, c: base.c, h: base.h },
    "sidebar-primary": { ...primary },
    "sidebar-primary-foreground": { l: 0.99, c: 0.01, h: primary.h },
    "sidebar-accent": { l: 0.955, c: base.c * 1.5, h: base.h },
    "sidebar-accent-foreground": { l: 0.2, c: base.c, h: base.h },
    "sidebar-border": { l: 0.9, c: base.c * 2, h: base.h },
    "sidebar-ring": { ...primary },
  };

  const darkPrimary = { l: 0.72, c: primary.c, h: primary.h };

  const dark: TokenMap = {
    background: { l: 0.145, c: base.c * 1.2, h: base.h },
    foreground: { l: 0.97, c: base.c * 0.5, h: base.h },
    card: { l: 0.18, c: base.c * 1.2, h: base.h },
    "card-foreground": { l: 0.97, c: base.c * 0.5, h: base.h },
    popover: { l: 0.18, c: base.c * 1.2, h: base.h },
    "popover-foreground": { l: 0.97, c: base.c * 0.5, h: base.h },
    primary: darkPrimary,
    "primary-foreground": { l: 0.16, c: primary.c * 0.25, h: primary.h },
    secondary: { l: 0.24, c: base.c * 2.5, h: base.h },
    "secondary-foreground": { l: 0.9, c: base.c, h: base.h },
    muted: { l: 0.22, c: base.c * 2, h: base.h },
    "muted-foreground": { l: 0.7, c: base.c, h: base.h },
    accent: { l: 0.27, c: base.c * 2.5, h: base.h },
    "accent-foreground": { l: 0.97, c: base.c * 0.5, h: base.h },
    destructive: { l: 0.58, c: 0.2, h: 27 },
    "destructive-foreground": { l: 0.985, c: 0.01, h: 27 },
    border: { l: 0.3, c: base.c * 2, h: base.h },
    input: { l: 0.3, c: base.c * 2, h: base.h },
    ring: { ...darkPrimary },
    "chart-1": { l: 0.72, c: Math.min(primary.c, 0.15), h: primary.h },
    "chart-2": { l: 0.72, c: Math.min(primary.c, 0.14), h: wrapHue(primary.h + hueOffsets[0]) },
    "chart-3": { l: 0.72, c: Math.min(primary.c, 0.14), h: wrapHue(primary.h + hueOffsets[1]) },
    "chart-4": { l: 0.72, c: Math.min(primary.c, 0.14), h: wrapHue(primary.h + hueOffsets[2]) },
    "chart-5": { l: 0.72, c: Math.min(primary.c, 0.14), h: wrapHue(primary.h + hueOffsets[3]) },
    sidebar: { l: 0.16, c: base.c, h: base.h },
    "sidebar-foreground": { l: 0.97, c: base.c * 0.5, h: base.h },
    "sidebar-primary": { ...darkPrimary },
    "sidebar-primary-foreground": { l: 0.16, c: primary.c * 0.25, h: primary.h },
    "sidebar-accent": { l: 0.25, c: base.c * 2, h: base.h },
    "sidebar-accent-foreground": { l: 0.97, c: base.c * 0.5, h: base.h },
    "sidebar-border": { l: 0.3, c: base.c * 2, h: base.h },
    "sidebar-ring": { ...darkPrimary },
  };

  return { light, dark };
}

function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360;
}
