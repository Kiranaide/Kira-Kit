import * as React from "react";

export type Platform = "mac" | "windows" | "linux" | "unknown";

/**
 * Platform detection via user agent. The UA is immutable per session, so the
 * parse runs once and is cached in a module-level variable;
 * `useSyncExternalStore` provides the stable snapshot React expects without a
 * state machine. The server snapshot is "unknown" → Windows-style rendering.
 */
let cached: Platform | undefined;

function detectPlatform(): Platform {
  if (cached) return cached;
  const ua = navigator.userAgent;

  if (/Mac|iPhone|iPad/i.test(ua)) cached = "mac";
  else if (/Win/i.test(ua)) cached = "windows";
  else if (/Linux|X11/i.test(ua)) cached = "linux";
  else cached = "unknown";

  return cached;
}

const noopSubscribe = () => () => {};

export function usePlatform(): Platform {
  return React.useSyncExternalStore(
    noopSubscribe,
    detectPlatform,
    // SAFETY: "unknown" is a member of Platform; the server tree renders
    // Windows-style caps and the client snapshot replaces it on hydration.
    () => "unknown" as Platform,
  );
}
