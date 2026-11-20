import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// One shared MediaQueryList per page instead of a new one on every
// getSnapshot call (React may call getSnapshot many times per render).
let mql: MediaQueryList | null | undefined;

function getMediaQueryList(): MediaQueryList | null {
  if (mql !== undefined) return mql;
  mql =
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Older browsers may expose window without the matchMedia API.
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(QUERY)
      : null;

  return mql;
}

function subscribe(onChange: () => void): () => void {
  const list = getMediaQueryList();

  if (!list) return () => {};

  list.addEventListener("change", onChange);

  return () => list.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return getMediaQueryList()?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks the user's `prefers-reduced-motion` setting, for motion driven
 * from JS (WAAPI, scroll-into-view `behavior`, animation libraries, timers).
 * Prefer Tailwind's `motion-reduce:` / `motion-safe:` variants for CSS-only
 * animation: they apply before hydration, so there's no flash of motion.
 */
export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-React read of the current preference (event handlers, utilities). */
export function prefersReducedMotion(): boolean {
  return getSnapshot();
}
