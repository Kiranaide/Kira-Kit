import * as React from "react";

// ============================================
// USE SPOTLIGHT HOOK
// ============================================
// Global spotlight/command palette state management
// with keyboard shortcut support (Cmd+K / Ctrl+K)

interface SpotlightContextValue {
  /** Whether the spotlight is open */
  open: boolean;
  /** Open the spotlight */
  openSpotlight: () => void;
  /** Close the spotlight */
  closeSpotlight: () => void;
  /** Toggle the spotlight */
  toggleSpotlight: () => void;
  /** Set the search query programmatically */
  setQuery: (query: string) => void;
  /** Current search query */
  query: string;
}

const SpotlightContext = React.createContext<SpotlightContextValue | null>(
  null,
);

interface SpotlightProviderProps {
  children: React.ReactNode;
  /** Custom keyboard shortcut (default: ['meta', 'k'] or ['ctrl', 'k']) */
  shortcut?: string[];
  /** Disable the global keyboard shortcut */
  disableShortcut?: boolean;
}

function matchesShortcut(event: KeyboardEvent, shortcut: string[]) {
  const key = shortcut[shortcut.length - 1]?.toLowerCase();

  if (event.key.toLowerCase() !== key) return false;
  const requiresMeta = shortcut.includes("meta") || shortcut.includes("cmd");

  const modifiers = [
    [requiresMeta, event.metaKey],
    [shortcut.includes("ctrl"), event.ctrlKey],
    [shortcut.includes("shift"), event.shiftKey],
    [shortcut.includes("alt"), event.altKey],
  ];

  if (!modifiers.every(([required, pressed]) => !required || pressed))
    return false;

  if (requiresMeta || shortcut.includes("ctrl")) return true;

  return navigator.platform.toUpperCase().includes("MAC")
    ? event.metaKey
    : event.ctrlKey;
}

export function SpotlightProvider({
  children,
  shortcut = ["k"],
  disableShortcut = false,
}: SpotlightProviderProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const openSpotlight = React.useCallback(() => {
    setOpen(true);
  }, []);

  const closeSpotlight = React.useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const toggleSpotlight = React.useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setQuery("");
      }

      return !prev;
    });
  }, []);

  // Global keyboard shortcut handler
  React.useEffect(() => {
    if (disableShortcut) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault();
        toggleSpotlight();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, disableShortcut, toggleSpotlight]);

  const contextValue = React.useMemo(
    () => ({
      open,
      openSpotlight,
      closeSpotlight,
      toggleSpotlight,
      query,
      setQuery,
    }),
    [open, openSpotlight, closeSpotlight, toggleSpotlight, query],
  );

  return (
    <SpotlightContext.Provider value={contextValue}>
      {children}
    </SpotlightContext.Provider>
  );
}

export function useSpotlight() {
  const context = React.useContext(SpotlightContext);

  if (!context) {
    throw new Error("useSpotlight must be used within a SpotlightProvider");
  }

  return context;
}

// ============================================
// STANDALONE SPOTLIGHT STATE HOOK
// ============================================
// For use without provider (local state)

interface UseSpotlightStateOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Enable global keyboard shortcut */
  enableShortcut?: boolean;
  /** Custom keyboard shortcut */
  shortcut?: string[];
}

export function useSpotlightState(options: UseSpotlightStateOptions = {}) {
  const {
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
    enableShortcut = true,
    shortcut = ["k"],
  } = options;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [previousQuery, setPreviousQuery] = React.useState(query);

  if (previousQuery !== query) {
    setPreviousQuery(query);
    setSelectedIndex(-1);
  }

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React state actions intentionally accept a boolean or updater function.
      const newValue = typeof value === "function" ? value(open) : value;

      if (!isControlled) {
        setUncontrolledOpen(newValue);
      }

      onOpenChange?.(newValue);

      if (!newValue) {
        setQuery("");
        setSelectedIndex(-1);
      }
    },
    [isControlled, open, onOpenChange],
  );

  const openSpotlight = React.useCallback(() => setOpen(true), [setOpen]);
  const closeSpotlight = React.useCallback(() => setOpen(false), [setOpen]);

  const toggleSpotlight = React.useCallback(
    () => setOpen((prev) => !prev),
    [setOpen],
  );

  // Keyboard shortcut
  React.useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = shortcut[shortcut.length - 1]?.toLowerCase();
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const metaOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      if (event.key.toLowerCase() === key && metaOrCtrl) {
        event.preventDefault();
        toggleSpotlight();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, shortcut, toggleSpotlight]);

  return {
    open,
    setOpen,
    openSpotlight,
    closeSpotlight,
    toggleSpotlight,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
  };
}

export { SpotlightContext };

export type {
  SpotlightContextValue,
  SpotlightProviderProps,
  UseSpotlightStateOptions,
};
