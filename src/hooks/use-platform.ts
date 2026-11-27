import * as React from "react";

export type Platform = "mac" | "windows" | "linux" | "unknown";

/**
 * Platform detection via user agent. The UA is immutable per session, so the
 * parse runs once and is cached in a module-level variable;
 * `useSyncExternalStore` provides the stable snapshot React expects without a
 * state machine. The server snapshot is "unknown" → Windows-style rendering.
 */
let cached: Platform | undefined;

interface NavigatorUAData {
  platform?: string;
}

function readNavigatorPlatform(): string {
  if (typeof navigator === "undefined") return "";

  if ("userAgentData" in navigator) {
    // SAFETY: userAgentData is an optional Chromium Client Hints object not yet
    // present in lib.dom.d.ts; we guard typeof before reading platform.
    const uaData = navigator.userAgentData as NavigatorUAData | undefined;

    if (uaData?.platform !== undefined && uaData.platform.length > 0) {
      return uaData.platform;
    }
  }

  return navigator.userAgent;
}

function detectPlatform(): Platform {
  if (cached) return cached;
  const source = readNavigatorPlatform();

  if (/Mac|iPhone|iPad|iOS/i.test(source)) cached = "mac";
  else if (/Win/i.test(source)) cached = "windows";
  else if (/Linux|X11|CrOS/i.test(source)) cached = "linux";
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
