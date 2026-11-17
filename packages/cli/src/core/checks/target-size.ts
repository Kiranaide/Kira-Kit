import type { Check } from "./types";

/**
 * Check 6: interactive targets below 24px (WCAG 2.5.8) — crude width/size
 * utility heuristic that flags manual review.
 */
export const targetSize: Check = (file) => {
  if (/\b(?:h|size)-[1-5]\b/.test(file.content)) {
    return [
      {
        checkId: "target-size",
        severity: "warning",
        file: file.name,
        message:
          "contains h-*/size-* below 24px — check interactive target size (WCAG 2.5.8).",
      },
    ];
  }
  return [];
};
