import { apcaLc, wcagRatio, type OklchColor } from "./color";
import type { TokenMap } from "./palette";

/** Text pairs: WCAG 2.2 AA requires >= 4.5:1. Blocking. */
const TEXT_PAIRS: Array<[fg: string, bg: string]> = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "background"],
  ["accent-foreground", "accent"],
  ["destructive-foreground", "destructive"],
  ["info-foreground", "info"],
  ["success-foreground", "success"],
  ["warning-foreground", "warning"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
];

/**
 * UI-boundary pairs: WCAG 2.2 requires >= 3:1. Blocking.
 * Only focus rings are checked here. Decorative borders (border, sidebar-border)
 * are exempt from WCAG 1.4.11 — they aren't functional UI boundaries — so forcing
 * them to 3:1 would crush the intentionally subtle hairlines the palette designs.
 */
const UI_PAIRS: Array<[fg: string, bg: string]> = [
  ["ring", "background"],
  ["sidebar-ring", "sidebar"],
];

export interface PairFailure {
  scheme: "light" | "dark";
  fg: string;
  bg: string;
  ratio: number;
  threshold: number;
  kind: "text" | "ui";
}

export interface Adjustment {
  scheme: "light" | "dark";
  token: string;
  fromL: number;
  toL: number;
}

export interface ApcaReportEntry {
  scheme: "light" | "dark";
  pair: string;
  lc: number;
}

export function verifyScheme(
  scheme: "light" | "dark",
  tokens: TokenMap,
): PairFailure[] {
  const failures: PairFailure[] = [];

  for (const [fg, bg] of TEXT_PAIRS) {
    if (!tokens[fg] || !tokens[bg]) continue;
    const ratio = wcagRatio(tokens[fg], tokens[bg]);

    if (ratio < 4.5) {
      failures.push({ scheme, fg, bg, ratio, threshold: 4.5, kind: "text" });
    }
  }

  for (const [fg, bg] of UI_PAIRS) {
    if (!tokens[fg] || !tokens[bg]) continue;
    const ratio = wcagRatio(tokens[fg], tokens[bg]);

    if (ratio < 3) {
      failures.push({ scheme, fg, bg, ratio, threshold: 3, kind: "ui" });
    }
  }

  return failures;
}

const SCAN_STEP = 0.02;

/**
 * Find the passing lightness for the foreground token closest to its current
 * value. Scans the full [0,1] range so a light fg on a vivid mid-lightness
 * background can flip to a dark tinted fg (and vice versa).
 */
function adjustToken(
  tokens: TokenMap,
  fg: string,
  bg: string,
  threshold: number,
): { toL: number } | null {
  const fgColor = tokens[fg];
  const bgColor = tokens[bg];

  if (!fgColor || !bgColor) return null;

  const startL = fgColor.l;
  let best: { toL: number; distance: number } | null = null;

  for (let candidateL = SCAN_STEP; candidateL <= 1; candidateL += SCAN_STEP) {
    const rounded = Math.round(candidateL * 100) / 100;
    tokens[fg] = { ...fgColor, l: rounded };

    if (wcagRatio(tokens[fg], tokens[bg]) >= threshold) {
      const distance = Math.abs(rounded - startL);

      if (!best || distance < best.distance) {
        best = { toL: rounded, distance };
      }
    }
  }

  tokens[fg] = fgColor;

  if (!best) return null;
  tokens[fg] = { ...fgColor, l: best.toL };

  return { toL: best.toL };
}

/** Result of bounded auto-adjustment: applied fixes plus unresolvable failures. */
export interface AutoAdjustResult {
  fixed: Adjustment[];
  remaining: PairFailure[];
}

/**
 * Auto-adjust failing pairs (bounded), recording every change.
 * Mutates the token map. Returns failures that could not be fixed.
 */
export function autoAdjust(
  scheme: "light" | "dark",
  tokens: TokenMap,
): AutoAdjustResult {
  const adjustments: Adjustment[] = [];

  for (let pass = 0; pass < 3; pass++) {
    const failures = verifyScheme(scheme, tokens);

    if (failures.length === 0) break;

    for (const failure of failures) {
      const fgColor = tokens[failure.fg];

      const fixed = adjustToken(
        tokens,
        failure.fg,
        failure.bg,
        failure.threshold,
      );

      if (fixed) {
        adjustments.push({
          scheme,
          token: failure.fg,
          fromL: fgColor.l,
          toL: fixed.toL,
        });
      }
    }
  }

  return { fixed: adjustments, remaining: verifyScheme(scheme, tokens) };
}

export function buildApcaReport(
  scheme: "light" | "dark",
  tokens: TokenMap,
): ApcaReportEntry[] {
  const entries: ApcaReportEntry[] = [];

  for (const [fg, bg] of TEXT_PAIRS) {
    if (!tokens[fg] || !tokens[bg]) continue;
    entries.push({
      scheme,
      pair: `${fg}/${bg}`,
      lc: apcaLc(tokens[fg], tokens[bg]),
    });
  }

  return entries;
}

export type { OklchColor };
