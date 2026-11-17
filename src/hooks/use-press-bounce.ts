"use client";

import * as React from "react";
import gsap from "gsap";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Press micro-interaction: <150ms, transform only, reduced-motion gated,
 * interruptible (§5 — `overwrite: "auto"` cancels any in-flight tween).
 */
export function usePressBounce(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
): () => void {
  const reducedMotion = useReducedMotion();

  return React.useCallback(() => {
    if (!enabled || reducedMotion || !ref.current) return;

    gsap.to(ref.current, {
      scale: 0.95,
      duration: 0.075,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      overwrite: "auto",
    });
  }, [enabled, reducedMotion, ref]);
}
