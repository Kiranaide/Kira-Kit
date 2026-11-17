import type { Check } from "./types";
import { animateNames } from "./dead-animate";

/**
 * Check 5: motion (gsap or animate-*) without `useReducedMotion` or
 * `gsap.matchMedia` gating.
 */
export const reducedMotion: Check = (file) => {
  const content = file.content;
  const usesGsap = /from\s+["']gsap/.test(content);
  const usesAnimate = animateNames(content).size > 0;
  const gated =
    content.includes("useReducedMotion") || content.includes("gsap.matchMedia");

  if ((usesGsap || usesAnimate) && !gated) {
    return [
      {
        checkId: "reduced-motion",
        severity: "warning",
        file: file.name,
        message:
          "imports gsap or uses animate-* but has neither useReducedMotion nor gsap.matchMedia.",
      },
    ];
  }
  return [];
};
