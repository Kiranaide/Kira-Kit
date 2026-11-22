import type { BaseColorName } from "./palette";
import type { FontPresetName } from "./fonts";
import type { RadiusPresetName, SurfacePresetName } from "./geometry";

export interface ThemePreset {
  name: string;
  title: string;
  description: string;
  primary: string;
  baseColor: BaseColorName;
  chartHues: [number, number, number, number];
  /** Recommended October 2026 pairing defaults for full-stack starter recipes. */
  radius: RadiusPresetName;
  surface: SurfacePresetName;
  fontPreset: FontPresetName;
}

/**
 * Curated theme presets, designed across three families (warm/editorial,
 * cool/technical, bold/expressive). Each is run through the same generator as
 * `kira-kit theme`, so CLI-generated and preset themes are identical for the
 * same input. Every preset is verified against WCAG 2.2 AA at build time.
 */
export const PRESETS: ThemePreset[] = [
  {
    name: "ember-press",
    title: "Ember Press",
    description:
      "A burnished terracotta theme on warm paper for editorial platforms, independent publications, and content-rich products.",
    primary: "#A54932",
    baseColor: "paper",
    chartHues: [30, 70, 165, 220],
    radius: "crisp",
    surface: "tactile",
    fontPreset: "editorial",
  },
  {
    name: "oxblood-atelier",
    title: "Oxblood Atelier",
    description:
      "A deep wine-red theme on warm stone for luxury services, cultural institutions, and membership products that need measured drama.",
    primary: "#7E3548",
    baseColor: "stone",
    chartHues: [32, 78, 155, 215],
    radius: "balanced",
    surface: "elevated",
    fontPreset: "atelier",
  },
  {
    name: "olive-ledger",
    title: "Olive Ledger",
    description:
      "A cultivated olive theme for research tools, financial workspaces, and sustainability products that value credibility over polish.",
    primary: "#5F6738",
    baseColor: "olive",
    chartHues: [-55, -15, 115, 180],
    radius: "crisp",
    surface: "hairline",
    fontPreset: "editorial",
  },
  {
    name: "laurel-study",
    title: "Laurel Study",
    description:
      "A shaded laurel-green theme on calm mist for wellness, hospitality, and knowledge products that feel quietly restorative.",
    primary: "#315C4E",
    baseColor: "mist",
    chartHues: [-155, -120, 35, 100],
    radius: "soft",
    surface: "elevated",
    fontPreset: "atelier",
  },
  {
    name: "phase-line",
    title: "Phase Line",
    description:
      "A locked-in teal accent on slate for operations consoles where live signals must remain readable through dense interfaces.",
    primary: "#0B7F79",
    baseColor: "slate",
    chartHues: [34, 88, 154, 214],
    radius: "sharp",
    surface: "hairline",
    fontPreset: "terminal",
  },
  {
    name: "cryostat",
    title: "Cryostat",
    description:
      "A chilled petrol-cyan theme on mist for data platforms that need the visual discipline of laboratory equipment.",
    primary: "#007C91",
    baseColor: "mist",
    chartHues: [42, 106, 178, 238],
    radius: "crisp",
    surface: "tactile",
    fontPreset: "terminal",
  },
  {
    name: "low-orbit",
    title: "Low Orbit",
    description:
      "A steel-indigo instrument palette on slate for geospatial, aviation, and infrastructure tools built around exact coordinates.",
    primary: "#3B5F82",
    baseColor: "slate",
    chartHues: [52, 116, 178, 238],
    radius: "crisp",
    surface: "tactile",
    fontPreset: "precision",
  },
  {
    name: "cobalt-studio",
    title: "Cobalt Studio",
    description:
      "A high-velocity electric cobalt anchor on dark-first anthracite for AI workspaces, fintech dashboards, and modern SaaS.",
    primary: "#2552D9",
    baseColor: "anthracite",
    chartHues: [44, 138, 208, 286],
    radius: "balanced",
    surface: "tactile",
    fontPreset: "fintech",
  },
  {
    name: "coral-circuit",
    title: "Coral Circuit",
    description:
      "A hot coral accent on warm paper that makes collaborative canvases and campaign workspaces feel quick, tactile, and optimistic.",
    primary: "#E04A4F",
    baseColor: "paper",
    chartHues: [38, 128, 198, 272],
    radius: "soft",
    surface: "tactile",
    fontPreset: "expressive",
  },
  {
    name: "magenta-riot",
    title: "Magenta Riot",
    description:
      "A deep magenta against studio mauve that brings editorial confidence to community platforms, music products, and launch dashboards.",
    primary: "#B91668",
    baseColor: "mauve",
    chartHues: [42, 137, 197, 247],
    radius: "balanced",
    surface: "elevated",
    fontPreset: "expressive",
  },
];
