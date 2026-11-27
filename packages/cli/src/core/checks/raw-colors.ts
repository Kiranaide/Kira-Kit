import type { Check, Finding } from "./types";

/** Check 7: raw hex/rgb color literals — use semantic tokens instead. */
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/g;

export const rawColors: Check = (file) => {
  // Lib modules are color math and capture-overlay data, not UI styling.
  if (file.name.startsWith("lib/")) return [];

  const findings: Finding[] = [];

  for (const match of file.content.matchAll(RAW_COLOR)) {
    const line = file.content.slice(0, match.index).split("\n").length;
    findings.push({
      checkId: "raw-colors",
      severity: "warning",
      file: file.name,
      line,
      message: `raw colour literal (${match[0]}) — use semantic tokens.`,
    });
  }

  return findings;
};
