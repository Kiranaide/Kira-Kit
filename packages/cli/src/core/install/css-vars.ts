import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface CssVars {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

type Scope = "light" | "dark" | "theme";

const SCOPE_SELECTOR: Record<Scope, string> = {
  light: ":root",
  dark: ".dark",
  theme: "@theme inline",
};

export interface TopLevelBlock {
  selector: string;
  /** Index of the opening brace. */
  open: number;
  /** Index of the matching closing brace. */
  close: number;
}

/** Blank out comments without shifting indices, so scans stay aligned. */
function maskComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => " ".repeat(match.length));
}

/**
 * Depth-0 blocks only: a second :root/.dark nested inside @layer base is
 * deliberately invisible to the merge.
 */
export function topLevelBlocks(css: string): TopLevelBlock[] {
  const masked = maskComments(css);
  const blocks: TopLevelBlock[] = [];
  let depth = 0;
  let start = 0;
  let open = -1;

  for (let i = 0; i < masked.length; i += 1) {
    const ch = masked[i];

    if (ch === "{") {
      if (depth === 0) open = i;
      depth += 1;

      continue;
    }

    if (ch === "}") {
      depth -= 1;

      if (depth === 0 && open >= 0) {
        blocks.push({
          selector: masked.slice(start, open).trim(),
          open,
          close: i,
        });
        open = -1;
        start = i + 1;
      }

      continue;
    }

    if (ch === ";" && depth === 0) start = i + 1;
  }

  return blocks;
}

function matchesSelector(selector: string, scope: Scope): boolean {
  if (scope === "theme") return selector.startsWith("@theme");

  return selector === SCOPE_SELECTOR[scope];
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function upsertDeclarations(
  body: string,
  vars: Record<string, string>,
): string {
  let next = body;
  const missing: string[] = [];

  for (const [key, value] of Object.entries(vars)) {
    const pattern = new RegExp(`(${escapeRegExp(key)}\\s*:\\s*)[^;]+;`);

    if (pattern.test(next)) {
      next = next.replace(pattern, `$1${value};`);
    } else {
      missing.push(`  ${key}: ${value};`);
    }
  }

  if (missing.length > 0) {
    next = `${next.replace(/\s*$/, "")}\n${missing.join("\n")}\n`;
  }

  return next;
}

function mergeScope(
  css: string,
  scope: Scope,
  vars: Record<string, string>,
): string {
  const block = topLevelBlocks(css).find((b) =>
    matchesSelector(b.selector, scope),
  );

  if (!block) {
    const declarations = Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join("\n");

    return `${css.replace(/\s*$/, "")}\n\n${SCOPE_SELECTOR[scope]} {\n${declarations}\n}\n`;
  }

  const body = css.slice(block.open + 1, block.close);
  const merged = upsertDeclarations(body, vars);

  return css.slice(0, block.open + 1) + merged + css.slice(block.close);
}

/** Merge cssVars into CSS text: update in place, append missing, create blocks. */
export function mergeCssVarsText(css: string, cssVars: CssVars): string {
  let next = css;

  for (const scope of ["light", "dark", "theme"] as const) {
    const vars = cssVars[scope];

    if (!vars || Object.keys(vars).length === 0) continue;

    next = mergeScope(next, scope, vars);
  }

  return next;
}

/** Merge cssVars into the consumer's global CSS file. Returns true if changed. */
export function mergeCssVars(cssPath: string, cssVars: CssVars): boolean {
  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf-8") : "";
  const merged = mergeCssVarsText(css, cssVars);

  if (merged === css) return false;

  mkdirSync(dirname(cssPath), { recursive: true });
  writeFileSync(cssPath, merged, "utf-8");

  return true;
}
