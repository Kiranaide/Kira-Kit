import { ValidationError } from "../../lib/errors";

export type FontKind = "sans" | "mono" | "display";

export interface FontSpec {
  name: string;
  pkg: string;
  family: string;
  stack: string;
  category: "sans" | "serif" | "mono";
}

/** Named owner contract for a font catalog keyed by kebab-case font name. */
export interface FontCatalog {
  [name: string]: FontSpec;
}

function fontFallback(category: "sans" | "serif" | "mono"): string {
  if (category === "mono") return "ui-monospace, monospace";

  if (category === "serif") return "ui-serif, Georgia, serif";

  return "ui-sans-serif, system-ui, sans-serif";
}

function spec(
  name: string,
  family: string,
  category: "sans" | "serif" | "mono",
): FontSpec {
  return {
    name,
    pkg: `@fontsource-variable/${name}`,
    family,
    stack: `"${family}", ${fontFallback(category)}`,
    category,
  };
}

export const SANS_FONTS = {
  geist: spec("geist", "Geist Variable", "sans"),
  "instrument-sans": spec(
    "instrument-sans",
    "Instrument Sans Variable",
    "sans",
  ),
  inter: spec("inter", "Inter Variable", "sans"),
  manrope: spec("manrope", "Manrope Variable", "sans"),
  "plus-jakarta-sans": spec(
    "plus-jakarta-sans",
    "Plus Jakarta Sans Variable",
    "sans",
  ),
  "space-grotesk": spec("space-grotesk", "Space Grotesk Variable", "sans"),
  "dm-sans": spec("dm-sans", "DM Sans Variable", "sans"),
  "bricolage-grotesque": spec(
    "bricolage-grotesque",
    "Bricolage Grotesque Variable",
    "sans",
  ),
  sora: spec("sora", "Sora Variable", "sans"),
  outfit: spec("outfit", "Outfit Variable", "sans"),
} satisfies Record<string, FontSpec>;

export const SERIF_FONTS = {
  newsreader: spec("newsreader", "Newsreader Variable", "serif"),
  fraunces: spec("fraunces", "Fraunces Variable", "serif"),
} satisfies Record<string, FontSpec>;

export const DISPLAY_FONTS = {
  ...SANS_FONTS,
  ...SERIF_FONTS,
} satisfies Record<string, FontSpec>;

export const MONO_FONTS = {
  "geist-mono": spec("geist-mono", "Geist Mono Variable", "mono"),
  "jetbrains-mono": spec("jetbrains-mono", "JetBrains Mono Variable", "mono"),
  "fira-code": spec("fira-code", "Fira Code Variable", "mono"),
} satisfies Record<string, FontSpec>;

export type SansFontName = keyof typeof SANS_FONTS;

export type DisplayFontName = keyof typeof DISPLAY_FONTS;

export type MonoFontName = keyof typeof MONO_FONTS;

export interface FontPreset {
  name: string;
  title: string;
  description: string;
  badge: string;
  display: DisplayFontName;
  sans: SansFontName;
  mono: MonoFontName;
  headingTracking: string;
}

/** Curated October 2026 font pairings (Display + Body + Technical Mono). */
export const FONT_PRESETS = {
  precision: {
    name: "precision",
    title: "Precision Studio",
    description:
      "Crisp engineered neo-grotesque paired with matching monospace for dashboards and developer platforms.",
    badge: "Default",
    display: "geist",
    sans: "geist",
    mono: "geist-mono",
    headingTracking: "-0.025em",
  },
  editorial: {
    name: "editorial",
    title: "Editorial Press",
    description:
      "Optical-size transitional serif headlines anchored by clean Instrument Sans body copy and JetBrains Mono metadata.",
    badge: "Serif + Sans",
    display: "newsreader",
    sans: "instrument-sans",
    mono: "jetbrains-mono",
    headingTracking: "-0.02em",
  },
  atelier: {
    name: "atelier",
    title: "Atelier Craft",
    description:
      "Expressive soft-serif display paired with warm geometric-humanist Plus Jakarta Sans for boutique products.",
    badge: "Soft Serif",
    display: "fraunces",
    sans: "plus-jakarta-sans",
    mono: "geist-mono",
    headingTracking: "-0.02em",
  },
  terminal: {
    name: "terminal",
    title: "Blueprint Terminal",
    description:
      "Neutral technical sans paired with high-legibility JetBrains Mono for AI consoles, telemetry, and docs.",
    badge: "Dev / AI",
    display: "instrument-sans",
    sans: "instrument-sans",
    mono: "jetbrains-mono",
    headingTracking: "-0.02em",
  },
  expressive: {
    name: "expressive",
    title: "Expressive Lab",
    description:
      "Multi-axis Bricolage Grotesque headings balanced by quiet DM Sans UI text and ligature-rich Fira Code.",
    badge: "Grotesk",
    display: "bricolage-grotesque",
    sans: "dm-sans",
    mono: "fira-code",
    headingTracking: "-0.03em",
  },
  fintech: {
    name: "fintech",
    title: "Fintech Geometric",
    description:
      "Futuristic Sora headings paired with tabular-friendly Manrope body text and JetBrains Mono readouts.",
    badge: "Modern",
    display: "sora",
    sans: "manrope",
    mono: "jetbrains-mono",
    headingTracking: "-0.025em",
  },
} satisfies Record<string, FontPreset>;

export type FontPresetName = keyof typeof FONT_PRESETS;

// SAFETY: FONT_PRESETS defines every FontPresetName member and no extra keys.
export const FONT_PRESET_NAMES = Object.keys(FONT_PRESETS) as FontPresetName[];

export const DEFAULT_SANS: SansFontName = "geist";

export const DEFAULT_MONO: MonoFontName = "geist-mono";

export const DEFAULT_FONT_PRESET: FontPresetName = "precision";

export function fontCatalog(kind: FontKind): FontCatalog {
  if (kind === "sans") return SANS_FONTS;

  if (kind === "display") return DISPLAY_FONTS;

  return MONO_FONTS;
}

export function resolveFont(kind: FontKind, name: string): FontSpec {
  const catalog = fontCatalog(kind);
  const found = catalog[name];

  if (!found) {
    throw new ValidationError(
      `Unknown ${kind} font "${name}".`,
      `Valid options: ${Object.keys(catalog).join(", ")}.`,
    );
  }

  return found;
}

export function resolveFontPreset(name: string): FontPreset {
  if (!Object.hasOwn(FONT_PRESETS, name)) {
    throw new ValidationError(
      `Unknown font preset "${name}".`,
      `Valid options: ${FONT_PRESET_NAMES.join(", ")}.`,
    );
  }

  // SAFETY: Object.hasOwn guarantees `name` is a key of FONT_PRESETS.
  return FONT_PRESETS[name as FontPresetName];
}
