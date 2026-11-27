import { PRESETS } from "./presets";
import { BASE_COLORS } from "./palette";
import {
  FONT_PRESETS,
  MONO_FONTS,
  SANS_FONTS,
  SERIF_FONTS,
  type FontSpec,
} from "./fonts";
import { RADIUS_PRESETS, SURFACE_PRESETS } from "./geometry";
import { generateBaseColorVars, generateTheme } from "./theme";
import type { SourceRegistryItem } from "../../lib/schemas";

/** A single lightness adjustment recorded while generating one preset. */
export interface PresetAdjustment {
  preset: string;
  token: string;
  fromL: number;
  toL: number;
}

/** Owner contract for the preset-generation batch: items plus recorded tweaks. */
export interface PresetGenerationResult {
  items: SourceRegistryItem[];
  adjustments: PresetAdjustment[];
}

/**
 * Generate every curated preset with the same engine the `theme` command
 * uses, producing registry:theme items for src/themes/registry.json.
 */
export function generatePresetItems(): PresetGenerationResult {
  const items: SourceRegistryItem[] = [];
  const adjustments: PresetAdjustment[] = [];

  for (const preset of PRESETS) {
    const generated = generateTheme(preset);

    for (const adjustment of generated.adjustments) {
      adjustments.push({
        preset: preset.name,
        token: `${adjustment.scheme}.${adjustment.token}`,
        fromL: adjustment.fromL,
        toL: adjustment.toL,
      });
    }

    items.push(generated.item);
  }

  return { items, adjustments };
}

function toDocFont(spec: FontSpec) {
  return {
    name: spec.name,
    family: spec.family,
    stack: spec.stack,
    category: spec.category,
  };
}

/**
 * Emit the full theme studio catalog (base colors, radii, surfaces, fonts,
 * font pairings, and per-preset recipes) directly from the CLI source of truth.
 */
export function generateThemeCatalog() {
  const baseColors = Object.values(BASE_COLORS).map((spec) => ({
    name: spec.name,
    title: spec.title,
    family: spec.family,
    description: spec.description,
    ...generateBaseColorVars(spec.name),
  }));

  const recipes = {
    "theme-default": {
      baseColor: "neutral",
      fontPreset: "precision",
      surface: "tactile",
    },
    ...Object.fromEntries(
      PRESETS.map((preset) => [
        `theme-${preset.name}`,
        {
          baseColor: preset.baseColor,
          fontPreset: preset.fontPreset,
          radius: preset.radius,
          surface: preset.surface,
        },
      ]),
    ),
  };

  return {
    baseColors,
    radiusPresets: Object.values(RADIUS_PRESETS),
    surfacePresets: Object.values(SURFACE_PRESETS),
    fonts: {
      sans: Object.values(SANS_FONTS).map(toDocFont),
      serif: Object.values(SERIF_FONTS).map(toDocFont),
      mono: Object.values(MONO_FONTS).map(toDocFont),
    },
    fontPresets: Object.values(FONT_PRESETS),
    recipes,
  };
}
