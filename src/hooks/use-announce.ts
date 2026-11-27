import * as React from "react";

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

function createAnnouncementRegion(politeness: "polite" | "assertive") {
  const region = document.createElement("div");
  region.setAttribute("role", politeness === "polite" ? "status" : "alert");
  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-atomic", "true");
  region.className = "sr-only";
  region.style.cssText = `
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
  document.body.appendChild(region);

  return region;
}

export function useAnnounce(options: UseAnnounceOptions = {}) {
  const { defaultPoliteness = "polite", debounceMs = 100 } = options;

  const politeRef = React.useRef<HTMLDivElement | null>(null);
  const assertiveRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Create live regions on mount
  React.useEffect(() => {
    const politeRegion = createAnnouncementRegion("polite");
    politeRef.current = politeRegion;

    const assertiveRegion = createAnnouncementRegion("assertive");
    assertiveRef.current = assertiveRegion;

    return () => {
      politeRegion.remove();
      assertiveRegion.remove();
      politeRef.current = null;
      assertiveRef.current = null;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const announce = React.useCallback(
    (message: string, announceOptions?: AnnounceOptions) => {
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
          if (region.isConnected) region.textContent = message;
        });
      }, debounceMs);
    },
    [defaultPoliteness, debounceMs],
  );

  const announcePolite = React.useCallback(
    (message: string) => announce(message, { politeness: "polite" }),
    [announce],
  );

  const announceAssertive = React.useCallback(
    (message: string) => announce(message, { politeness: "assertive" }),
    [announce],
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
