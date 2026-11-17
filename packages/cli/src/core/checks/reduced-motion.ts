import type { Check } from "./types";
import { animateNames } from "./dead-animate";

/**
 * Check 5: motion (gsap or animate-*) without reduced-motion gating.
 * JS-driven motion (gsap) needs a JS gate in the file; CSS animation
 * utilities are also covered by `motion-reduce:` variants or the kit-wide
 * `prefers-reduced-motion` gate in src/index.css.
 */
export const reducedMotion: Check = (file, ctx) => {
  const content = file.content;
  const usesGsap = /from\s+["']gsap/.test(content);
  const usesAnimate = animateNames(content).size > 0;

  const jsGated =
    content.includes("useReducedMotion") ||
    content.includes("gsap.matchMedia") ||
    content.includes("prefersReducedMotion");

  const cssGated = jsGated || /motion-reduce:/.test(content);

  const globalCssGate =
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(ctx.indexCss) &&
    /animation-duration:\s*0/.test(ctx.indexCss);

  if (usesGsap && !jsGated) {
    return [
      {
        checkId: "reduced-motion",
        severity: "warning",
        file: file.name,
        message:
          "imports gsap but has no useReducedMotion / prefersReducedMotion / gsap.matchMedia gate.",
      },
    ];
  }

  if (usesAnimate && !cssGated && !globalCssGate) {
    return [
      {
        checkId: "reduced-motion",
        severity: "warning",
        file: file.name,
        message:
          "uses animate-* but has no motion-reduce variant, JS gate, or global reduced-motion gate in index.css.",
      },
    ];
  }

  return [];
};
