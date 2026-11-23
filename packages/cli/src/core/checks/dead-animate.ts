import { ANIMATE_BUILTINS } from "../registry/motion-css";
import type { Check, Finding } from "./types";

/**
 * Check 3: `animate-*` utility without a matching `--animate-*` token AND
 * `@keyframes` in the global CSS (dead animation). Builtin Tailwind
 * animations are exempt.
 */
export const deadAnimate: Check = (file, ctx) => {
  const findings: Finding[] = [];

  for (const name of animateNames(file.content)) {
    if (ANIMATE_BUILTINS.has(name)) continue;
    const hasToken = ctx.indexCss.includes(`--animate-${name}`);

    const hasKeyframes = new RegExp(`@keyframes\\s+${name}\\s*\\{`).test(
      ctx.indexCss,
    );

    if (!hasToken || !hasKeyframes) {
      findings.push({
        checkId: "dead-animate",
        severity: "error",
        file: file.name,
        message: `uses \`animate-${name}\` but the global CSS is missing ${
          hasToken ? `@keyframes ${name}` : `--animate-${name}`
        } (dead animation).`,
      });
    }
  }

  return findings;
};

export function animateNames(content: string): Set<string> {
  const names = new Set<string>();

  for (const match of content.matchAll(/animate-([a-z0-9-]+)/g)) {
    names.add(match[1]);
  }

  return names;
}
