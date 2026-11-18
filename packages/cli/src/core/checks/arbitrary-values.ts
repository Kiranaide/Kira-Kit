import type { Check, Finding } from "./types";

/**
 * Check 9: one-off arbitrary values outside token scales. Covers z/shadow/
 * rounded plus spacing, sizing, and font utilities. Values that stay relative
 * to a token or the environment are not findings: `inherit`, `var(--…)`,
 * `clamp(…)`, `env(…)`, percentages, and viewport/character/em units.
 */
const ARBITRARY =
  /\b(z|shadow|rounded|min-h|min-w|max-h|max-w|gap-x|gap-y|space-x|space-y|size|text|inset|top|right|bottom|left|gap|px|py|pt|pr|pb|pl|ps|pe|mx|my|mt|mr|mb|ml|ms|me|h|w|p|m)-\[([^\]]*)\]/g;

const RELATIVE_UNIT = /\d(?:vh|vw|dvh|dvw|svh|svw|lvh|lvw|vmin|vmax|ch|em)\b/;

export const arbitraryValues: Check = (file) => {
  const findings: Finding[] = [];

  for (const match of file.content.matchAll(ARBITRARY)) {
    const value = match[2];

    if (
      value === "inherit" ||
      value.includes("var(--") ||
      value.includes("clamp(") ||
      value.includes("env(") ||
      value.includes("%") ||
      RELATIVE_UNIT.test(value)
    ) {
      continue;
    }

    const line = file.content.slice(0, match.index).split("\n").length;
    findings.push({
      checkId: "arbitrary-values",
      severity: "warning",
      file: file.name,
      line,
      message: `arbitrary ${match[1]}-[${value}] outside the token scales.`,
    });
  }

  return findings;
};
