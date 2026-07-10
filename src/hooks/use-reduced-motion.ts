// === USE REDUCED MOTION HOOK ===

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * Returns `true` when the user has requested reduced motion, so callers can
 * skip or shorten non-essential animations. Updates live when the OS setting
 * changes. SSR-safe (returns `false` on the server).
 *
 * @example
 * const reducedMotion = useReducedMotion();
 * <div className={cn(!reducedMotion && "transition-[height]")} />
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
