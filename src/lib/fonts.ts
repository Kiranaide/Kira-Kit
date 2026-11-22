// Keep in sync with packages/cli/src/core/theme/fonts.ts (the CLI catalog).
export interface DocsFont {
  name: string;
  family: string;
  stack: string;
  category: "sans" | "serif" | "mono";
}

function sans(name: string, family: string): DocsFont {
  return {
    name,
    family,
    stack: `"${family}", ui-sans-serif, system-ui, sans-serif`,
    category: "sans",
  };
}

function serif(name: string, family: string): DocsFont {
  return {
    name,
    family,
    stack: `"${family}", ui-serif, Georgia, serif`,
    category: "serif",
  };
}

function mono(name: string, family: string): DocsFont {
  return {
    name,
    family,
    stack: `"${family}", ui-monospace, monospace`,
    category: "mono",
  };
}

export const DOC_SANS_FONTS: DocsFont[] = [
  sans("geist", "Geist Variable"),
  sans("instrument-sans", "Instrument Sans Variable"),
  sans("inter", "Inter Variable"),
  sans("manrope", "Manrope Variable"),
  sans("plus-jakarta-sans", "Plus Jakarta Sans Variable"),
  sans("space-grotesk", "Space Grotesk Variable"),
  sans("dm-sans", "DM Sans Variable"),
  sans("bricolage-grotesque", "Bricolage Grotesque Variable"),
  sans("sora", "Sora Variable"),
  sans("outfit", "Outfit Variable"),
];

export const DOC_SERIF_FONTS: DocsFont[] = [
  serif("newsreader", "Newsreader Variable"),
  serif("fraunces", "Fraunces Variable"),
];

export const DOC_DISPLAY_FONTS: DocsFont[] = [
  ...DOC_SANS_FONTS,
  ...DOC_SERIF_FONTS,
];

export const DOC_MONO_FONTS: DocsFont[] = [
  mono("geist-mono", "Geist Mono Variable"),
  mono("jetbrains-mono", "JetBrains Mono Variable"),
  mono("fira-code", "Fira Code Variable"),
];

export type DocFontPresetName =
  "precision" | "editorial" | "atelier" | "terminal" | "expressive" | "fintech";

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

export const DOC_FONT_PRESETS: DocFontPreset[] = [
  {
    name: "precision",
    title: "Precision Studio",
    badge: "Default",
    description:
      "Crisp engineered neo-grotesque paired with matching monospace for dashboards and developer platforms.",
    display: "geist",
    sans: "geist",
    mono: "geist-mono",
    headingTracking: "-0.025em",
  },
  {
    name: "editorial",
    title: "Editorial Press",
    badge: "Serif + Sans",
    description:
      "Optical-size Newsreader headlines paired with clean Instrument Sans body copy and JetBrains Mono metadata.",
    display: "newsreader",
    sans: "instrument-sans",
    mono: "jetbrains-mono",
    headingTracking: "-0.02em",
  },
  {
    name: "atelier",
    title: "Atelier Craft",
    badge: "Soft Serif",
    description:
      "Expressive Fraunces display headlines paired with warm Plus Jakarta Sans UI copy and Geist Mono.",
    display: "fraunces",
    sans: "plus-jakarta-sans",
    mono: "geist-mono",
    headingTracking: "-0.02em",
  },
  {
    name: "terminal",
    title: "Blueprint Terminal",
    badge: "Dev / AI",
    description:
      "Neutral technical Instrument Sans paired with crisp JetBrains Mono for AI consoles and telemetry.",
    display: "instrument-sans",
    sans: "instrument-sans",
    mono: "jetbrains-mono",
    headingTracking: "-0.02em",
  },
  {
    name: "expressive",
    title: "Expressive Lab",
    badge: "Grotesk",
    description:
      "Multi-axis Bricolage Grotesque headings balanced by calm DM Sans body copy and Fira Code.",
    display: "bricolage-grotesque",
    sans: "dm-sans",
    mono: "fira-code",
    headingTracking: "-0.03em",
  },
  {
    name: "fintech",
    title: "Fintech Geometric",
    badge: "Modern",
    description:
      "Geometric Sora headings paired with tabular-friendly Manrope body copy and JetBrains Mono readouts.",
    display: "sora",
    sans: "manrope",
    mono: "jetbrains-mono",
    headingTracking: "-0.025em",
  },
];

export const DEFAULT_DOC_SANS = "geist";
export const DEFAULT_DOC_DISPLAY = "geist";
export const DEFAULT_DOC_MONO = "geist-mono";
export const DEFAULT_DOC_FONT_PRESET: DocFontPresetName = "precision";

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
