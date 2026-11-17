import type { Check } from "./types";

/**
 * Check 8: `transition-all` or width/height/top/left transitions —
 * animate transform/opacity instead.
 */
export const layoutTransitions: Check = (file) => {
  if (
    /\btransition-all\b/.test(file.content) ||
    /transition-\[(width|height|top|left)/.test(file.content)
  ) {
    return [
      {
        checkId: "layout-transitions",
        severity: "warning",
        file: file.name,
        message:
          "transition-all or width/height/top/left transition — use transform/opacity.",
      },
    ];
  }
  return [];
};
