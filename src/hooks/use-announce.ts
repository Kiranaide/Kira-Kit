import * as React from "react";

// ============================================
// USE ANNOUNCE HOOK
// ============================================
// A standalone hook for screen reader announcements
// that doesn't require a provider (creates its own live region)

interface UseAnnounceOptions {
  /** Default politeness level */
  defaultPoliteness?: "polite" | "assertive";
  /** Debounce rapid announcements (ms) */
  debounceMs?: number;
}

interface AnnounceOptions {
  /** Politeness level for this announcement */
  politeness?: "polite" | "assertive";
}

export function useAnnounce(options: UseAnnounceOptions = {}) {
  const { defaultPoliteness = "polite", debounceMs = 100 } = options;

  const politeRef = React.useRef<HTMLDivElement | null>(null);
  const assertiveRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Create live regions on mount
  React.useEffect(() => {
    // Create polite live region
    const politeRegion = document.createElement("div");
    politeRegion.setAttribute("role", "status");
    politeRegion.setAttribute("aria-live", "polite");
    politeRegion.setAttribute("aria-atomic", "true");
    politeRegion.className = "sr-only";
    politeRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(politeRegion);
    politeRef.current = politeRegion;

    // Create assertive live region
    const assertiveRegion = document.createElement("div");
    assertiveRegion.setAttribute("role", "alert");
    assertiveRegion.setAttribute("aria-live", "assertive");
    assertiveRegion.setAttribute("aria-atomic", "true");
    assertiveRegion.className = "sr-only";
    assertiveRegion.style.cssText = politeRegion.style.cssText;
    document.body.appendChild(assertiveRegion);
    assertiveRef.current = assertiveRegion;

    setMounted(true);

    return () => {
      if (politeRef.current) {
        document.body.removeChild(politeRef.current);
      }

      if (assertiveRef.current) {
        document.body.removeChild(assertiveRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const announce = React.useCallback(
    (message: string, announceOptions?: AnnounceOptions) => {
      if (!mounted) return;

      const politeness = announceOptions?.politeness ?? defaultPoliteness;

      const region =
        politeness === "assertive" ? assertiveRef.current : politeRef.current;

      if (!region) return;

      // Clear any pending debounced announcement
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce to prevent rapid-fire announcements
      timeoutRef.current = setTimeout(() => {
        // Clear and set message (this triggers screen reader)
        region.textContent = "";
        // Small delay to ensure the clear is processed
        requestAnimationFrame(() => {
          region.textContent = message;
        });
      }, debounceMs);
    },
    [mounted, defaultPoliteness, debounceMs]
  );

  const announcePolite = React.useCallback(
    (message: string) => announce(message, { politeness: "polite" }),
    [announce]
  );

  const announceAssertive = React.useCallback(
    (message: string) => announce(message, { politeness: "assertive" }),
    [announce]
  );

  const clear = React.useCallback(() => {
    if (politeRef.current) {
      politeRef.current.textContent = "";
    }

    if (assertiveRef.current) {
      assertiveRef.current.textContent = "";
    }
  }, []);

  return {
    announce,
    announcePolite,
    announceAssertive,
    clear,
  };
}

export type { UseAnnounceOptions, AnnounceOptions };
