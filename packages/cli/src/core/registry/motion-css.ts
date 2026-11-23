import { maskComments, matchingBrace } from "../css/stylesheet";

export const ANIMATE_BUILTINS = new Set([
  "in",
  "out",
  "spin",
  "ping",
  "pulse",
  "bounce",
  "none",
]);

export interface MotionAssets {
  /** `--animate-*` / `--ease-*` token declarations found in the kit CSS. */
  tokens: Map<string, string>;
  /** Keyframe name → full `@keyframes` block text (any nesting depth). */
  keyframes: Map<string, string>;
}

interface MotionUsage {
  tokens: Set<string>;
  keyframes: Set<string>;
}

/** Collect motion tokens and keyframes from the kit's CSS sources. */
export function extractMotionAssets(css: string): MotionAssets {
  const tokens = new Map<string, string>();
  const keyframes = new Map<string, string>();
  const masked = maskComments(css);

  for (const match of masked.matchAll(
    /(--(?:animate|ease)-[\w-]+)\s*:\s*([^;]+);/g,
  )) {
    tokens.set(match[1], match[2].replace(/\s+/g, " ").trim());
  }

  for (const match of masked.matchAll(/@keyframes\s+([\w-]+)/g)) {
    const open = masked.indexOf("{", match.index + match[0].length);

    if (open < 0) continue;

    const close = matchingBrace(masked, open);

    if (close < 0) continue;

    keyframes.set(match[1], css.slice(match.index, close + 1));
  }

  return { tokens, keyframes };
}

function stringLiterals(source: string): string[] {
  return [
    ...source.matchAll(
      /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g,
    ),
  ].map((match) => match[0]);
}

function usedInLiterals(literals: string[], name: string): boolean {
  const pattern = new RegExp(`(?<![\\w-])${name}(?![\\w-])`);

  return literals.some((literal) => pattern.test(literal));
}

function collectUsage(source: string, assets: MotionAssets): MotionUsage {
  const tokens = new Set<string>();
  const keyframes = new Set<string>();

  for (const match of source.matchAll(/animate-([a-z0-9-]+)/g)) {
    if (ANIMATE_BUILTINS.has(match[1])) continue;

    const token = `--animate-${match[1]}`;

    if (assets.tokens.has(token)) tokens.add(token);
  }

  for (const match of source.matchAll(/animate-\[([a-z0-9-]+)[_\]]/g)) {
    if (assets.keyframes.has(match[1])) keyframes.add(match[1]);
  }

  for (const match of source.matchAll(/(--ease-[\w-]+)/g)) {
    if (assets.tokens.has(match[1])) tokens.add(match[1]);
  }

  // Inline styles reference keyframes by bare name in string literals
  // (camera scan overlay, progress stripes). Class fragments like
  // `fade-in-0` or `animate-shake` are excluded by the boundary guards.
  const literals = stringLiterals(source);

  for (const name of assets.keyframes.keys()) {
    if (usedInLiterals(literals, name)) keyframes.add(name);
  }

  return { tokens, keyframes };
}

function expandToken(
  token: string,
  usage: MotionUsage,
  assets: MotionAssets,
): boolean {
  const value = assets.tokens.get(token) ?? "";
  let changed = false;

  for (const ref of value.matchAll(/var\((--(?:animate|ease)-[\w-]+)\)/g)) {
    if (!assets.tokens.has(ref[1]) || usage.tokens.has(ref[1])) continue;

    usage.tokens.add(ref[1]);
    changed = true;
  }

  if (token.startsWith("--animate-")) {
    for (const word of value.split(/[\s,()]+/)) {
      if (!assets.keyframes.has(word) || usage.keyframes.has(word)) continue;

      usage.keyframes.add(word);
      changed = true;
    }
  }

  return changed;
}

/** Token values pull in the keyframes they name and var()-referenced tokens. */
function closeOverUsage(usage: MotionUsage, assets: MotionAssets): void {
  let changed = true;

  while (changed) {
    changed = false;

    for (const token of usage.tokens) {
      if (expandToken(token, usage, assets)) changed = true;
    }
  }
}

function curatedHasToken(css: string, token: string): boolean {
  return css.includes(`${token}:`);
}

function curatedHasKeyframes(css: string, name: string): boolean {
  return new RegExp(`@keyframes\\s+${name}\\s*\\{`).test(css);
}

function tokenBlock(
  selector: string,
  tokens: string[],
  assets: MotionAssets,
): string {
  const declarations = tokens
    .map((token) => `  ${token}: ${assets.tokens.get(token)};`)
    .join("\n");

  return `${selector} {\n${declarations}\n}`;
}

function reducedMotionGate(source: string): string | undefined {
  const slots = [
    ...new Set(
      [...source.matchAll(/data-slot\s*[=:]\s*["']([\w-]+)["']/g)].map(
        (match) => match[1],
      ),
    ),
  ].sort();

  if (slots.length === 0) return undefined;

  const selectors = slots.map((slot) => `  [data-slot="${slot}"]`).join(",\n");

  return `@media (prefers-reduced-motion: reduce) {\n${selectors} {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n  }\n}`;
}

function emitBlocks(
  emitTokens: string[],
  emitKeyframes: string[],
  source: string,
  assets: MotionAssets,
  curated: string,
): string {
  const blocks: string[] = [];
  const easeTokens = emitTokens.filter((token) => token.startsWith("--ease-"));

  const animateTokens = emitTokens.filter((token) =>
    token.startsWith("--animate-"),
  );

  // --ease-* lives in :root (not @theme) so var() lookups always resolve,
  // mirroring src/index.css.
  if (easeTokens.length > 0) {
    blocks.push(tokenBlock(":root", easeTokens, assets));
  }

  if (animateTokens.length > 0) {
    blocks.push(tokenBlock("@theme inline", animateTokens, assets));
  }

  for (const name of emitKeyframes) {
    blocks.push(assets.keyframes.get(name) ?? "");
  }

  if (emitKeyframes.length > 0 && !curated.includes("prefers-reduced-motion")) {
    const gate = reducedMotionGate(source);

    if (gate) blocks.push(gate);
  }

  return blocks.join("\n\n") + "\n";
}

/**
 * Derive the motion CSS an item needs from the animations its sources
 * actually use, so `kira-kit add` backfills tokens and keyframes even when
 * the consumer's base stylesheet predates them (or init kept an existing
 * theme). Blocks already present in the item's curated `css` are skipped.
 */
export function deriveMotionCss(
  source: string,
  assets: MotionAssets,
  curatedCss?: string,
): string | undefined {
  const curated = curatedCss ?? "";
  const usage = collectUsage(source, assets);

  closeOverUsage(usage, assets);

  const emitTokens = [...usage.tokens]
    .filter((token) => !curatedHasToken(curated, token))
    .sort();

  const emitKeyframes = [...usage.keyframes]
    .filter((name) => !curatedHasKeyframes(curated, name))
    .sort();

  if (emitTokens.length === 0 && emitKeyframes.length === 0) return undefined;

  return emitBlocks(emitTokens, emitKeyframes, source, assets, curated);
}
