import { oklchCss, parseToOklch, type OklchColor } from "./color";
import {
  BASE_COLORS,
  BASE_COLOR_NAMES,
  buildBaseSchemes,
  buildSchemes,
  type BaseColorName,
} from "./palette";
import {
  DEFAULT_RADIUS,
  DEFAULT_SURFACE,
  resolveRadius,
  resolveSurface,
  type SurfacePresetName,
} from "./geometry";
import {
  autoAdjust,
  buildApcaReport,
  type Adjustment,
  type ApcaReportEntry,
  type PairFailure,
} from "./contrast";
import type { RegistryItem } from "../../types";
import type { RegistryItemPayload } from "../../lib/schemas";

export interface ThemeDefinition {
  name: string;
  title: string;
  description: string;
  primary: string;
  baseColor: BaseColorName;
  lightPrimaryForegroundLightness?: number;
  chartHues?: number[];
  radius?: string;
  surface?: SurfacePresetName;
}

export interface GeneratedTheme {
  item: RegistryItem & { type: "registry:theme" };
  adjustments: Adjustment[];
  failures: PairFailure[];
  apca: ApcaReportEntry[];
}

/** Flattened CSS custom properties for one scheme: "--token" → oklch() string. */
export interface CssVarsMap {
  [cssVar: string]: string;
}

/** Standalone light + dark base-color surface token maps. */
export interface BaseColorVars {
  light: CssVarsMap;
  dark: CssVarsMap;
}

export class ThemeContrastError extends Error {
  readonly failures: PairFailure[];

  constructor(failures: PairFailure[]) {
    const details = failures
      .map(
        (f) =>
          `  ${f.scheme} ${f.fg} on ${f.bg}: ${f.ratio.toFixed(2)}:1 (needs ${f.threshold}:1) — try primary lightness around ${suggestLightness(f)}`,
      )
      .join("\n");

    super(
      `Theme failed WCAG AA contrast for ${failures.length} pair(s):\n${details}`,
    );
    this.name = "ThemeContrastError";
    this.failures = failures;
  }
}

export function isBaseColorName(value: string): value is BaseColorName {
  return Object.hasOwn(BASE_COLORS, value);
}

export function normalizeBaseColor(value?: string): BaseColorName {
  if (value && isBaseColorName(value)) {
    return value;
  }

  return "neutral";
}

/**
 * Generate standalone neutral/surface CSS variables for a base color preset
 * (verified against WCAG 2.2 AA), without overwriting primary or chart tokens.
 */
export function generateBaseColorVars(baseColor: BaseColorName): BaseColorVars {
  const schemes = buildBaseSchemes(baseColor);

  for (const schemeName of ["light", "dark"] as const) {
    const result = autoAdjust(schemeName, schemes[schemeName]);

    if (result.remaining.length > 0) {
      throw new ThemeContrastError(result.remaining);
    }
  }

  return {
    light: toCssVars(schemes.light),
    dark: toCssVars(schemes.dark),
  };
}

/**
 * Generate a complete theme: numeric OKLCH palette, contrast verification with
 * bounded auto-adjustment, APCA reporting, and a registry:theme item.
 * Throws ThemeContrastError when a pair still fails after adjustment.
 */
export function generateTheme(definition: ThemeDefinition): GeneratedTheme {
  const baseColor = normalizeBaseColor(definition.baseColor);
  const primary = parseToOklch(definition.primary);
  const radius = resolveRadius(definition.radius ?? DEFAULT_RADIUS);
  const surface = resolveSurface(definition.surface ?? DEFAULT_SURFACE);

  const schemes = buildSchemes({
    primary,
    baseColor,
    chartHues: definition.chartHues,
    lightPrimaryForegroundLightness: definition.lightPrimaryForegroundLightness,
  });

  const adjustments: Adjustment[] = [];
  const failures: PairFailure[] = [];

  for (const schemeName of ["light", "dark"] as const) {
    const result = autoAdjust(schemeName, schemes[schemeName]);
    adjustments.push(...result.fixed);
    failures.push(...result.remaining);
  }

  const apca = [
    ...buildApcaReport("light", schemes.light),
    ...buildApcaReport("dark", schemes.dark),
  ];

  if (failures.length > 0) {
    throw new ThemeContrastError(failures);
  }

  const item: RegistryItem & { type: "registry:theme" } = {
    name: `theme-${definition.name}`,
    type: "registry:theme",
    title: definition.title,
    description: definition.description,
    cssVars: {
      theme: { "--radius": radius.value },
      light: { ...toCssVars(schemes.light), ...surface.light },
      dark: { ...toCssVars(schemes.dark), ...surface.dark },
    },
  };

  return { item, adjustments, failures, apca };
}

function toCssVars(tokens: Record<string, OklchColor>): CssVarsMap {
  const vars: CssVarsMap = {};

  for (const [token, color] of Object.entries(tokens)) {
    vars[`--${token}`] = oklchCss(color);
  }

  return vars;
}

function suggestLightness(failure: PairFailure): number {
  if (failure.scheme === "light") {
    return failure.kind === "text" ? 0.2 : 0.66;
  }

  return failure.kind === "text" ? 0.95 : 0.45;
}

export { BASE_COLORS, BASE_COLOR_NAMES };

/** Convert a generated theme item into an installable payload (no files). */
export function themePayload(item: RegistryItem): RegistryItemPayload {
  return {
    name: item.name,
    type: "registry:theme",
    title: item.title,
    description: item.description,
    cssVars: item.cssVars,
    files: [],
  };
}
