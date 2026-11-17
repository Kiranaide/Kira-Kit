import type { Finding, Severity } from "./types";

export interface Suppression {
  checkId: string;
  /** 1-based line the suppression comment sits on (applies to line+1). */
  line: number;
  reason: string;
}

export interface FileSuppressions {
  line: Suppression[];
  file: Suppression[];
}

const LINE_SUPPRESSION = /\/\/\s*kira-kit-ignore\s+([a-z0-9-]+)\s*:\s*(.+)$/i;

const FILE_SUPPRESSION =
  /\/\*\s*kira-kit-ignore-file\s+([a-z0-9-]+)\s*:\s*([^*]+)\*\//i;

/** Suppression comment without a reason is itself an error. */
const LINE_SUPPRESSION_NO_REASON = /\/\/\s*kira-kit-ignore\s+([a-z0-9-]+)\s*$/i;

const FILE_SUPPRESSION_NO_REASON =
  /\/\*\s*kira-kit-ignore-file\s+([a-z0-9-]+)\s*\*\//i;

/** Owner contract for parseSuppressions: parsed ignores plus format findings. */
export interface ParsedSuppressions {
  errors: Finding[];
  suppressions: FileSuppressions;
}

export function parseSuppressions(
  source: string,
  file: string,
): ParsedSuppressions {
  const suppressions: FileSuppressions = { line: [], file: [] };
  const errors: Finding[] = [];
  const lines = source.split("\n");

  lines.forEach((text, index) => {
    const match = LINE_SUPPRESSION.exec(text.trim());

    if (match) {
      suppressions.line.push({
        checkId: match[1],
        line: index + 1,
        reason: match[2].trim(),
      });

      return;
    }

    if (LINE_SUPPRESSION_NO_REASON.exec(text.trim())) {
      errors.push({
        checkId: "suppression",
        severity: "error",
        file,
        line: index + 1,
        message:
          "kira-kit-ignore without a reason — add `: <why this is intentional>`.",
      });
    }
  });

  const fileMatch = FILE_SUPPRESSION.exec(source);

  if (fileMatch) {
    suppressions.file.push({
      checkId: fileMatch[1],
      line: 0,
      reason: fileMatch[2].trim(),
    });
  } else if (FILE_SUPPRESSION_NO_REASON.exec(source)) {
    errors.push({
      checkId: "suppression",
      severity: "error",
      file,
      message:
        "kira-kit-ignore-file without a reason — add `: <why this is intentional>`.",
    });
  }

  return { errors, suppressions };
}

export function isSuppressed(
  finding: Finding,
  suppressions: FileSuppressions,
): boolean {
  if (suppressions.file.some((s) => s.checkId === finding.checkId)) return true;

  if (finding.line === undefined) return false;

  return suppressions.line.some(
    (s) => s.checkId === finding.checkId && s.line + 1 === finding.line,
  );
}

export function unusedSuppressions(
  findings: Finding[],
  suppressions: FileSuppressions,
  file: string,
): Finding[] {
  const used = new Set<string>();

  for (const suppression of suppressions.file) {
    const key = `file:${suppression.checkId}`;

    if (findings.some((f) => f.checkId === suppression.checkId)) used.add(key);
  }

  for (const suppression of suppressions.line) {
    const key = `line:${suppression.line}:${suppression.checkId}`;

    if (
      findings.some(
        (f) =>
          f.checkId === suppression.checkId && f.line === suppression.line + 1,
      )
    ) {
      used.add(key);
    }
  }

  const unused: Finding[] = [];

  for (const suppression of suppressions.file) {
    if (!used.has(`file:${suppression.checkId}`)) {
      unused.push({
        checkId: "suppression",
        severity: "warning",
        file,
        message: `file-level kira-kit-ignore for "${suppression.checkId}" suppresses nothing.`,
      });
    }
  }

  for (const suppression of suppressions.line) {
    if (!used.has(`line:${suppression.line}:${suppression.checkId}`)) {
      unused.push({
        checkId: "suppression",
        severity: "warning",
        file,
        line: suppression.line,
        message: `kira-kit-ignore for "${suppression.checkId}" suppresses nothing.`,
      });
    }
  }

  return unused;
}

export type { Severity };
