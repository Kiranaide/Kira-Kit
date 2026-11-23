import { getImports, type Check, type Finding } from "./types";

const FORBIDDEN = /^(clsx|tailwind-merge)(\/|$)/;
const LOCAL_CN = /^@\/lib\/(cn|utils)(\.(tsx|ts))?$/;

/** Check 12: `cn` source — components must use the `cn` package. */
export const cnSource: Check = (file) => {
  const { external, lib } = getImports(file);
  const findings: Finding[] = [];

  for (const entry of external) {
    if (FORBIDDEN.test(entry.specifier)) {
      findings.push({
        checkId: "cn-source",
        severity: "error",
        file: file.name,
        line: entry.line,
        message: `imports "${entry.specifier}" — use the \`cn\` package instead.`,
      });
    }
  }

  for (const entry of lib) {
    if (LOCAL_CN.test(entry.specifier)) {
      findings.push({
        checkId: "cn-source",
        severity: "error",
        file: file.name,
        line: entry.line,
        message: `imports cn from "${entry.specifier}" — use the \`cn\` package instead.`,
      });
    }
  }

  return findings;
};
