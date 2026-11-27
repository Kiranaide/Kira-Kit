/* oxlint-disable react/only-export-components -- context provider and hook co-located for site-wide Spotlight */
import * as React from "react";

interface SiteSpotlightContextValue {
  openSpotlight: () => void;
  preloadSpotlight: () => void;
}

const SiteSpotlightContext =
  React.createContext<SiteSpotlightContextValue | null>(null);

const LazySiteSpotlightDialog = React.lazy(() =>
  import("@/components/site/site-spotlight").then((module) => ({
    default: module.SiteSpotlightDialog,
  })),
);

function isSearchShortcut(event: KeyboardEvent): boolean {
  return (
    !event.defaultPrevented &&
    !event.repeat &&
    !event.isComposing &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "k" &&
    (event.ctrlKey || event.metaKey)
  );
}

function canTriggerFromTarget(
  target: EventTarget | null,
  isOpen: boolean,
): boolean {
  if (!(target instanceof HTMLElement)) return true;

  const dialog = target.closest('[role="dialog"]');

  if (dialog) {
    return isOpen && dialog.classList.contains("site-spotlight-dialog");
  }

  return (
    !target.isContentEditable &&
    target.closest("input, textarea, select") === null
  );
}

export function SiteSpotlightProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const preloadSpotlight = React.useCallback(() => {
    setLoaded(true);
  }, []);

  const openSpotlight = React.useCallback(() => {
    setLoaded(true);
    setOpen(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isSearchShortcut(event) ||
        !canTriggerFromTarget(event.target, open)
      ) {
        return;
      }

      event.preventDefault();
      setLoaded(true);
      setOpen((current) => !current);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const value = React.useMemo(
    () => ({ openSpotlight, preloadSpotlight }),
    [openSpotlight, preloadSpotlight],
  );

  return (
    <SiteSpotlightContext.Provider value={value}>
      {children}
      {loaded && (
        <React.Suspense fallback={null}>
          <LazySiteSpotlightDialog open={open} onOpenChange={setOpen} />
        </React.Suspense>
      )}
    </SiteSpotlightContext.Provider>
  );
}

export function useSiteSpotlight(): SiteSpotlightContextValue {
  const context = React.useContext(SiteSpotlightContext);

  if (!context) {
    return {
      openSpotlight: () => {},
      preloadSpotlight: () => {},
    };
  }

  return context;
}
