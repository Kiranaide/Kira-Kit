import type { Check, Finding } from "./types";

/**
 * Half-step spacing (1.5 / 2.5 / …) on heights, widths, gaps, and horizontal
 * padding breaks the 4px design-system scale. Vertical text padding (`py-*`)
 * is the documented optical exception and is not flagged.
 */
const HALF_STEP =
  /\b(h|w|size|min-h|min-w|gap-x|gap-y|gap|px|pl|pr|ps|pe)-(\d+\.5)(?![\d.])/g;

export const spacingScale: Check = (file) => {
  const findings: Finding[] = [];

  for (const match of file.content.matchAll(HALF_STEP)) {
    const line = file.content.slice(0, match.index).split("\n").length;
    findings.push({
      checkId: "spacing-scale",
      severity: "warning",
      file: file.name,
      line,
      message: `${match[1]}-${match[2]} is a half-step; use the 4px scale (1, 2, 3, 4, 5, 6, 8, 10, 12, 16) or document the optical exception.`,
    });
  }

  return findings;
};
