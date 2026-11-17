import type { Check, Finding } from "./types";

/**
 * Check 8: `transition-all` or width/height/top/left transitions —
 * animate transform/opacity instead.
 */
const LAYOUT_TRANSITION =
  /\btransition-all\b|transition-\[(width|height|top|left)[^\]]*\]/g;

export const layoutTransitions: Check = (file) => {
  const findings: Finding[] = [];

  for (const match of file.content.matchAll(LAYOUT_TRANSITION)) {
    const line = file.content.slice(0, match.index).split("\n").length;
    findings.push({
      checkId: "layout-transitions",
      severity: "warning",
      file: file.name,
      line,
      message: `${match[0]} — use transform/opacity.`,
    });
  }

  return findings;
};
