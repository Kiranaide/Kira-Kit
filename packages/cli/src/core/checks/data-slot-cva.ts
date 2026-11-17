import type { Check, Finding } from "./types";

/**
 * Check 4: `data-slot` on the root of every component, and cva users export
 * their `*Variants`.
 */
export const dataSlotAndCva: Check = (file) => {
  const findings: Finding[] = [];
  const content = file.content;

  // Hooks render no DOM, so they can't carry data-slot attributes.
  if (!file.name.startsWith("hooks/")) {
    if (!content.includes("data-slot=")) {
      findings.push({
        checkId: "data-slot-cva",
        severity: "warning",
        file: file.name,
        message: "no `data-slot=` found in component file.",
      });
    }
  }

  const usesCva =
    content.includes("class-variance-authority") || /\bcva\s*\(/.test(content);
  const exportsVariants =
    /export\s+(?:const|function|var)\s+\w*Variants/.test(content) ||
    /export\s*\{[^}]*Variants/.test(content);

  if (usesCva && !exportsVariants) {
    findings.push({
      checkId: "data-slot-cva",
      severity: "warning",
      file: file.name,
      message: "uses cva but exports no `*Variants`.",
    });
  }

  return findings;
};
