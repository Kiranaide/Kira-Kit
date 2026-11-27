import type { Check, Finding } from "./types";

/**
 * Check 6: interactive targets below 24px (WCAG 2.5.8). Flags a bare
 * `h-*`/`size-*` below 6 on class strings that carry interactive
 * affordances (pointer cursor, focus ring, hover/active) or sit on
 * interactive JSX tags. Icons inside a sized target are not findings.
 */
const SMALL_SIZE = /^(?:h|size)-(\d+(?:\.\d+)?)$/;
const STRING_LITERAL = /"([^"\\\n]*)"|'([^'\\\n]*)'/g;
const INTERACTIVE_TAG = /<(?:button|input|select|textarea|a|summary)\b[^>]*>/g;

function isInteractiveToken(token: string): boolean {
  return (
    token === "cursor-pointer" ||
    token === "cursor-grab" ||
    token.startsWith("focus-visible:") ||
    token.startsWith("focus:") ||
    token.startsWith("hover:bg-") ||
    token.startsWith("active:")
  );
}

export const targetSize: Check = (file) => {
  const findings: Finding[] = [];
  const flaggedLines = new Set<number>();

  const scan = (text: string, offset: number, requireMarker: boolean) => {
    for (const match of text.matchAll(STRING_LITERAL)) {
      const value = match[1] ?? match[2] ?? "";
      const tokens = value.split(/\s+/);

      if (requireMarker && !tokens.some(isInteractiveToken)) continue;

      const small = tokens.filter((token) => {
        const m = SMALL_SIZE.exec(token);

        return m !== null && Number(m[1]) < 6;
      });

      if (small.length === 0) continue;

      const line = file.content
        .slice(0, offset + match.index)
        .split("\n").length;

      if (flaggedLines.has(line)) continue;

      flaggedLines.add(line);
      findings.push({
        checkId: "target-size",
        severity: "warning",
        file: file.name,
        line,
        message: `interactive element with ${small.join("/")} below 24px — check target size (WCAG 2.5.8).`,
      });
    }
  };

  scan(file.content, 0, true);

  for (const tag of file.content.matchAll(INTERACTIVE_TAG)) {
    scan(tag[0], tag.index, false);
  }

  return findings;
};
