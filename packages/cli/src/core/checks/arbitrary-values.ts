import type { Check, Finding } from "./types";

/**
 * Check 9: one-off arbitrary z-/shadow-/rounded- values outside token scales.
 * `inherit` and values derived from design tokens (`var(--…)`) stay inside
 * the token system and are not findings.
 */
const ARBITRARY = /\b(z|shadow|rounded)-\[([^\]]*)\]/g;

export const arbitraryValues: Check = (file) => {
  const findings: Finding[] = [];

  for (const match of file.content.matchAll(ARBITRARY)) {
    const value = match[2];

    if (value === "inherit" || value.includes("var(--")) continue;
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
