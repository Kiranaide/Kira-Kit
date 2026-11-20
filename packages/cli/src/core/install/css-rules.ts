import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  topLevelBlocks,
  upsertDeclarations,
  type TopLevelBlock,
} from "./css-vars";

function normalizeSelector(selector: string): string {
  return selector.replace(/\s+/g, " ").trim();
}

function parseDeclarations(body: string) {
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

function appendBlock(css: string, raw: string): string {
  return `${css.replace(/\s*$/, "")}\n\n${raw}\n`;
}

function findBlock(css: string, selector: string): TopLevelBlock | undefined {
  const norm = normalizeSelector(selector);

  return topLevelBlocks(css).find(
    (block) => normalizeSelector(block.selector) === norm,
  );
}

/**
 * Merge one top-level rule into CSS text, idempotently:
 * - :root / @theme blocks upsert declarations, never replace the block.
 * - @media / @supports blocks merge their inner rules, so an existing
 *   reduced-motion gate keeps its other rules.
 * - Anything else (@keyframes, pseudo-element rules) replaces the body of a
 *   same-selector block, or appends when none exists.
 */
function mergeRule(css: string, selector: string, body: string): string {
  const norm = normalizeSelector(selector);

  if (norm === ":root" || norm.startsWith("@theme")) {
    const vars = parseDeclarations(body);

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

/** Merge a registry item's css snippet into the consumer's global CSS file. */
export function mergeCssRules(cssPath: string, snippet: string): boolean {
  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf-8") : "";
  const merged = mergeCssRulesText(css, snippet);

  if (merged === css) return false;

  mkdirSync(dirname(cssPath), { recursive: true });
  writeFileSync(cssPath, merged, "utf-8");

  return true;
}
