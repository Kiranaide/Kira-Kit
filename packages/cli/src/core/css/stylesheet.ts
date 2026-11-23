import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { applyFontToCss } from "../install/apply-fonts";
import type { FontSpec } from "../theme/fonts";
import type { SourceRegistryItem } from "../../lib/schemas";

export interface CssVars {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface ThemeTokens {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface TopLevelBlock {
  selector: string;
  /** Index of the opening brace. */
  open: number;
  /** Index of the matching closing brace. */
  close: number;
}

type Scope = "light" | "dark" | "theme";

const SCOPE_SELECTOR: Record<Scope, string> = {
  light: ":root",
  dark: ".dark",
  theme: "@theme inline",
};

/** Blank out comments without shifting indices, so scans stay aligned. */
export function maskComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => " ".repeat(match.length));
}

/** Find the closing brace index matching the opening brace at `open`, or -1. */
export function matchingBrace(masked: string, open: number): number {
  let depth = 0;

  for (let i = open; i < masked.length; i += 1) {
    if (masked[i] === "{") {
      depth += 1;
    } else if (masked[i] === "}") {
      depth -= 1;

      if (depth === 0) return i;
    }
  }

  return -1;
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

export function parseDeclarations(body: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];

  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    pairs.push([match[1], match[2].replace(/\s+/g, " ").trim()]);
  }

  return pairs;
}

function normalizeSelector(selector: string): string {
  return selector.replace(/\s+/g, " ").trim();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function appendBlock(css: string, raw: string): string {
  return `${css.replace(/\s*$/, "")}\n\n${raw}\n`;
}

function matchesSelector(selector: string, scope: Scope): boolean {
  if (scope === "theme") return selector.startsWith("@theme");

  return selector === SCOPE_SELECTOR[scope];
}

function findBlock(css: string, selector: string): TopLevelBlock | undefined {
  const norm = normalizeSelector(selector);

  return topLevelBlocks(css).find(
    (block) => normalizeSelector(block.selector) === norm,
  );
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

function mergeRule(css: string, selector: string, body: string): string {
  const norm = normalizeSelector(selector);

  if (norm === ":root" || norm.startsWith("@theme")) {
    const vars = Object.fromEntries(parseDeclarations(body));

    if (Object.keys(vars).length === 0) return css;

    const target = topLevelBlocks(css).find((block) => {
      const blockNorm = normalizeSelector(block.selector);

      return norm.startsWith("@theme")
        ? blockNorm.startsWith("@theme")
        : blockNorm === ":root";
    });

    if (!target) return appendBlock(css, `${selector} {${body}}`);

    const merged = upsertDeclarations(
      css.slice(target.open + 1, target.close),
      vars,
    );

    return css.slice(0, target.open + 1) + merged + css.slice(target.close);
  }

  if (norm.startsWith("@media") || norm.startsWith("@supports")) {
    const target = findBlock(css, selector);

    if (!target) return appendBlock(css, `${selector} {${body}}`);

    let inner = css.slice(target.open + 1, target.close);

    for (const rule of topLevelBlocks(body)) {
      inner = mergeRule(
        inner,
        rule.selector,
        body.slice(rule.open + 1, rule.close),
      );
    }

    return css.slice(0, target.open + 1) + inner + css.slice(target.close);
  }

  const target = findBlock(css, selector);

  if (!target) return appendBlock(css, `${selector} {${body}}`);

  return css.slice(0, target.open + 1) + body + css.slice(target.close);
}

/** Merge a raw CSS snippet into CSS text. Re-merging the same snippet is a no-op. */
export function mergeCssRulesText(css: string, snippet: string): string {
  let next = css;

  for (const block of topLevelBlocks(snippet)) {
    next = mergeRule(
      next,
      block.selector,
      snippet.slice(block.open + 1, block.close),
    );
  }

  return next;
}

function commitCss(
  cssPath: string,
  transform: (css: string) => string,
): boolean {
  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf-8") : "";
  const merged = transform(css);

  if (merged === css) return false;

  mkdirSync(dirname(cssPath), { recursive: true });
  writeFileSync(cssPath, merged, "utf-8");

  return true;
}

/** Merge cssVars into the consumer's global CSS file. Returns true if changed. */
export function mergeCssVars(cssPath: string, cssVars: CssVars): boolean {
  return commitCss(cssPath, (css) => mergeCssVarsText(css, cssVars));
}

/** Merge a registry item's css snippet into the consumer's global CSS file. */
export function mergeCssRules(cssPath: string, snippet: string): boolean {
  return commitCss(cssPath, (css) => mergeCssRulesText(css, snippet));
}

export interface ApplyItemStylesResult {
  cssVarsApplied: boolean;
  cssRulesApplied: boolean;
}

/** Apply cssVars and raw css snippets from multiple registry items in one file write. */
export function applyItemStyles(
  cssPath: string,
  items: Array<{ cssVars?: CssVars; css?: string }>,
): ApplyItemStylesResult {
  const initial = existsSync(cssPath) ? readFileSync(cssPath, "utf-8") : "";
  let next = initial;
  let cssVarsApplied = false;
  let cssRulesApplied = false;

  for (const item of items) {
    if (item.cssVars) {
      const updated = mergeCssVarsText(next, item.cssVars);

      if (updated !== next) {
        next = updated;
        cssVarsApplied = true;
      }
    }

    if (item.css) {
      const updated = mergeCssRulesText(next, item.css);

      if (updated !== next) {
        next = updated;
        cssRulesApplied = true;
      }
    }
  }

  if (next !== initial) {
    mkdirSync(dirname(cssPath), { recursive: true });
    writeFileSync(cssPath, next, "utf-8");
  }

  return { cssVarsApplied, cssRulesApplied };
}

function isMotionToken(key: string): boolean {
  return key.startsWith("--animate-") || key.startsWith("--ease-");
}

/** Extract depth-0 :root/.dark custom properties (kit CSS tokens). */
export function extractThemeTokens(css: string): ThemeTokens {
  const tokens: ThemeTokens = { light: {}, dark: {} };

  for (const block of topLevelBlocks(css)) {
    if (block.selector !== ":root" && block.selector !== ".dark") continue;

    const target = block.selector === ":root" ? tokens.light : tokens.dark;
    const body = css.slice(block.open + 1, block.close);

    for (const [key, value] of parseDeclarations(body)) {
      if (isMotionToken(key)) continue;

      target[key] = value;
    }
  }

  return tokens;
}

/** Point the kit CSS at the utilities file shipped beside it. */
export function buildBaseCss(
  css: string,
  utilitiesImport: string,
  fonts?: {
    sans: FontSpec;
    mono: FontSpec;
    display?: FontSpec;
    headingTracking?: string;
  },
): string {
  const rewired = css.replace(
    /@import\s+["'][^"']*kira-utilities\.css["'];?/,
    `@import "${utilitiesImport}";`,
  );

  return fonts
    ? applyFontToCss(
        rewired,
        fonts.sans,
        fonts.mono,
        fonts.display,
        fonts.headingTracking,
      )
    : rewired;
}

/** registry:theme item carrying the kit's own docs-app theme. */
export function defaultThemeItem(css: string): SourceRegistryItem {
  const tokens = extractThemeTokens(css);

  return {
    name: "theme-default",
    type: "registry:theme",
    title: "Kira Default",
    description:
      "The kit's own docs-app theme: a pink primary on neutral surfaces with a compact 0.45rem radius.",
    cssVars: {
      theme: { "--radius": tokens.light["--radius"] ?? "0.45rem" },
      light: tokens.light,
      dark: tokens.dark,
    },
  };
}
