import type { Check, Finding } from "./types";

const BOILERPLATE_PATTERNS = [
  /^component from kira kit/i,
  /^todo:/i,
  /^\s*$/,
  /^(a |an |the )?[\w-]+ component\.?$/i,
];

/**
 * Check 10: registry item metadata — description present, not boilerplate,
 * at least one category.
 */
export const registryMetadata: Check = (file, ctx) => {
  const meta = ctx.items.get(file.name);
  if (!meta) return [];
  const findings: Finding[] = [];
  const description = meta.description.trim();

  if (description.length === 0) {
    findings.push({
      checkId: "registry-metadata",
      severity: "error",
      file: file.name,
      message: "registry item has an empty description.",
    });
  } else if (description.length < 20 || BOILERPLATE_PATTERNS.some((p) => p.test(description))) {
    findings.push({
      checkId: "registry-metadata",
      severity: "error",
      file: file.name,
      message: `boilerplate description "${description.slice(0, 60)}" — describe what makes this item distinct.`,
    });
  }

  if (meta.categories.length === 0) {
    findings.push({
      checkId: "registry-metadata",
      severity: "error",
      file: file.name,
      message: "registry item declares no category.",
    });
  }

  return findings;
};
