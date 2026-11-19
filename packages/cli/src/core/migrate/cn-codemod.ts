/**
 * Native cn codemod: legacy clsx / tailwind-merge / @/lib/cn imports and
 * calls become the single `cn` npm package. Call collapsing is best-effort
 * (paren counting, not a full parser) — review the diff after migrating.
 */

const LEGACY_IMPORT =
  /import\s+(?:\{[^}]*\}|[A-Za-z_$][\w$]*)\s+from\s+["'](?:clsx|tailwind-merge|@\/lib\/cn(?:\.ts)?|@\/utils\/cn|@\/helpers\/cn)["'];?/g;

const CN_IMPORT_LINE = 'import { cn } from "cn";';

function rewriteImports(content: string): string {
  return content.replace(LEGACY_IMPORT, CN_IMPORT_LINE);
}

function dedupeCnImport(content: string): string {
  const out: string[] = [];
  let seen = false;

  for (const line of content.split("\n")) {
    if (line.trim() === CN_IMPORT_LINE) {
      if (seen) continue;
      seen = true;
    }

    out.push(line);
  }

  return out.join("\n");
}

function renameCalls(content: string): string {
  return content
    .replaceAll(/\bclsx\(/g, "cn(")
    .replaceAll(/\btwMerge\(/g, "cn(");
}

/** Index just past the paren matching the one at `open`, or -1. */
function matchingParen(text: string, open: number): number {
  let depth = 1;

  for (let i = open; i < text.length; i += 1) {
    depth += Number(text[i] === "(") - Number(text[i] === ")");

    if (depth === 0) return i + 1;
  }

  return -1;
}

/** Collapse cn(cn(…)) pairs left behind by renaming clsx + twMerge calls. */
function collapseNestedCn(content: string): string {
  let result = "";
  let rest = content;

  for (;;) {
    const start = rest.search(/cn\(\s*cn\(/);

    if (start < 0) {
      result += rest;
      break;
    }

    const open = rest.indexOf("cn(", start + 3) + 3;
    const close = matchingParen(rest, open);
    const tail = close > 0 ? rest.slice(close).match(/^\s*\)/) : null;

    if (tail) {
      result += `${rest.slice(0, start)}cn(${rest.slice(open, close - 1)})`;
      rest = rest.slice(close + tail[0].length);
    } else {
      result += rest.slice(0, open);
      rest = rest.slice(open);
    }
  }

  return result;
}

/** Full cn migration for one source file's contents. */
export function migrateCnSource(content: string): string {
  return dedupeCnImport(collapseNestedCn(renameCalls(rewriteImports(content))));
}
