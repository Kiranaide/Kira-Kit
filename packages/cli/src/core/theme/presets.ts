import type { BaseColorName } from "./palette";

export interface ThemePreset {
  name: string;
  title: string;
  description: string;
  primary: string;
  baseColor: BaseColorName;
  chartHues: [number, number, number, number];
}

/**
 * Curated theme presets, designed in three families (warm/editorial,
 * cool/technical, bold/expressive). Each is run through the same generator as
 * `kira-kit theme`, so CLI-generated and preset themes are identical for the
 * same input. Every preset is verified against WCAG 2.2 AA at build time.
 */
export const PRESETS: ThemePreset[] = [
  {
    name: "ember-press",
    title: "Ember Press",
    description:
      "A burnished terracotta theme for editorial platforms, independent publications, and content-rich products with a confident point of view.",
    primary: "#A54932",
    baseColor: "stone",
    chartHues: [30, 70, 165, 220],
  },
  {
    name: "oxblood-atelier",
    title: "Oxblood Atelier",
    description:
      "A deep wine-red theme for luxury services, cultural institutions, and membership products that need drama in measured doses.",
    primary: "#7E3548",
    baseColor: "neutral",
    chartHues: [32, 78, 155, 215],
  },
  {
    name: "olive-ledger",
    title: "Olive Ledger",
    description:
      "A cultivated olive theme for research tools, financial workspaces, and sustainability products that value credibility over corporate polish.",
    primary: "#5F6738",
    baseColor: "stone",
    chartHues: [-55, -15, 115, 180],
  },
  {
    name: "laurel-study",
    title: "Laurel Study",
    description:
      "A shaded laurel-green theme for wellness, hospitality, and knowledge products that should feel composed, discreet, and quietly restorative.",
    primary: "#315C4E",
    baseColor: "neutral",
    chartHues: [-155, -120, 35, 100],
  },
  {
    name: "phase-line",
    title: "Phase Line",
    description:
      "A locked-in teal accent for operations consoles where live signals must remain readable through dense, quiet interfaces.",
    primary: "#0B7F79",
    baseColor: "slate",
    chartHues: [34, 88, 154, 214],
  },
  {
    name: "cryostat",
    title: "Cryostat",
    description:
      "A chilled petrol-cyan theme for data platforms that need the visual discipline of laboratory equipment.",
    primary: "#007C91",
    baseColor: "zinc",
    chartHues: [42, 106, 178, 238],
  },
  {
    name: "low-orbit",
    title: "Low Orbit",
    description:
      "A steel-indigo instrument palette for geospatial, aviation, and infrastructure tools built around exact coordinates and layered evidence.",
    primary: "#3B5F82",
    baseColor: "slate",
    chartHues: [52, 116, 178, 238],
  },
  {
    name: "coral-circuit",
    title: "Coral Circuit",
    description:
      "A hot coral accent on warm stone that makes collaborative canvases and campaign workspaces feel quick, tactile, and optimistic.",
    primary: "#F2555A",
    baseColor: "stone",
    chartHues: [38, 128, 198, 272],
  },
  {
    name: "magenta-riot",
    title: "Magenta Riot",
    description:
      "A deep magenta against cool zinc that brings editorial confidence to community platforms, music products, and launch dashboards.",
    primary: "#B91668",
    baseColor: "zinc",
    chartHues: [42, 137, 197, 247],
  },
];
