import type { Finding, Severity } from "./types";

export interface Suppression {
  checkId: string;
  /** 1-based line the suppression comment sits on. */
  line: number;
  /** First covered line (next non-suppression line after the comment). */
  target: number;
  /** Last covered line; extends through a JSX opening tag when one follows. */
  end: number;
  reason: string;
}

export interface FileSuppressions {
  line: Suppression[];
  file: Suppression[];
}

const LINE_SUPPRESSION = /\/\/\s*kira-kit-ignore\s+([a-z0-9-]+)\s*:\s*(.+)$/i;

const JSX_LINE_SUPPRESSION =
  /^\{\s*\/\*\s*kira-kit-ignore\s+([a-z0-9-]+)\s*:\s*(.+?)\s*\*\/\s*\}$/i;

const FILE_SUPPRESSION =
  /\/\*\s*kira-kit-ignore-file\s+([a-z0-9-]+)\s*:\s*([^*]+)\*\//i;

/** Suppression comment without a reason is itself an error. */
const LINE_SUPPRESSION_NO_REASON = /\/\/\s*kira-kit-ignore\s+([a-z0-9-]+)\s*$/i;

const JSX_LINE_SUPPRESSION_NO_REASON =
  /^\{\s*\/\*\s*kira-kit-ignore\s+([a-z0-9-]+)\s*\*\/\s*\}$/i;

const FILE_SUPPRESSION_NO_REASON =
  /\/\*\s*kira-kit-ignore-file\s+([a-z0-9-]+)\s*\*\//i;

/** Owner contract for parseSuppressions: parsed ignores plus format findings. */
export interface ParsedSuppressions {
  errors: Finding[];
  suppressions: FileSuppressions;
}

interface RawSuppression {
  checkId: string;
  line: number;
  reason: string;
}

function isSuppressionLine(text: string): boolean {
  const trimmed = text.trim();

  return (
    LINE_SUPPRESSION.test(trimmed) ||
    JSX_LINE_SUPPRESSION.test(trimmed) ||
    LINE_SUPPRESSION_NO_REASON.test(trimmed) ||
    JSX_LINE_SUPPRESSION_NO_REASON.test(trimmed)
  );
}

interface LineSuppressionParse {
  raw: RawSuppression[];
  errors: Finding[];
}

interface FileSuppressionParse {
  suppressions: Suppression[];
  errors: Finding[];
}

function collectLineSuppressions(
  lines: string[],
  file: string,
): LineSuppressionParse {
  const raw: RawSuppression[] = [];
  const errors: Finding[] = [];

  lines.forEach((text, index) => {
    const trimmed = text.trim();

    const match =
      LINE_SUPPRESSION.exec(trimmed) ?? JSX_LINE_SUPPRESSION.exec(trimmed);

    if (match) {
      raw.push({
        checkId: match[1],
        line: index + 1,
        reason: match[2].trim(),
      });

      return;
    }

    if (
      LINE_SUPPRESSION_NO_REASON.test(trimmed) ||
      JSX_LINE_SUPPRESSION_NO_REASON.test(trimmed)
    ) {
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

  return { raw, errors };
}

/** A comment above a JSX opening tag covers the whole tag (≤40 lines). */
function openingTagEnd(lines: string[], target: number): number {
  const targetText = (lines[target - 1] ?? "").trim();

  if (!/^<[A-Za-z]/.test(targetText) || /\/?>$/.test(targetText)) {
    return target;
  }

  for (let i = target; i < Math.min(target + 40, lines.length); i++) {
    if (/\/?>$/.test(lines[i].trim())) return i + 1;
  }

  return target;
}

// Stacked suppression comments all cover the next non-suppression line.
function resolveRanges(raw: RawSuppression[], lines: string[]): Suppression[] {
  return raw.map((entry) => {
    let target = entry.line + 1;

    while (target <= lines.length && isSuppressionLine(lines[target - 1])) {
      target++;
    }

    return { ...entry, target, end: openingTagEnd(lines, target) };
  });
}

function collectFileSuppressions(
  source: string,
  file: string,
): FileSuppressionParse {
  const matches = [...source.matchAll(new RegExp(FILE_SUPPRESSION, "gi"))];

  const suppressions = matches.map((m) => ({
    checkId: m[1],
    line: 0,
    target: 0,
    end: Number.MAX_SAFE_INTEGER,
    reason: m[2].trim(),
  }));

  const errors: Finding[] = [];

  if (matches.length === 0 && FILE_SUPPRESSION_NO_REASON.test(source)) {
    errors.push({
      checkId: "suppression",
      severity: "error",
      file,
      message:
        "kira-kit-ignore-file without a reason — add `: <why this is intentional>`.",
    });
  }

  return { suppressions, errors };
}

export function parseSuppressions(
  source: string,
  file: string,
): ParsedSuppressions {
  const lines = source.split("\n");
  const lineResult = collectLineSuppressions(lines, file);
  const fileResult = collectFileSuppressions(source, file);

  return {
    errors: [...lineResult.errors, ...fileResult.errors],
    suppressions: {
      line: resolveRanges(lineResult.raw, lines),
      file: fileResult.suppressions,
    },
  };
}

export function isSuppressed(
  finding: Finding,
  suppressions: FileSuppressions,
): boolean {
  if (suppressions.file.some((s) => s.checkId === finding.checkId)) return true;

  if (finding.line === undefined) return false;

  return suppressions.line.some(
    (s) =>
      s.checkId === finding.checkId &&
      finding.line! >= s.target &&
      finding.line! <= s.end,
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
          f.checkId === suppression.checkId &&
          f.line !== undefined &&
          f.line >= suppression.target &&
          f.line <= suppression.end,
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
