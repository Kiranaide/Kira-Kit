import { extractImports } from "../registry/extract";
import type { Check, Finding } from "./types";

const FORBIDDEN = /^(radix-ui|@radix-ui\/|react-aria)/;

/** Check 11: Base UI only — flag Radix and React Aria imports. */
export const baseUiOnly: Check = (file) => {
  const { external } = extractImports(file.content, file.path);
  const findings: Finding[] = [];
  for (const entry of external) {
    if (FORBIDDEN.test(entry.specifier)) {
      findings.push({
        checkId: "base-ui-only",
        severity: "error",
        file: file.name,
        line: entry.line,
        message: `imports "${entry.specifier}" — Kira Kit is Base UI only (@base-ui/react).`,
      });
    }
  }
  return findings;
};
