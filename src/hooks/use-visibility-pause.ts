import * as React from "react";

function subscribeDocumentVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);

  return () => document.removeEventListener("visibilitychange", onChange);
}

function getDocumentVisibleSnapshot() {
  return document.visibilityState !== "hidden";
}

function getDocumentVisibleServerSnapshot() {
  return true;
}

/**
 * Returns `true` while the document tab is visible and `false` when hidden.
 * Safe during SSR (defaults to `true`).
 */
export function useDocumentVisible(): boolean {
  return React.useSyncExternalStore(
    subscribeDocumentVisibility,
    getDocumentVisibleSnapshot,
    getDocumentVisibleServerSnapshot,
  );
}

/**
 * Returns `true` when animations or timers on `ref` should pause because
 * either the document tab is hidden or the element is scrolled offscreen.
 */
export function useVisibilityPause(
  ref: React.RefObject<Element | null>,
  enabled = true,
): boolean {
  const documentVisible = useDocumentVisible();
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    const node = ref.current;

    if (!enabled || !node || typeof IntersectionObserver === "undefined") {
      setInView(true);

      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setInView(entry.isIntersecting);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, enabled]);

  if (!enabled) return false;

  return !documentVisible || !inView;
}
