import type { DocFontPresetName } from "./fonts";

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

export interface DocBaseColorPreset {
  name: DocBaseColorName;
  title: string;
  family: "achromatic" | "warm" | "cool" | "tinted";
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface BaseCurve {
  name: DocBaseColorName;
  title: string;
  family: "achromatic" | "warm" | "cool" | "tinted";
  description: string;
  h: number;
  darkH: number;
  lightBgL: number;
  lightCardL: number;
  darkBgL: number;
  darkCardL: number;
  lightC: number;
  darkC: number;
}

function oklch(l: number, c: number, h: number): string {
  const rl = Math.round(l * 1000) / 1000;
  const rc = Math.round(c * 1000) / 1000;
  const rh = Math.round(h * 10) / 10;

  return `oklch(${rl} ${rc} ${rh})`;
}

/** Mirrors packages/cli/src/core/theme/palette.ts calibrated OKLCH curves. */
function buildBasePreset(spec: BaseCurve): DocBaseColorPreset {
  const { h, darkH, lightBgL, lightCardL, darkBgL, darkCardL, lightC, darkC } =
    spec;

  const sidebarL = Math.max(0.955, lightBgL - 0.014);

  return {
    name: spec.name,
    title: spec.title,
    family: spec.family,
    description: spec.description,
    light: {
      "--background": oklch(lightBgL, lightC * 0.58, h),
      "--foreground": oklch(0.18, lightC * 0.85, darkH),
      "--card": oklch(lightCardL, lightC * 0.3, h),
      "--card-foreground": oklch(0.18, lightC * 0.85, darkH),
      "--popover": oklch(lightCardL, lightC * 0.28, h),
      "--popover-foreground": oklch(0.18, lightC * 0.85, darkH),
      "--secondary": oklch(0.936, lightC * 0.92, h),
      "--secondary-foreground": oklch(0.24, lightC * 0.9, darkH),
      "--muted": oklch(0.936, lightC * 0.92, h),
      "--muted-foreground": oklch(0.48, lightC * 1.15, darkH),
      "--accent": oklch(0.925, lightC * 0.98, h),
      "--accent-foreground": oklch(0.2, lightC * 0.9, darkH),
      "--border": oklch(0.862, lightC, h),
      "--input": oklch(0.862, lightC, h),
      "--sidebar": oklch(sidebarL, lightC * 0.72, h),
      "--sidebar-foreground": oklch(0.18, lightC * 0.85, darkH),
      "--sidebar-accent": oklch(0.922, lightC * 0.96, h),
      "--sidebar-accent-foreground": oklch(0.2, lightC * 0.9, darkH),
      "--sidebar-border": oklch(0.868, lightC * 0.98, h),
    },
    dark: {
      "--background": oklch(darkBgL, darkC * 0.78, darkH),
      "--foreground": oklch(0.96, darkC * 0.36, h),
      "--card": oklch(darkCardL, darkC * 0.9, darkH),
      "--card-foreground": oklch(0.96, darkC * 0.36, h),
      "--popover": oklch(darkCardL + 0.015, darkC * 0.92, darkH),
      "--popover-foreground": oklch(0.96, darkC * 0.36, h),
      "--secondary": oklch(darkCardL + 0.055, darkC, darkH),
      "--secondary-foreground": oklch(0.91, darkC * 0.48, h),
      "--muted": oklch(darkCardL + 0.045, darkC * 0.96, darkH),
      "--muted-foreground": oklch(0.71, darkC * 0.82, h),
      "--accent": oklch(darkCardL + 0.072, darkC * 1.04, darkH),
      "--accent-foreground": oklch(0.96, darkC * 0.36, h),
      "--border": oklch(darkCardL + 0.125, darkC, darkH),
      "--input": oklch(darkCardL + 0.125, darkC, darkH),
      "--sidebar": oklch(darkBgL + 0.022, darkC * 0.84, darkH),
      "--sidebar-foreground": oklch(0.96, darkC * 0.36, h),
      "--sidebar-accent": oklch(darkCardL + 0.055, darkC * 0.98, darkH),
      "--sidebar-accent-foreground": oklch(0.96, darkC * 0.36, h),
      "--sidebar-border": oklch(darkCardL + 0.12, darkC * 0.96, darkH),
    },
  };
}

export const DOC_BASE_COLORS: DocBaseColorPreset[] = [
  buildBasePreset({
    name: "neutral",
    title: "Neutral",
    family: "achromatic",
    description: "True achromatic gallery white and pure carbon dark.",
    h: 0,
    darkH: 0,
    lightBgL: 0.992,
    lightCardL: 1,
    darkBgL: 0.145,
    darkCardL: 0.195,
    lightC: 0,
    darkC: 0,
  }),
  buildBasePreset({
    name: "paper",
    title: "Paper",
    family: "warm",
    description: "Warm book-linen light canvas paired with roasted umber dark.",
    h: 84,
    darkH: 62,
    lightBgL: 0.975,
    lightCardL: 0.992,
    darkBgL: 0.165,
    darkCardL: 0.215,
    lightC: 0.026,
    darkC: 0.028,
  }),
  buildBasePreset({
    name: "stone",
    title: "Stone",
    family: "warm",
    description:
      "Mineral limestone neutrals and grounded basalt dark surfaces.",
    h: 60,
    darkH: 52,
    lightBgL: 0.978,
    lightCardL: 0.994,
    darkBgL: 0.16,
    darkCardL: 0.208,
    lightC: 0.016,
    darkC: 0.016,
  }),
  buildBasePreset({
    name: "taupe",
    title: "Taupe",
    family: "warm",
    description: "Soft architectural sand-gray with subtle clay warmth.",
    h: 72,
    darkH: 66,
    lightBgL: 0.976,
    lightCardL: 0.993,
    darkBgL: 0.162,
    darkCardL: 0.212,
    lightC: 0.02,
    darkC: 0.022,
  }),
  buildBasePreset({
    name: "zinc",
    title: "Zinc",
    family: "cool",
    description: "Minimal cool-gray foundation for crisp SaaS workspaces.",
    h: 263,
    darkH: 263,
    lightBgL: 0.985,
    lightCardL: 0.998,
    darkBgL: 0.145,
    darkCardL: 0.196,
    lightC: 0.01,
    darkC: 0.014,
  }),
  buildBasePreset({
    name: "gray",
    title: "Gray",
    family: "cool",
    description: "Balanced cool silver neutral suited to enterprise tools.",
    h: 235,
    darkH: 240,
    lightBgL: 0.984,
    lightCardL: 0.997,
    darkBgL: 0.15,
    darkCardL: 0.202,
    lightC: 0.014,
    darkC: 0.018,
  }),
  buildBasePreset({
    name: "anthracite",
    title: "Anthracite",
    family: "cool",
    description: "Dark-first OLED graphite with crisp cool silver daylight.",
    h: 268,
    darkH: 268,
    lightBgL: 0.985,
    lightCardL: 1,
    darkBgL: 0.132,
    darkCardL: 0.188,
    lightC: 0.014,
    darkC: 0.02,
  }),
  buildBasePreset({
    name: "slate",
    title: "Slate",
    family: "cool",
    description: "Technical steel blue-gray and deep midnight-slate dark mode.",
    h: 250,
    darkH: 260,
    lightBgL: 0.976,
    lightCardL: 0.994,
    darkBgL: 0.155,
    darkCardL: 0.205,
    lightC: 0.026,
    darkC: 0.038,
  }),
  buildBasePreset({
    name: "mist",
    title: "Mist",
    family: "tinted",
    description:
      "Glacier aqua frost in daylight and deep fjord petrol at night.",
    h: 204,
    darkH: 214,
    lightBgL: 0.975,
    lightCardL: 0.993,
    darkBgL: 0.158,
    darkCardL: 0.208,
    lightC: 0.028,
    darkC: 0.032,
  }),
  buildBasePreset({
    name: "olive",
    title: "Olive",
    family: "tinted",
    description:
      "Low-fatigue matcha wash paired with pine-shadow dark surfaces.",
    h: 130,
    darkH: 140,
    lightBgL: 0.975,
    lightCardL: 0.993,
    darkBgL: 0.16,
    darkCardL: 0.21,
    lightC: 0.028,
    darkC: 0.029,
  }),
  buildBasePreset({
    name: "mauve",
    title: "Mauve",
    family: "tinted",
    description: "Dusty lilac studio chalk and velvet aubergine dark surfaces.",
    h: 328,
    darkH: 318,
    lightBgL: 0.975,
    lightCardL: 0.993,
    darkBgL: 0.16,
    darkCardL: 0.21,
    lightC: 0.026,
    darkC: 0.032,
  }),
];

export interface DocRadiusPreset {
  name: DocRadiusPresetName;
  title: string;
  value: string;
  description: string;
}

export const DOC_RADIUS_PRESETS: DocRadiusPreset[] = [
  {
    name: "sharp",
    title: "Sharp",
    value: "0rem",
    description: "Architectural 0px corners for consoles & editorial grids.",
  },
  {
    name: "crisp",
    title: "Crisp",
    value: "0.375rem",
    description: "Tight 6px corners for developer tools & dense workspaces.",
  },
  {
    name: "balanced",
    title: "Balanced",
    value: "0.625rem",
    description: "Versatile 10px corners balancing clarity & warmth.",
  },
  {
    name: "soft",
    title: "Soft",
    value: "0.875rem",
    description: "Generous 14px corners for calm consumer products.",
  },
  {
    name: "pill",
    title: "Pill",
    value: "1.25rem",
    description: "Expressive 20px geometry for playful, tactile apps.",
  },
];

export interface DocSurfacePreset {
  name: DocSurfacePresetName;
  title: string;
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const DOC_SURFACE_PRESETS: DocSurfacePreset[] = [
  {
    name: "hairline",
    title: "Hairline",
    description: "Flat 1px borders with zero card shadow for dense clarity.",
    light: {
      "--shadow-card": "0 0 transparent",
      "--shadow-popover": "0 4px 12px oklch(0 0 0 / 8%)",
      "--shadow-modal": "0 16px 40px oklch(0 0 0 / 16%)",
    },
    dark: {
      "--shadow-card": "0 0 transparent",
      "--shadow-popover": "0 4px 16px oklch(0 0 0 / 40%)",
      "--shadow-modal": "0 20px 48px oklch(0 0 0 / 60%)",
    },
  },
  {
    name: "tactile",
    title: "Tactile",
    description: "Subtle top specular highlight and hardware micro-depth.",
    light: {
      "--shadow-card":
        "inset 0 1px 0 oklch(1 0 0 / 70%), 0 1px 2px oklch(0 0 0 / 5%)",
      "--shadow-popover":
        "inset 0 1px 0 oklch(1 0 0 / 75%), 0 8px 24px -4px oklch(0 0 0 / 10%), 0 2px 6px oklch(0 0 0 / 5%)",
      "--shadow-modal":
        "inset 0 1px 0 oklch(1 0 0 / 80%), 0 24px 56px -12px oklch(0 0 0 / 20%)",
    },
    dark: {
      "--shadow-card":
        "inset 0 1px 0 oklch(1 0 0 / 8%), 0 1px 2px oklch(0 0 0 / 32%)",
      "--shadow-popover":
        "inset 0 1px 0 oklch(1 0 0 / 10%), 0 12px 28px -4px oklch(0 0 0 / 48%)",
      "--shadow-modal":
        "inset 0 1px 0 oklch(1 0 0 / 12%), 0 28px 64px -12px oklch(0 0 0 / 68%)",
    },
  },
  {
    name: "elevated",
    title: "Elevated",
    description: "Soft layered ambient elevation for airy floating surfaces.",
    light: {
      "--shadow-card":
        "0 2px 8px -2px oklch(0 0 0 / 7%), 0 1px 2px oklch(0 0 0 / 4%)",
      "--shadow-popover":
        "0 12px 32px -6px oklch(0 0 0 / 12%), 0 4px 10px -2px oklch(0 0 0 / 5%)",
      "--shadow-modal":
        "0 28px 64px -12px oklch(0 0 0 / 22%), 0 8px 20px -4px oklch(0 0 0 / 8%)",
    },
    dark: {
      "--shadow-card":
        "0 2px 10px -2px oklch(0 0 0 / 42%), 0 1px 2px oklch(0 0 0 / 30%)",
      "--shadow-popover":
        "0 16px 36px -6px oklch(0 0 0 / 56%), 0 4px 12px oklch(0 0 0 / 36%)",
      "--shadow-modal":
        "0 32px 72px -12px oklch(0 0 0 / 74%), 0 10px 24px oklch(0 0 0 / 48%)",
    },
  },
];

export interface ThemeRecipeMeta {
  baseColor: DocBaseColorName;
  fontPreset: DocFontPresetName;
  radius?: DocRadiusPresetName;
  surface: DocSurfacePresetName;
}

/** Curated October 2026 pairing metadata per built-in theme preset. */
export const THEME_RECIPE_META = {
  "theme-default": {
    baseColor: "neutral",
    fontPreset: "precision",
    surface: "tactile",
  },
  "theme-ember-press": {
    baseColor: "paper",
    fontPreset: "editorial",
    radius: "crisp",
    surface: "tactile",
  },
  "theme-oxblood-atelier": {
    baseColor: "stone",
    fontPreset: "atelier",
    radius: "balanced",
    surface: "elevated",
  },
  "theme-olive-ledger": {
    baseColor: "olive",
    fontPreset: "editorial",
    radius: "crisp",
    surface: "hairline",
  },
  "theme-laurel-study": {
    baseColor: "mist",
    fontPreset: "atelier",
    radius: "soft",
    surface: "elevated",
  },
  "theme-phase-line": {
    baseColor: "slate",
    fontPreset: "terminal",
    radius: "sharp",
    surface: "hairline",
  },
  "theme-cryostat": {
    baseColor: "mist",
    fontPreset: "terminal",
    radius: "crisp",
    surface: "tactile",
  },
  "theme-low-orbit": {
    baseColor: "slate",
    fontPreset: "precision",
    radius: "crisp",
    surface: "tactile",
  },
  "theme-cobalt-studio": {
    baseColor: "anthracite",
    fontPreset: "fintech",
    radius: "balanced",
    surface: "tactile",
  },
  "theme-coral-circuit": {
    baseColor: "paper",
    fontPreset: "expressive",
    radius: "soft",
    surface: "tactile",
  },
  "theme-magenta-riot": {
    baseColor: "mauve",
    fontPreset: "expressive",
    radius: "balanced",
    surface: "elevated",
  },
} satisfies Record<string, ThemeRecipeMeta>;

export function findThemeRecipeMeta(name: string): ThemeRecipeMeta | undefined {
  if (!Object.hasOwn(THEME_RECIPE_META, name)) return undefined;

  // SAFETY: Object.hasOwn guarantees `name` is a key of THEME_RECIPE_META.
  return THEME_RECIPE_META[name as keyof typeof THEME_RECIPE_META];
}

export function findBaseColor(name: string): DocBaseColorPreset | undefined {
  return DOC_BASE_COLORS.find((item) => item.name === name);
}

export function findRadiusPreset(name: string): DocRadiusPreset | undefined {
  return DOC_RADIUS_PRESETS.find((item) => item.name === name);
}

export function findSurfacePreset(name: string): DocSurfacePreset | undefined {
  return DOC_SURFACE_PRESETS.find((item) => item.name === name);
}
