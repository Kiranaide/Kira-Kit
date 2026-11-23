import { readdirSync } from "node:fs";
import { join } from "node:path";

const IGNORED_DIRS = new Set(["node_modules", ".git", "dist"]);
const SOURCE_FILE_RE = /\.(tsx?|jsx?)$/;

function walk(dir: string, out: string[]): void {
  let entries;

  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, out);
    } else if (SOURCE_FILE_RE.test(entry.name)) {
      out.push(full);
    }
  }
}

/** Recursively collect TS/JS source files under `dir`, skipping build/vendor dirs. */
export function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];

  walk(dir, out);

  return out;
}
