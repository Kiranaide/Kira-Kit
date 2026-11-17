import { extractImports } from "../registry/extract";
import type { Check, Finding } from "./types";

const FORBIDDEN = /^(clsx|tailwind-merge)(\/|$)/;
const LOCAL_CN = /from\s+["']@\/lib\/(cn|utils)["']/;

/** Check 12: `cn` source — components must use the `cn` package. */
export const cnSource: Check = (file) => {
  const { external } = extractImports(file.content, file.path);
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

  const localMatch = LOCAL_CN.exec(file.content);

  if (localMatch) {
    const line = file.content.slice(0, localMatch.index).split("\n").length;

    findings.push({
      checkId: "cn-source",
      severity: "error",
      file: file.name,
      line,
      message: `imports cn from "${localMatch[1] === "cn" ? "@/lib/cn" : "@/lib/utils"}" — use the \`cn\` package instead.`,
    });
  }

  return findings;
};
