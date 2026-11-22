import { PRESETS } from "./presets";
import { generateTheme } from "./theme";
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
    const generated = generateTheme({
      name: preset.name,
      title: preset.title,
      description: preset.description,
      primary: preset.primary,
      baseColor: preset.baseColor,
      chartHues: preset.chartHues,
      radius: preset.radius,
      surface: preset.surface,
    });

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
