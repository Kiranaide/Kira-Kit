import type { Check, Finding } from "./types";

const ANIMATE_BUILTINS = new Set([
  "in",
  "out",
  "spin",
  "ping",
  "pulse",
  "bounce",
  "none",
]);

const ANIMATE_REGEX = /animate-([a-z0-9-]+)/g;

/**
 * Check 3: `animate-*` utility without a matching `--animate-*` token AND
 * `@keyframes` in the global CSS (dead animation). Builtin Tailwind
 * animations are exempt.
 */
export const deadAnimate: Check = (file, ctx) => {
  const findings: Finding[] = [];
  const names = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = ANIMATE_REGEX.exec(file.content)) !== null) {
    names.add(match[1]);
  }

  for (const name of names) {
    if (ANIMATE_BUILTINS.has(name)) continue;
    const hasToken = ctx.indexCss.includes(`--animate-${name}`);
    const hasKeyframes = new RegExp(`@keyframes\\s+${name}\\s*\\{`).test(ctx.indexCss);
    if (!hasToken || !hasKeyframes) {
      findings.push({
        checkId: "dead-animate",
        severity: "error",
        file: file.name,
        message: `uses \`animate-${name}\` but the global CSS is missing ${
          !hasToken ? `--animate-${name}` : `@keyframes ${name}`
        } (dead animation).`,
      });
    }
  }

  return findings;
};

export function animateNames(content: string): Set<string> {
  const names = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = ANIMATE_REGEX.exec(content)) !== null) {
    names.add(match[1]);
  }
  return names;
}
