import { oklchCss, parseToOklch, type OklchColor } from "./color";
import {
  BASE_COLORS,
  BASE_COLOR_NAMES,
  buildSchemes,
  type BaseColorName,
} from "./palette";
import {
  autoAdjust,
  buildApcaReport,
  type Adjustment,
  type ApcaReportEntry,
  type PairFailure,
} from "./contrast";
import type { RegistryItem } from "../../types";

export interface ThemeDefinition {
  name: string;
  title: string;
  description: string;
  primary: string;
  baseColor: BaseColorName;
  chartHues?: number[];
}

export interface GeneratedTheme {
  item: RegistryItem & { type: "registry:theme" };
  adjustments: Adjustment[];
  failures: PairFailure[];
  apca: ApcaReportEntry[];
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

/**
 * Generate a complete theme: numeric OKLCH palette, contrast verification with
 * bounded auto-adjustment, APCA reporting, and a shadcn registry:theme item.
 * Throws ThemeContrastError when a pair still fails after adjustment.
 */
export function generateTheme(definition: ThemeDefinition): GeneratedTheme {
  const baseColor: BaseColorName = BASE_COLOR_NAMES.includes(
    definition.baseColor,
  )
    ? definition.baseColor
    : "neutral";

  const primary = parseToOklch(definition.primary);

  const schemes = buildSchemes({
    primary,
    baseColor,
    chartHues: definition.chartHues,
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
      theme: { "--radius": "0.625rem" },
      light: toCssVars(schemes.light),
      dark: toCssVars(schemes.dark),
    },
  };

  return { item, adjustments, failures, apca };
}

/** Flattened CSS custom properties for one scheme: "--token" → oklch() string. */
interface CssVarsMap {
  [cssVar: string]: string;
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
