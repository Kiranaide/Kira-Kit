import { ValidationError } from "../../lib/errors";

export type RadiusPresetName = "sharp" | "crisp" | "balanced" | "soft" | "pill";

export interface RadiusPreset {
  name: RadiusPresetName;
  title: string;
  value: string;
  description: string;
}

/** Resolved corner radius choice: preset name (or raw length) + CSS value. */
export interface ResolvedRadius {
  name: string;
  value: string;
}

export const RADIUS_PRESETS: Record<RadiusPresetName, RadiusPreset> = {
  sharp: {
    name: "sharp",
    title: "Sharp",
    value: "0rem",
    description:
      "Architectural 0px corners for dense consoles and editorial grids.",
  },
  crisp: {
    name: "crisp",
    title: "Crisp",
    value: "0.375rem",
    description:
      "Tight 6px corners tuned for developer tools and precision workspaces.",
  },
  balanced: {
    name: "balanced",
    title: "Balanced",
    value: "0.625rem",
    description:
      "Versatile 10px corners balancing clarity and approachability.",
  },
  soft: {
    name: "soft",
    title: "Soft",
    value: "0.875rem",
    description: "Generous 14px corners for calm consumer and studio products.",
  },
  pill: {
    name: "pill",
    title: "Pill",
    value: "1.25rem",
    description: "Expressive 20px geometry for tactile, friendly interfaces.",
  },
};

// SAFETY: RADIUS_PRESETS has one key per RadiusPresetName member and no extras.
export const RADIUS_PRESET_NAMES = Object.keys(
  RADIUS_PRESETS,
) as RadiusPresetName[];

export const DEFAULT_RADIUS: RadiusPresetName = "balanced";

const CSS_LENGTH_PATTERN = /^(?:0|\d+(?:\.\d+)?(?:rem|px|em))$/;

/**
 * Resolve a radius preset name (sharp..pill) or explicit CSS length (e.g. 0.5rem, 8px).
 */
export function resolveRadius(input: string): ResolvedRadius {
  const trimmed = input.trim();

  if (Object.hasOwn(RADIUS_PRESETS, trimmed)) {
    // SAFETY: Object.hasOwn guarantees `trimmed` is a RadiusPresetName key.
    const preset = RADIUS_PRESETS[trimmed as RadiusPresetName];

    return { name: preset.name, value: preset.value };
  }

  if (CSS_LENGTH_PATTERN.test(trimmed)) {
    return { name: trimmed, value: trimmed };
  }

  throw new ValidationError(
    `Unknown radius "${input}".`,
    `Use a preset (${RADIUS_PRESET_NAMES.join(", ")}) or a CSS length like 0.5rem or 8px.`,
  );
}

export type SurfacePresetName = "hairline" | "tactile" | "elevated";

export interface SurfacePreset {
  name: SurfacePresetName;
  title: string;
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

/**
 * Surface & elevation style presets implementing October 2026 tactile minimalism
 * alongside hairline flat and soft ambient elevation token sets.
 */
export const SURFACE_PRESETS: Record<SurfacePresetName, SurfacePreset> = {
  hairline: {
    name: "hairline",
    title: "Hairline",
    description:
      "Flat 1px border discipline with minimal shadow for dense data clarity.",
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
  tactile: {
    name: "tactile",
    title: "Tactile",
    description:
      "Subtle top specular edge and crisp micro-depth inspired by precision hardware.",
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
  elevated: {
    name: "elevated",
    title: "Elevated",
    description:
      "Soft layered ambient elevation for airy cards, popovers, and dialogs.",
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
};

// SAFETY: SURFACE_PRESETS has one key per SurfacePresetName member and no extras.
export const SURFACE_PRESET_NAMES = Object.keys(
  SURFACE_PRESETS,
) as SurfacePresetName[];

export const DEFAULT_SURFACE: SurfacePresetName = "tactile";

export function resolveSurface(input: string): SurfacePreset {
  const trimmed = input.trim();

  if (Object.hasOwn(SURFACE_PRESETS, trimmed)) {
    // SAFETY: Object.hasOwn guarantees `trimmed` is a SurfacePresetName key.
    return SURFACE_PRESETS[trimmed as SurfacePresetName];
  }

  throw new ValidationError(
    `Unknown surface preset "${input}".`,
    `Valid options: ${SURFACE_PRESET_NAMES.join(", ")}.`,
  );
}
